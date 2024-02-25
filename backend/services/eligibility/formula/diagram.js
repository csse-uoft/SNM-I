const {getParser} = require("./parser");

const fs = require("fs");
const path = require('path');

(async function () {
  const chevrotain = await import('chevrotain');
  const {FormulaParser} = await getParser();

  // extract the serialized grammar.
  const parserInstance = new FormulaParser();
  const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
  const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar);

// Write the HTML file to disk
  fs.writeFileSync(path.join(__dirname, '..', '..', '..', '..', 'frontend', 'public', 'formula_diagram.html'), htmlText);

})();

