class WeightedDirectedGraph {
  constructor() {
    // @type Map<VertexClass, Map<VertexClass, WeightClass>>;
    this.adjacentList = new Map();
  }

  addVertex(vertex) {
    this.adjacentList.set(vertex, new Map());
  }

  addEdge(source, destination, distance) {
    if (!this.adjacentList.has(source)) {
      this.addVertex(source);
    }

    if (!this.adjacentList.has(destination)) {
      this.addVertex(destination);
    }

    if (!this.adjacentList.get(source).has(destination)) {
      this.adjacentList.get(source).set(destination, distance);
    }
  }

  removeEdge(source, destination) {
    if (this.hasEdge(source, destination)) {
      this.adjacentList.get(source).delete(destination);
      if (this.adjacentList.get(source).size === 0) {
        this.adjacentList.delete(source);
      }
    }
  }

  hasEdge(source, destination) {
    return this.adjacentList.has(source) && this.adjacentList.has(destination) && this.adjacentList.get(source).has(destination);
  }


  clear() {
    this.adjacentList.clear();
    this.weightCount = 0;
  }

  /**
   * Find the shortest path from `source` to `targets`.
   * @param source
   * @param targets
   * @returns {{distance: number, path: string[]}[]}
   */
  findShortestPath(source, targets) {
    // uri -> {distance: number, path: string[]}
    const cache = new Map([[source, {distance: 0, path: [source]}]]);

    // BFS
    const nextNodes = new Set([[source]]);
    while (nextNodes.size > 0) {
      for (const path of nextNodes) {
        const source = path[path.length - 1];
        const destinations = this.adjacentList.get(source).entries();
        for (const [destination, distance] of destinations) {
          const newPath = [...path, destination];
          const newDistance = cache.get(source).distance + distance;

          if (!cache.has(destination)) {
            cache.set(destination, {distance: newDistance, path: newPath});
          } else {
            const oldDistance = cache.get(destination).distance;
            if (newDistance < oldDistance) {
              cache.set(destination, {distance: newDistance, path: newPath});
            } else if (newDistance === oldDistance) {
              // Pick the shorter path
              cache.set(destination, {
                distance: newDistance,
                path: newPath.length < cache.get(destination).path.length ? newPath : cache.get(destination).path
              });
            }
          }
          nextNodes.add(newPath);
        }
        nextNodes.delete(path);
      }
    }
    const results = [];
    for (const target of targets) {
      if (cache.has(target)) {
        results.push(cache.get(target));
      }
    }
    return results;
  }

  printGraph() {
    const sources = this.adjacentList.keys();
    for (const source of sources) {
      const destinationMap = this.adjacentList.get(source);
      const destinations = [...destinationMap.keys()];
      let str = "";
      if (destinations.length > 0) {
        for (const destination of destinations) {
          str += `${destination}(${JSON.stringify(destinationMap.get(destination))}), `;
        }
        console.log(source + " -> " + str.substring(0, str.length - 2));
      }
    }
  }
}

module.exports = {
  WeightedDirectedGraph
}
