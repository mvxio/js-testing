const lazyeager = require('../lazyeager');
const chai = require('chai');

const Vertex = lazyeager.Vertex;
const Graph = lazyeager.Graph;
const Solver = lazyeager.Solver;
const GraphAware = lazyeager.GraphAware;

const expect = chai.expect;

describe('Vertex', () => {
    describe('#constructor()', () => {
        it('should throw exception on construction by default', () => {
            expect(() => new Vertex()).throws();
        });

        it('should throw exception if func is not a function', () => {
            expect(() => new Vertex('hi')).throws();
        });

        it('should throw exception if one of args is not a string', () => {
            expect(() => new Vertex(() => 0, 1, 2)).throws();
        });

        it('should be an instance of Vertex if constructed with function', () => {
            const vertex = new Vertex(() => 0);
            expect(vertex).to.be.an.instanceof(Vertex);
        });

        it('should be an instance of Vertex if constructed with function and arguments', () => {
            const vertex = new Vertex(() => 0, '1', '2');
            expect(vertex).to.be.an.instanceof(Vertex);
        });
    });

    describe('#isComputed()', () => {
        it('should return boolean', () => {
            const vertex = new Vertex(() => 0);
            expect(vertex.isComputed()).to.be.an('boolean');
        });

        it('should return false if not computed', () => {
            const vertex = new Vertex(() => 0);
            expect(vertex.isComputed()).to.be.false;
        });

        it('should return true if computed', () => {
            const vertex = new Vertex(() => 0);
            vertex.compute();
            expect(vertex.isComputed()).to.be.true;
        });
    });

    describe('#compute()', () => {
        it('should not throw exceptions if invoked without parameters', () => {
            const vertex = new Vertex(() => 13);
            expect(() => vertex.compute()).not.throws();
        });

        it('should compute and set correct value', () => {
            const vertex = new Vertex((a, b, c) => a + b + c);
            vertex.compute(1, -2, 6);
            expect(vertex.result).to.equal(5);
        });

        it('should compute and set an array', () => {
            const vertex = new Vertex(() => [1, 2, 3]);
            vertex.compute();
            expect(vertex.result).to.deep.equal([1, 2, 3]);
        });
    });
});

describe('Graph', () => {
    describe('#constructor()', () => {
        it('should be an instance of Graph', () => {
            const graph = new Graph();
            expect(graph).to.be.an.instanceof(Graph);
        });
    });

    describe('#addVertex()', () => {
        it('should throw exception if name is not a string', () => {
            const graph = new Graph();
            const vertex = new Vertex((x) => x);
            expect(() => graph.addVertex(13, vertex)).throws();
        });

        it('should throw exception if vertex is not an instance of Vertex', () => {
            const graph = new Graph();
            expect(() => graph.addVertex(13, 'Vertex')).throws();
        });

        it('should add vertex to graph', () => {
            const graph = new Graph();
            const vertex = new Vertex((x) => x);
            expect(() => graph.addVertex('a', vertex)).not.throws();
        });
    });

    describe('#getVertex()', () => {
        it('should throw exception if name is not a string', () => {
            const graph = new Graph();
            const vertex = new Vertex((x) => x);
            expect(() => graph.getVertex(23)).throws();
        });

        it('should return undefined if vertex not exist', () => {
            const graph = new Graph();
            expect(graph.getVertex('test')).to.be.undefined;
        });

        it('should return correct vertex', () => {
            const graph = new Graph();
            const vertex = new Vertex((a) => 2 * a - 1);
            graph.addVertex('v', vertex);
            expect(graph.getVertex('v')).to.deep.equal(vertex);
        });
    });  
});

describe('Solver', () => {
    describe('#constructor()', () => {
        it('should throw exception if graph is not an instance of Graph', () => {
            expect(() => new Solver()).throws();
        });

        it('should be an instance of Solver', () => {
            const graph = new Graph();
            const solver = new Solver(graph);
            expect(solver).to.be.an.instanceof(Solver);
        });
    });

    describe('#solve()', () => {
        it('should throw exception if vertexName is not a string', () => {
            const vertex = new Vertex((x) => x / 2);
            const graph = new Graph();
            graph.addVertex('v', vertex);
            const solver = new Solver(graph);
            expect(() => solver.solve(123)).throws();
        });

        it('should throw exception if there is no vertexName in the graph', () => {
            const vertex = new Vertex((x) => x / 2);
            const graph = new Graph();
            graph.addVertex('v', vertex);
            const solver = new Solver(graph);
            expect(() => solver.solve('test')).throws();
        });

        it('should throw exception if cyclic graph', () => {
            const graph = new Graph();
            graph.addVertex('a', new Vertex((b) => 2*b, 'b'));
            graph.addVertex('b', new Vertex((c) => 2*c, 'c'));
            graph.addVertex('c', new Vertex((a) => 2*a, 'a'));
            const solver = new Solver(graph);
            expect(() => solver.solve('a')).throws();
        });

        it('should return correct value', () => {
            const graph = new Graph();
            graph.addVertex('a', new Vertex((x) => 2 * x, 'b'));
            graph.addVertex('b', new Vertex(() => 2));
            const solver = new Solver(graph);
            expect(solver.solve('a')).to.equal(4);
        });
    });
});

describe('GraphAware', () => {
    describe('#constructor()', () => {
        it('should be an instance of GraphAware', () => {
            expect(new lazyeager.GraphAware()).to.be.an.instanceof(lazyeager.GraphAware);
        });
    });

    describe('#setGraph()', () => {
        it('should throw exception if graph is not an instance of Graph', () => {
            const graphAware = new lazyeager.GraphAware();
            expect(() => graphAware.setGraph('Graph')).throws();
        });

        it('should set graph', () => {
            const graphAware = new lazyeager.GraphAware();
            expect(() => graphAware.setGraph(new lazyeager.Graph())).not.throws();
        });
    });
});
