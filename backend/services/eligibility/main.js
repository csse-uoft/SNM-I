require('dotenv').config()
const {load} = require("../../loaders/graphDB");
const {matchFromClient, getEligibilityConfig} = require("./index");

// for testing
async function main() {
  await load();
  // console.log(await matchFromClient(2))
  // console.log(await getKindOfParentDistances([':need_4', ':need_5'], ':Need'));
  console.log(JSON.stringify(await getEligibilityConfig(), null, 2))
  process.exit(0);
}

main()