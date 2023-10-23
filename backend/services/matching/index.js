const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {WeightedDirectedGraph} = require("./graph");
const {getNeeds2NeedSatisfiers, getNeeds2Characteristics, getCharacteristics2NeedSatisfiers,
  getNeedSatisfier2ProgramsOrServices, getKindOfParentDistances
} = require("./queries");


async function matchFromClientHandler(req, res, next) {
  const {matches, services2Name, program2Name} = await matchFromClient(req.params.clientId);

  for (const match of matches) {
    const targetURI = match.path[match.path.length - 1];
    if (services2Name.has(targetURI)) {
      match.type = 'service';
      match.name = services2Name.get(targetURI);
    } else if (program2Name.has(targetURI)) {
      match.type = 'program';
      match.name = program2Name.get(targetURI);
    }
  }

  res.json({
    success: true,
    data: matches,
  });
}


async function matchFromClient(clientId) {
  const graph = new WeightedDirectedGraph();
  const client = await GDBClientModel.findById(clientId);
  if (client.needs == null) {
    return {
      matches: [],
      program2Name: new Map(),
      services2Name: new Map(),
    }
  }

  client.needs.forEach(need => graph.addEdge(client._uri, need, 0));

  // Get Need -> parent Need
  const needDistances = await getKindOfParentDistances(client.needs, ':Need');
  const allNeeds = new Set(client.needs);
  for (const {src, dst, distance} of needDistances) {
    graph.addEdge(src, dst, distance * 2)
    allNeeds.add(dst);
  }
  // console.log('needDistances', needDistances);
  // console.log('all needs:', allNeeds);

  // Get Need -> Need satisfier
  const allNeedSatisfiers = new Set();
  const need2NeedSatisfiers = await getNeeds2NeedSatisfiers([...allNeeds]);
  for (const {need, needSatisfier} of need2NeedSatisfiers) {
    // Need -> Need Satisfier has distance of 1
    graph.addEdge(need, needSatisfier, 1);
    allNeedSatisfiers.add(needSatisfier);
  }

  // Get Need -> characteristics
  const allCharacteristics = new Set();
  const need2Characteristics = await getNeeds2Characteristics([...allNeeds]);
  for (const {need, characteristic} of need2Characteristics) {
    // Need -> Characteristic has distance of 1
    graph.addEdge(need, characteristic, 1);
    allCharacteristics.add(characteristic);
  }

  // Get characteristic -> parent characteristic
  const characteristicDistances = await getKindOfParentDistances(allCharacteristics, ':characteristics');
  for (const {src, dst, distance} of characteristicDistances) {
    graph.addEdge(src, dst, distance * 2)
    allCharacteristics.add(dst);
  }

  // console.log('all Characteristics:', allCharacteristics);

  // Get characteristic -> Need Satisfier
  const characteristics2NeedSatisfiers = await getCharacteristics2NeedSatisfiers(allCharacteristics);
  for (const {characteristic, needSatisfier} of characteristics2NeedSatisfiers) {
    graph.addEdge(characteristic, needSatisfier, 1);
    allNeedSatisfiers.add(needSatisfier);
  }

  // Get Need Satisfier -> Parent Need Satisfier
  const needSatisfierDistances = await getKindOfParentDistances(allNeedSatisfiers, ':NeedSatisfier');
  for (const {src, dst, distance} of needSatisfierDistances) {
    graph.addEdge(src, dst, distance * 2)
    allNeedSatisfiers.add(dst);
  }

  const program2Name = new Map();
  const services2Name = new Map();

  // Get Need Satisfier -> Program/Service
  const {programs, services} = await getNeedSatisfier2ProgramsOrServices(allNeedSatisfiers);
  for (const {needSatisfier, program, name} of programs) {
    graph.addEdge(needSatisfier, program, 0);
    program2Name.set(program, name);
  }
  for (const {needSatisfier, service, name} of services) {
    graph.addEdge(needSatisfier, service, 0);
    services2Name.set(service, name);
  }

  // graph.printGraph();
  return {
    matches: graph.findShortestPath(client._uri, [...program2Name.keys(), ...services2Name.keys()]),
    program2Name,
    services2Name
  };
}


module.exports = {
  matchFromClientHandler,
  matchFromClient,
}