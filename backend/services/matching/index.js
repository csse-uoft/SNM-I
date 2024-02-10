const {GDBClientModel} = require("../../models/ClientFunctionalities/client");
const {WeightedDirectedGraph} = require("./graph");
const {
  getNeeds2NeedSatisfiers, getNeeds2Characteristics, getCharacteristics2NeedSatisfiers,
  getNeedSatisfier2ProgramsOrServices, getKindOfParentDistances
} = require("./queries");
const {getEligibilityFormulaEvaluator} = require("../eligibility/formula/interpreter");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBProgramModel} = require("../../models/program/program");
const {fetchSingleGenericHelper} = require("../genericData");
const {SPARQL} = require("graphdb-utils");


async function matchFromClientHandler(req, res, next) {
  try {
    const {matches, services2Name, program2Name} = await matchFromClient(req.params.clientId, req.params.needId);

    res.json({
      success: true,
      data: matches,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }

}


async function matchFromClient(clientId, needId) {
  const graph = new WeightedDirectedGraph();
  const client = await GDBClientModel.findById(clientId);
  const clientData = await fetchSingleGenericHelper('client', clientId);
  const specifiedNeedURI = SPARQL.ensureFullURI(`:need_${needId}`);
  if (client.needs == null || !client.needs.includes(specifiedNeedURI)) {
    return {
      matches: [],
      program2Name: new Map(),
      services2Name: new Map(),
    }
  }

  graph.addEdge(client._uri, specifiedNeedURI, 0)
  // client.needs.forEach(need => graph.addEdge(client._uri, need, 0));

  // Get Need -> parent Need
  const needDistances = await getKindOfParentDistances([specifiedNeedURI], ':Need');
  const allNeeds = new Set([specifiedNeedURI]);
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

  const matches = graph.findShortestPath(client._uri, [...program2Name.keys(), ...services2Name.keys()]);


  // Initialize the formula evaluator
  const EligibilityFormulaEvaluator = await getEligibilityFormulaEvaluator();
  const evaluator = new EligibilityFormulaEvaluator({...clientData});

  for (const match of matches) {
    const targetURI = match.path[match.path.length - 1];

    // Add type and service/program name
    if (services2Name.has(targetURI)) {
      match.type = 'service';
      match.name = services2Name.get(targetURI);
    } else if (program2Name.has(targetURI)) {
      match.type = 'program';
      match.name = program2Name.get(targetURI);
    }

    // Evaluate the formula if existed
    // In the case where the formula does not exist, set eligibilityMatched to `null`
    match.eligibilityMatched = null;
    const Model = match.type === 'service' ? GDBServiceModel : GDBProgramModel;
    const {eligibility} = await Model.findByUri(targetURI, {populates: ['eligibility']});
    if (eligibility && eligibility.formula) {
      const formula = eligibility.formula;
      const result = evaluator.evaluateFormula(formula);
      match.eligibilityMatched = !!result;
    }
  }


  // graph.printGraph();
  return {
    matches,
    program2Name,
    services2Name
  };
}


module.exports = {
  matchFromClientHandler,
  matchFromClient,
}