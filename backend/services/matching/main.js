require('dotenv').config()
const {load} = require("../../loaders/graphDB");
const {matchFromClient} = require("./index");

// for testing
async function main() {
  await load();
  console.log(await matchFromClient(2))
  // console.log(await getKindOfParentDistances([':need_4', ':need_5'], ':Need'));
  process.exit(0);
}

main()