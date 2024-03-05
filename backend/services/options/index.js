const { GraphDB } = require('graphdb-utils');
const {randomUUID} = require("crypto");

async function initOptions(optionText, options, optionType, uriPrefix) {
  console.log(`Initializing ${optionText}...`);
  const query = `
    PREFIX : <http://snmi#>
    select (count(?s) as ?num) 
    from <http://www.ontotext.com/explicit>
    where { 
      \t?s a :${optionType}.
    }
  `;
  let numberOfOptions = 0;
  await GraphDB.sendSelectQuery(query, false, ({ num }) => numberOfOptions = Number(num.value));

  // If number does not match, delete all and add it back
  if (numberOfOptions !== options.length) {
    await GraphDB.sendUpdateQuery(`
      PREFIX : <http://snmi#>
      with <http://www.ontotext.com/explicit>
      delete {
          ?s a :${optionType}.
          ?s ?p ?o.
      }
      where {
         ?s a :${optionType}.
         ?s ?p ?o.
      }
    `);
    const triples = [];
    let cnt = 1;
    for (const option of options) {
      triples.push(`:${uriPrefix}_${randomUUID()} rdf:type owl:NamedIndividual, :${optionType};\n\t rdfs:label "${option}".`);
      cnt++;
    }
    await GraphDB.sendUpdateQuery(`
      PREFIX : <http://snmi#> 
      INSERT DATA {${triples.join('\n')}}`
    );
  }

  console.log(`${optionText} initialized`);
}

module.exports = { initOptions }
