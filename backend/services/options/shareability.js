const { GraphDB } = require('graphdb-utils')

const shareabilities = ["Shareable with partner organizations", "Shareable with all organizations", "Not shareable"];

async function initShareabilities() {
  console.log('Initializing shareabilities...');
  const query = `
    PREFIX : <http://snmi#>
    select (count(?s) as ?num) 
    from <http://www.ontotext.com/explicit>
    where { 
      \t?s a :Shareability.
    }
  `;
  let numberOfShareabilities = 0;
  await GraphDB.sendSelectQuery(query, false, ({ num }) => numberOfShareabilities = Number(num.value));

  // If number does not match, delete all and add it back
  if (numberOfShareabilities !== shareabilities.length) {
    await GraphDB.sendUpdateQuery(`
      PREFIX : <http://snmi#>
      with <http://www.ontotext.com/explicit>
      delete {
          ?s a :Shareability.
          ?s ?p ?o.
      }
      where {
         ?s a :Shareability.
         ?s ?p ?o.
      }
    `);
    const triples = [];
    let cnt = 1;
    for (const shareability of shareabilities) {
      triples.push(`:shareability_${cnt} rdf:type owl:NamedIndividual, :Shareability;\n\t rdfs:label "${shareability}".`);
      cnt++;
    }
    await GraphDB.sendUpdateQuery(`
      PREFIX : <http://snmi#> 
      INSERT DATA {${triples.join('\n')}}`
    );
  }

  console.log('Shareabilities initialized');
}

module.exports = { initShareabilities }
