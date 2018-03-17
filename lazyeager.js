class Vertex {
  constructor(func, ...args) {
    if (typeof func !== 'function') {
      throw new Error('"func" is not a function.');
    }

    for (let arg of args) {
      if (typeof arg !== 'string') {
        throw new Error('args is not a strings.');
      }
    }

    this._func = func;
    this._args = args;
    this._result = undefined;
  }

  get func() {
    return this._func;
  }

  get args() {
    return this._args;
  }

  get result() {
    return this._result;
  }
  
  compute(...params) {
    this._result = this._func(...params);
  }
  
  isComputed() {
    return this._result !== undefined;
  }
}

class Graph {
  constructor() {
    this._vertices = {};
  }

  get vertices() {
    return this._vertices;
  }
  
  addVertex(name, vertex) {
    if (typeof name != 'string') {
      throw new Error('name is not a string.');
    }

    if (!(vertex instanceof Vertex)) {
      throw new Error('vertex is not an instance of Vertex.');
    }

    this._vertices[name] = vertex;
  }
  
  getVertex(name) {
    if (typeof name != 'string') {
      throw new Error('name is not a string.');
    }

    return this._vertices[name];
  }
}

class Solver {
  constructor(graph) {
    if (!(graph instanceof Graph)) {
      throw new Error('graph is not an instance of Graph.');
    }

    this._graph = graph;
    this._verticesNames = [];
  }
  
  solve(vertexName) {   
    if (this._verticesNames.includes(vertexName)) {
      this._verticesNames.push(vertexName);
      const cycleString = this._verticesNames.join(' => ');
      throw new Error(`cyclic graph detected (${cycleString})`);
    }
    
    const vertex = this._graph.getVertex(vertexName);
    if (!vertex) {
      throw new Error(`there is no vertex "${vertexName}" in the graph.`);
    }

    if (!vertex.isComputed()) {
      this._verticesNames.push(vertexName);
      
      const params = [];

      if (vertex.args) {
        vertex.args.forEach(arg => {
          params.push(this.solve(arg))
        });
      }
      vertex.compute(...params);
      
      this._verticesNames.pop();
    }
    
    return vertex.result;
  }
}

class GraphAware {
  constructor() {
    this._graph = undefined;
  }

  setGraph(graph) {
    if (!(graph instanceof Graph)) {
      throw new Error('graph is not an instance of Graph');
    }
    this._graph = graph
  }
}

class LazyGraph extends GraphAware {  
  solve(vertexName) {
    const solver = new Solver(this._graph);
    return [vertexName, solver.solve(vertexName)];
  }
}

class EagerGraph extends GraphAware {
  solve() {
    const results = [];
    const solver = new Solver(this._graph);
    for (let vertexName in this._graph.vertices) {
      results.push([vertexName, solver.solve(vertexName)]);
    }
    return results;
  }
}

module.exports = {
  Vertex,
  Graph,
  Solver,
  GraphAware,
  LazyGraph,
  EagerGraph
}
