const {GDBStreetType} = require('../../models/address');
const {GraphDB} = require('graphdb-utils')
const {randomUUID} = require("crypto");


// https://www150.statcan.gc.ca/n1/pub/92-500-g/2013001/tbl/tbl4-3-eng.htm
const streetDirections = ["E (East / Est)", "N (North / Nord)", "NE (North East / Nord-est)", "NO (Nord-ouest)",
  "NW (North West)", "O (Ouest)", "S (South / Sud)", "SE (South East / Sud-est)", "SO (Sud-ouest)", "SW (South West)",
  "W (West)"];


async function initStreetDirections() {
  console.log('Initializing street directions...');
  const query = `
    PREFIX ic: <http://ontology.eil.utoronto.ca/tove/icontact#>
    select (count(?s) as ?num) 
    from <http://www.ontotext.com/explicit>
    where { 
      \t?s a ic:StreetDirection.
    }
  `;
  let numberOfStreetDirections = 0;
  await GraphDB.sendSelectQuery(query, false, ({num}) => numberOfStreetDirections = Number(num.value));

  // If number does not match, delete all and add it back
  if (numberOfStreetDirections !== streetDirections.length) {
    await GraphDB.sendUpdateQuery(`
      PREFIX ic: <http://ontology.eil.utoronto.ca/tove/icontact#>
      with <http://www.ontotext.com/explicit>
      delete {
          ?s a ic:StreetDirection.
          ?s ?p ?o.
      }
      where {
         ?s a ic:StreetDirection.
         ?s ?p ?o.
      }
    `);
    const triples = [];
    for (const type of streetDirections) {
      triples.push(`:streetDirection_${randomUUID()} rdf:type owl:NamedIndividual, ic:StreetDirection;\n\t rdfs:label "${type}".`);
    }
    await GraphDB.sendUpdateQuery(`
      PREFIX ic: <http://ontology.eil.utoronto.ca/tove/icontact#>
      PREFIX : <http://snmi#> 
      INSERT DATA {${triples.join('\n')}}`
    );
  }

  console.log('Street directions initialized');
}

module.exports = {initStreetDirections}
