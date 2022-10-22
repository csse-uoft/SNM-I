const {Server400Error} = require("../../utils");

function noQuestion(characteristics, questions) {
  if (Object.keys(questions) > 0)
    throw new Server400Error('Service should not contain question.');
}

module.exports = {noQuestion}