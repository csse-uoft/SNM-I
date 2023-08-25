const {GDBStreetType} = require('../../models/address');
const {GraphDB} = require('graphdb-utils')


// https://www150.statcan.gc.ca/n1/pub/92-500-g/2013001/tbl/tbl4-2-eng.htm
const streetTypes = ["Abbey", "Access", "Acres", "Aire", "Alley", "Allée", "Autoroute", "Avenue", "Bay", "Beach",
  "Bend", "Bloc", "Block", "Boulevard", "Bourg", "Barrage", "Brook", "By-pass", "Byway", "Centre", "Campus", "Cape",
  "Carré", "Carrefour", "Cul-de-sac", "Cercle", "Chemin", "Chase", "Circle", "Circuit", "Close", "Common",
  "Concession", "Côte", "Cour", "Cours", "Cove", "Crescent", "Crest", "Corners", "Croft", "Croissant", "Crossing",
  "Crossroads", "Court", "Dale", "Dell", "Desserte", "Diversion", "Downs", "Drive", "Droit de passage", "Échangeur",
  "End", "Esplanade", "Estates", "Expressway", "Extension", "Farm", "Field", "Forest", "Front", "Forest service road",
  "Freeway", "Gate", "Gardens", "Glade", "Glen", "Green", "Grounds", "Grove", "Harbour", "Haven", "Heath", "Highlands",
  "Hill", "Hollow", "Heights", "Highway", "Île", "Impasse", "Inlet", "Island", "Key", "Knoll", "Landing", "Lane",
  "Laneway", "Line", "Link", "Lookout", "Limits", "Loop", "Mall", "Manor", "Maze", "Meadow", "Mews", "Montée",
  "Moor", "Mount", "Mountain", "Orchard", "Parade", "Parc", "Passage", "Path", "Peak", "Pines", "Park", "Parkway",
  "Place", "Plateau", "Plaza", "Pointe", "Port", "Promenade", "Point", "Pathway", "Private", "Quai", "Quay", "Ramp",
  "Rang", "Road", "Rond point", "Reach", "Range", "Ridge", "Rise", "Ruelle", "Route", "Row", "Right of way", "Rue",
  "Ruisseau", "Run", "Section", "Sentier", "Sideroad", "Square", "Street", "Stroll", "Subdivision", "Terrace",
  "Thicket", "Townline", "Towers", "Trace", "Trail", "Turnabout", "Trunk", "Terrasse", "Vale", "Via", "View",
  "Villas", "Village", "Vista", "Voie", "Walk", "Way", "Wharf", "Wood", "Wynd"];


async function initStreetTypes() {
  console.log('Initializing street types...');
  const query = `
    PREFIX ic: <http://ontology.eil.utoronto.ca/tove/icontact#>
    select (count(?s) as ?num) 
    from <http://www.ontotext.com/explicit>
    where { 
      \t?s a ic:StreetType.
    }
  `;
  let numberOfStreetTypes = 0;
  await GraphDB.sendSelectQuery(query, false, ({num}) => numberOfStreetTypes = Number(num.value));

  // If number does not match, delete all and add it back
  if (numberOfStreetTypes !== streetTypes.length) {
    await GraphDB.sendUpdateQuery(`
      PREFIX ic: <http://ontology.eil.utoronto.ca/tove/icontact#>
      with <http://www.ontotext.com/explicit>
      delete {
          ?s a ic:StreetType.
      }
      where {
         ?s a ic:StreetType.
      }
    `);
    const triples = [];
    let cnt = 1;
    for (const type of streetTypes) {
      triples.push(`:streetType_${cnt} rdf:type owl:NamedIndividual, ic:StreetType;\n\t rdfs:label "${type}".`);
      cnt++;
    }
    await GraphDB.sendUpdateQuery(`
      PREFIX ic: <http://ontology.eil.utoronto.ca/tove/icontact#>
      PREFIX : <http://snmi#> 
      INSERT DATA {${triples.join('\n')}}`
    );
  }

  console.log('Street types initialized');
}

module.exports = {initStreetTypes}
