class GraphDBError extends Error {
  constructor(functionName, e) {
    if (!e.config) {
      return e;
    }
    const query = e.config.data;
    // const formattedQuery = query.replace(/([,;.])|([{}])|(\s*(PREFIX|insert data|select|delete))/ig, (match, p1, p2, p3) => {
    //   if (p1) return `${p1}\n\t`;
    //   if (p2) return `${p2}\n\t`;
    //   if (p3) return '\n' + p3.trim().toUpperCase();
    // });
    const message =
      `GraphDB.${functionName}: ${e.response.data}\nSPARQL:\n${query}`
    super(message);
  }
}

module.exports = {GraphDBError}
