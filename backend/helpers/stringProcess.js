const extractAllIndexes = (inputString) => {
  // Normal split will give result like  [ 'xx', 'http://snmi#xx_xx', '' ]
  // So, we need to remove the first and last element

  // This functions has been used for processing the results returned from searching query

  let allIndexes = [];

  if (inputString === undefined) {
    return [];
  }
  allIndexes = inputString.split(/\r?\n/);

  // console.log("All Indexes before: ", allIndexes)
  allIndexes.shift()

  allIndexes.pop()

  // console.log("All Indexes after: ", allIndexes)
  return allIndexes;
}

module.exports = {
  extractAllIndexes
}