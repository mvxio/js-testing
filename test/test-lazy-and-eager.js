const lazyeager = require('../lazyeager');
const chai = require('chai');

const Vertex = lazyeager.Vertex;
const Graph = lazyeager.Graph;
const LazyGraph = lazyeager.LazyGraph;
const EagerGraph = lazyeager.EagerGraph;

const expect = chai.expect;

//(def stats-graph
//  {:n  (fnk [xs]   (count xs))
//   :m  (fnk [xs n] (/ (sum identity xs) n))
//   :m2 (fnk [xs n] (/ (sum #(* % %) xs) n))
//   :v  (fnk [m m2] (- m2 (* m m)))})
const makeGraph = () => {
    // stats-graph
    const graph = new Graph();

    // xs
    graph.addVertex('xs', new Vertex(() => [1, 2, 3, 6]));

    // :n  (fnk [xs]   (count xs))
    graph.addVertex('n', new Vertex((xs) => xs.length, 'xs'));

    // :m  (fnk [xs n] (/ (sum identity xs) n))
    graph.addVertex('m', new Vertex((xs, n) => {
        let sum = 0;
        for (let i of xs) {
            sum += i;
        }
        return sum/n;
    }, 'xs', 'n'));

    // :m2 (fnk [xs n] (/ (sum #(* % %) xs) n))
    graph.addVertex('m2', new Vertex((xs, n) => {
        let sum = 0;
        for (let i of xs) {
            sum += i * i;
        }
        return sum/n;
    }, 'xs', 'n'));

    // :v  (fnk [m m2] (- m2 (* m m)))
    graph.addVertex('v', new Vertex((m, m2) => m2 - m * m, 'm', 'm2'));

    return graph;
};

describe('LazyGraph', () => {
    describe('#constructor()', () => {
        it('should be an instance of LazyGraph', () => {
            expect(new LazyGraph()).to.be.an.instanceof(LazyGraph);
        });
    });

    describe('#solve()', () => {
        it('should return solution for concrete vertex', () => {
            const snapshot = ['m', 3];
            const graph = makeGraph();
            const lazy = new LazyGraph();
            lazy.setGraph(graph);
            expect(lazy.solve('m')).to.be.deep.equal(['m', 3]);
        });
    });
});

describe('EagerGraph', () => {
    describe('#constructor()', () => {
        it('should be an instance of EagerGraph', () => {
            expect(new EagerGraph()).to.be.an.instanceof(EagerGraph);
        });
    });

    describe('#solve()', () => {
        it('should return solution for all vertices', () => {
            const snapshot = [
                ['xs', [1, 2, 3, 6]],
                ['n', 4],
                ['m', 3],
                ['m2', 12.5],
                ['v', 3.5]
            ];
            const graph = makeGraph();
            const eager = new EagerGraph();
            eager.setGraph(graph);
            expect(eager.solve()).to.be.deep.equal(snapshot);
        });
    });
});
