import { BettiCalculator, Vertex, Edge, BettiNumbers } from '../phase1-geometric-consensus/betti-numbers.js';

/**
 * Test suite for Betti number calculations and partition detection.
 * Tests topological invariants and connected component detection.
 */
export function testBettiNumbers(): boolean {
  console.log('Testing Betti Numbers...');

  const calculator = new BettiCalculator();
  let testsPassed = 0;
  let testsTotal = 0;

  // Helper function to run a test
  function runTest(testName: string, testFn: () => boolean): void {
    testsTotal++;
    try {
      if (testFn()) {
        console.log(`✅ ${testName}`);
        testsPassed++;
      } else {
        console.log(`❌ ${testName}`);
      }
    } catch (error) {
      console.log(`❌ ${testName} - Error: ${(error as Error).message}`);
    }
  }

  // Test 1: Empty graph
  runTest('Empty graph', () => {
    const vertices: Vertex[] = [];
    const edges: Edge[] = [];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 0 && betti.beta_1 === 0 && betti.beta_2 === 0;
  });

  // Test 2: Single vertex
  runTest('Single vertex', () => {
    const vertices: Vertex[] = [{ id: 'v1', name: 'Vertex 1', connected: new Set() }];
    const edges: Edge[] = [];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti);
  });

  // Test 3: Two disconnected vertices
  runTest('Two disconnected vertices', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set() },
      { id: 'v2', name: 'Vertex 2', connected: new Set() }
    ];
    const edges: Edge[] = [];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 2 && calculator.detectPartition(betti) && calculator.countPartitions(betti) === 2;
  });

  // Test 4: Two connected vertices
  runTest('Two connected vertices', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set(['v2']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['v1']) }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'v1', to: 'v2' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti) && calculator.countPartitions(betti) === 1;
  });

  // Test 5: Triangle (3 vertices, 3 edges)
  runTest('Triangle graph', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set(['v2', 'v3']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['v1', 'v3']) },
      { id: 'v3', name: 'Vertex 3', connected: new Set(['v1', 'v2']) }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'v1', to: 'v2' },
      { id: 'e2', from: 'v2', to: 'v3' },
      { id: 'e3', from: 'v3', to: 'v1' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti);
  });

  // Test 6: Two separate triangles
  runTest('Two separate triangles', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set(['v2', 'v3']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['v1', 'v3']) },
      { id: 'v3', name: 'Vertex 3', connected: new Set(['v1', 'v2']) },
      { id: 'v4', name: 'Vertex 4', connected: new Set(['v5', 'v6']) },
      { id: 'v5', name: 'Vertex 5', connected: new Set(['v4', 'v6']) },
      { id: 'v6', name: 'Vertex 6', connected: new Set(['v4', 'v5']) }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'v1', to: 'v2' },
      { id: 'e2', from: 'v2', to: 'v3' },
      { id: 'e3', from: 'v3', to: 'v1' },
      { id: 'e4', from: 'v4', to: 'v5' },
      { id: 'e5', from: 'v5', to: 'v6' },
      { id: 'e6', from: 'v6', to: 'v4' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 2 && calculator.detectPartition(betti) && calculator.countPartitions(betti) === 2;
  });

  // Test 7: Star graph (one central vertex connected to all others)
  runTest('Star graph', () => {
    const vertices: Vertex[] = [
      { id: 'center', name: 'Center', connected: new Set(['v1', 'v2', 'v3', 'v4']) },
      { id: 'v1', name: 'Vertex 1', connected: new Set(['center']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['center']) },
      { id: 'v3', name: 'Vertex 3', connected: new Set(['center']) },
      { id: 'v4', name: 'Vertex 4', connected: new Set(['center']) }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'center', to: 'v1' },
      { id: 'e2', from: 'center', to: 'v2' },
      { id: 'e3', from: 'center', to: 'v3' },
      { id: 'e4', from: 'center', to: 'v4' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti);
  });

  // Test 8: Path graph (linear chain)
  runTest('Path graph', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set(['v2']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['v1', 'v3']) },
      { id: 'v3', name: 'Vertex 3', connected: new Set(['v2', 'v4']) },
      { id: 'v4', name: 'Vertex 4', connected: new Set(['v3']) }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'v1', to: 'v2' },
      { id: 'e2', from: 'v2', to: 'v3' },
      { id: 'e3', from: 'v3', to: 'v4' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti);
  });

  // Test 9: Complete graph (all vertices connected to all others)
  runTest('Complete graph', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set(['v2', 'v3', 'v4']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['v1', 'v3', 'v4']) },
      { id: 'v3', name: 'Vertex 3', connected: new Set(['v1', 'v2', 'v4']) },
      { id: 'v4', name: 'Vertex 4', connected: new Set(['v1', 'v2', 'v3']) }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'v1', to: 'v2' },
      { id: 'e2', from: 'v1', to: 'v3' },
      { id: 'e3', from: 'v1', to: 'v4' },
      { id: 'e4', from: 'v2', to: 'v3' },
      { id: 'e5', from: 'v2', to: 'v4' },
      { id: 'e6', from: 'v3', to: 'v4' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti);
  });

  // Test 10: Mixed connected and disconnected components
  runTest('Mixed connected and disconnected components', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set(['v2']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['v1']) },
      { id: 'v3', name: 'Vertex 3', connected: new Set() },
      { id: 'v4', name: 'Vertex 4', connected: new Set(['v5']) },
      { id: 'v5', name: 'Vertex 5', connected: new Set(['v4']) },
      { id: 'v6', name: 'Vertex 6', connected: new Set() }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'v1', to: 'v2' },
      { id: 'e2', from: 'v4', to: 'v5' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 4 && calculator.detectPartition(betti) && calculator.countPartitions(betti) === 4;
  });

  // Test 11: Large connected component
  runTest('Large connected component', () => {
    const vertices: Vertex[] = Array.from({ length: 10 }, (_, i) => ({
      id: `v${i + 1}`,
      name: `Vertex ${i + 1}`,
      connected: new Set(Array.from({ length: 10 }, (_, j) => `v${j + 1}`).filter(id => id !== `v${i + 1}`))
    }));
    const edges: Edge[] = [];
    // Create edges for complete graph
    for (let i = 0; i < 10; i++) {
      for (let j = i + 1; j < 10; j++) {
        edges.push({ id: `e${i}-${j}`, from: `v${i + 1}`, to: `v${j + 1}` });
      }
    }
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti);
  });

  // Test 12: Isolated vertices
  runTest('Isolated vertices', () => {
    const vertices: Vertex[] = Array.from({ length: 5 }, (_, i) => ({
      id: `isolated${i + 1}`,
      name: `Isolated ${i + 1}`,
      connected: new Set()
    }));
    const edges: Edge[] = [];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 5 && calculator.detectPartition(betti) && calculator.countPartitions(betti) === 5;
  });

  // Test 13: Self-loops (vertex connected to itself)
  runTest('Self-loops', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set(['v1', 'v2']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['v1']) }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'v1', to: 'v1' },
      { id: 'e2', from: 'v1', to: 'v2' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti);
  });

  // Test 14: Asymmetric connections
  runTest('Asymmetric connections', () => {
    const vertices: Vertex[] = [
      { id: 'v1', name: 'Vertex 1', connected: new Set(['v2']) },
      { id: 'v2', name: 'Vertex 2', connected: new Set(['v1', 'v3']) },
      { id: 'v3', name: 'Vertex 3', connected: new Set(['v2']) }
    ];
    const edges: Edge[] = [
      { id: 'e1', from: 'v1', to: 'v2' },
      { id: 'e2', from: 'v2', to: 'v3' }
    ];
    const betti = calculator.calculateBettiNumbers(vertices, edges);
    return betti.beta_0 === 1 && !calculator.detectPartition(betti);
  });

  // Test 15: Partition detection edge cases
  runTest('Partition detection edge cases', () => {
    const betti1: BettiNumbers = { beta_0: 0, beta_1: 0, beta_2: 0 };
    const betti2: BettiNumbers = { beta_0: 1, beta_1: 0, beta_2: 0 };
    const betti3: BettiNumbers = { beta_0: 2, beta_1: 0, beta_2: 0 };

    return !calculator.detectPartition(betti1) &&
           !calculator.detectPartition(betti2) &&
           calculator.detectPartition(betti3) &&
           calculator.countPartitions(betti1) === 0 &&
           calculator.countPartitions(betti2) === 1 &&
           calculator.countPartitions(betti3) === 2;
  });

  console.log(`\nBetti Numbers Tests: ${testsPassed}/${testsTotal} passed`);
  return testsPassed === testsTotal;
}
