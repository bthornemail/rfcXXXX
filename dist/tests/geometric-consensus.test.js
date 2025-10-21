import { GeometricConsensus } from '../phase1-geometric-consensus/geometric-consensus.js';
import { GeometricType } from '../phase1-geometric-consensus/geometric-types.js';
/**
 * Test suite for the Geometric Consensus system.
 * Tests all consensus methods and edge cases.
 */
export function testGeometricConsensus() {
    console.log('Testing Geometric Consensus...');
    const consensus = new GeometricConsensus();
    let testsPassed = 0;
    let testsTotal = 0;
    // Helper function to run a test
    function runTest(testName, testFn) {
        testsTotal++;
        try {
            if (testFn()) {
                console.log(`✅ ${testName}`);
                testsPassed++;
            }
            else {
                console.log(`❌ ${testName}`);
            }
        }
        catch (error) {
            console.log(`❌ ${testName} - Error: ${error.message}`);
        }
    }
    // Test 1: Tetrahedron (mustLocal) - unanimous consensus
    runTest('Tetrahedron unanimous consensus', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true },
            { id: 'node2', name: 'Node 2', agrees: true },
            { id: 'node3', name: 'Node 3', agrees: true },
            { id: 'node4', name: 'Node 4', agrees: true }
        ];
        const result = consensus.mustLocal(votes);
        return result.success && result.certificate.agreesCount === 4 && result.certificate.requiredCount === 4;
    });
    // Test 2: Tetrahedron (mustLocal) - failed consensus
    runTest('Tetrahedron failed consensus', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true },
            { id: 'node2', name: 'Node 2', agrees: true },
            { id: 'node3', name: 'Node 3', agrees: true },
            { id: 'node4', name: 'Node 4', agrees: false }
        ];
        const result = consensus.mustLocal(votes);
        return !result.success && result.certificate.agreesCount === 3 && result.certificate.requiredCount === 4;
    });
    // Test 3: Octahedron (shouldLocal) - successful consensus
    runTest('Octahedron successful consensus', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true },
            { id: 'node2', name: 'Node 2', agrees: true },
            { id: 'node3', name: 'Node 3', agrees: true },
            { id: 'node4', name: 'Node 4', agrees: true },
            { id: 'node5', name: 'Node 5', agrees: true },
            { id: 'node6', name: 'Node 6', agrees: false }
        ];
        const result = consensus.shouldLocal(votes);
        return result.success && result.certificate.agreesCount === 5 && result.certificate.requiredCount === 5;
    });
    // Test 4: Octahedron (shouldLocal) - failed consensus
    runTest('Octahedron failed consensus', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true },
            { id: 'node2', name: 'Node 2', agrees: true },
            { id: 'node3', name: 'Node 3', agrees: true },
            { id: 'node4', name: 'Node 4', agrees: true },
            { id: 'node5', name: 'Node 5', agrees: false },
            { id: 'node6', name: 'Node 6', agrees: false }
        ];
        const result = consensus.shouldLocal(votes);
        return !result.success && result.certificate.agreesCount === 4 && result.certificate.requiredCount === 5;
    });
    // Test 5: Cube (mayLocal) - successful consensus
    runTest('Cube successful consensus', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true },
            { id: 'node2', name: 'Node 2', agrees: true },
            { id: 'node3', name: 'Node 3', agrees: true },
            { id: 'node4', name: 'Node 4', agrees: true },
            { id: 'node5', name: 'Node 5', agrees: false },
            { id: 'node6', name: 'Node 6', agrees: false },
            { id: 'node7', name: 'Node 7', agrees: false },
            { id: 'node8', name: 'Node 8', agrees: false }
        ];
        const result = consensus.mayLocal(votes);
        return result.success && result.certificate.agreesCount === 4 && result.certificate.requiredCount === 4;
    });
    // Test 6: Cube (mayLocal) - failed consensus
    runTest('Cube failed consensus', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true },
            { id: 'node2', name: 'Node 2', agrees: true },
            { id: 'node3', name: 'Node 3', agrees: true },
            { id: 'node4', name: 'Node 4', agrees: false },
            { id: 'node5', name: 'Node 5', agrees: false },
            { id: 'node6', name: 'Node 6', agrees: false },
            { id: 'node7', name: 'Node 7', agrees: false },
            { id: 'node8', name: 'Node 8', agrees: false }
        ];
        const result = consensus.mayLocal(votes);
        return !result.success && result.certificate.agreesCount === 3 && result.certificate.requiredCount === 4;
    });
    // Test 7: 5-Cell (mustFederation) - unanimous consensus
    runTest('5-Cell unanimous consensus', () => {
        const votes = [
            { id: 'fed1', name: 'Fed 1', agrees: true },
            { id: 'fed2', name: 'Fed 2', agrees: true },
            { id: 'fed3', name: 'Fed 3', agrees: true },
            { id: 'fed4', name: 'Fed 4', agrees: true },
            { id: 'fed5', name: 'Fed 5', agrees: true }
        ];
        const result = consensus.mustFederation(votes);
        return result.success && result.certificate.agreesCount === 5 && result.certificate.requiredCount === 5;
    });
    // Test 8: 24-Cell (shouldFederation) - successful consensus
    runTest('24-Cell successful consensus', () => {
        const votes = Array.from({ length: 24 }, (_, i) => ({
            id: `fed${i + 1}`,
            name: `Fed ${i + 1}`,
            agrees: i < 20 // First 20 agree
        }));
        const result = consensus.shouldFederation(votes);
        return result.success && result.certificate.agreesCount === 20 && result.certificate.requiredCount === 20;
    });
    // Test 9: Truncated Tetrahedron (mustGlobal) - unanimous consensus
    runTest('Truncated Tetrahedron unanimous consensus', () => {
        const votes = Array.from({ length: 12 }, (_, i) => ({
            id: `global${i + 1}`,
            name: `Global ${i + 1}`,
            agrees: true
        }));
        const result = consensus.mustGlobal(votes);
        return result.success && result.certificate.agreesCount === 12 && result.certificate.requiredCount === 12;
    });
    // Test 10: Custom geometric consensus
    runTest('Custom geometric consensus', () => {
        const votes = [
            { id: 'custom1', name: 'Custom 1', agrees: true },
            { id: 'custom2', name: 'Custom 2', agrees: true },
            { id: 'custom3', name: 'Custom 3', agrees: false }
        ];
        const result = consensus.verifyConsensus(votes, GeometricType.ICOSAHEDRON, 'Custom consensus test');
        return result.certificate.geometricType === GeometricType.ICOSAHEDRON && result.certificate.agreesCount === 2;
    });
    // Test 11: Empty votes array
    runTest('Empty votes array', () => {
        const votes = [];
        const result = consensus.mustLocal(votes);
        return !result.success && result.certificate.agreesCount === 0 && result.certificate.requiredCount === 0;
    });
    // Test 12: Single vote
    runTest('Single vote', () => {
        const votes = [{ id: 'single', name: 'Single', agrees: true }];
        const result = consensus.mustLocal(votes);
        return !result.success && result.certificate.agreesCount === 1 && result.certificate.requiredCount === 1;
    });
    // Test 13: All votes disagree
    runTest('All votes disagree', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: false },
            { id: 'node2', name: 'Node 2', agrees: false },
            { id: 'node3', name: 'Node 3', agrees: false },
            { id: 'node4', name: 'Node 4', agrees: false }
        ];
        const result = consensus.mustLocal(votes);
        return !result.success && result.certificate.agreesCount === 0 && result.certificate.requiredCount === 4;
    });
    // Test 14: Proof generation
    runTest('Proof generation', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true },
            { id: 'node2', name: 'Node 2', agrees: true },
            { id: 'node3', name: 'Node 3', agrees: true },
            { id: 'node4', name: 'Node 4', agrees: true }
        ];
        const result = consensus.mustLocal(votes);
        return result.certificate.proof.includes('Tetrahedron') &&
            result.certificate.proof.includes('4 out of 4') &&
            result.certificate.proof.includes('CONSENSUS ACHIEVED');
    });
    // Test 15: Timestamp generation
    runTest('Timestamp generation', () => {
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true },
            { id: 'node2', name: 'Node 2', agrees: true },
            { id: 'node3', name: 'Node 3', agrees: true },
            { id: 'node4', name: 'Node 4', agrees: true }
        ];
        const result = consensus.mustLocal(votes);
        const timestamp = new Date(result.certificate.timestamp);
        return !isNaN(timestamp.getTime()) && timestamp <= new Date();
    });
    console.log(`\nGeometric Consensus Tests: ${testsPassed}/${testsTotal} passed`);
    return testsPassed === testsTotal;
}
//# sourceMappingURL=geometric-consensus.test.js.map