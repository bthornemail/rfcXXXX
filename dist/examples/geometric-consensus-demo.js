import { GeometricConsensus } from '../phase1-geometric-consensus/geometric-consensus.js';
import { GeometricType } from '../phase1-geometric-consensus/geometric-types.js';
/**
 * Demonstration of the Geometric Consensus system.
 * Shows how different geometric shapes enforce different consensus thresholds.
 */
export function runGeometricConsensusDemo() {
    console.log('=== Geometric Consensus Demo ===\n');
    const consensus = new GeometricConsensus();
    // Example 1: Local consensus scenarios
    console.log('1. Local Consensus Scenarios:');
    console.log('================================');
    // Tetrahedron (mustLocal) - requires unanimous agreement
    const tetrahedronVotes = [
        { id: 'node1', name: 'Node 1', agrees: true, justification: 'Supports the proposal' },
        { id: 'node2', name: 'Node 2', agrees: true, justification: 'Agrees with the decision' },
        { id: 'node3', name: 'Node 3', agrees: true, justification: 'Votes in favor' },
        { id: 'node4', name: 'Node 4', agrees: true, justification: 'Consensus reached' }
    ];
    const tetrahedronResult = consensus.mustLocal(tetrahedronVotes);
    console.log(`Tetrahedron (mustLocal): ${tetrahedronResult.success ? 'VALID' : 'INVALID'}`);
    console.log(`Proof: ${tetrahedronResult.certificate.proof}\n`);
    // Octahedron (shouldLocal) - requires 5/6 agreement
    const octahedronVotes = [
        { id: 'node1', name: 'Node 1', agrees: true, justification: 'Supports' },
        { id: 'node2', name: 'Node 2', agrees: true, justification: 'Agrees' },
        { id: 'node3', name: 'Node 3', agrees: true, justification: 'Votes yes' },
        { id: 'node4', name: 'Node 4', agrees: true, justification: 'In favor' },
        { id: 'node5', name: 'Node 5', agrees: true, justification: 'Consensus' },
        { id: 'node6', name: 'Node 6', agrees: false, justification: 'Disagrees' }
    ];
    const octahedronResult = consensus.shouldLocal(octahedronVotes);
    console.log(`Octahedron (shouldLocal): ${octahedronResult.success ? 'VALID' : 'INVALID'}`);
    console.log(`Proof: ${octahedronResult.certificate.proof}\n`);
    // Cube (mayLocal) - requires 4/8 agreement (50%)
    const cubeVotes = [
        { id: 'node1', name: 'Node 1', agrees: true, justification: 'Supports' },
        { id: 'node2', name: 'Node 2', agrees: true, justification: 'Agrees' },
        { id: 'node3', name: 'Node 3', agrees: true, justification: 'Votes yes' },
        { id: 'node4', name: 'Node 4', agrees: true, justification: 'In favor' },
        { id: 'node5', name: 'Node 5', agrees: false, justification: 'Disagrees' },
        { id: 'node6', name: 'Node 6', agrees: false, justification: 'Against' },
        { id: 'node7', name: 'Node 7', agrees: false, justification: 'Opposes' },
        { id: 'node8', name: 'Node 8', agrees: false, justification: 'Rejects' }
    ];
    const cubeResult = consensus.mayLocal(cubeVotes);
    console.log(`Cube (mayLocal): ${cubeResult.success ? 'VALID' : 'INVALID'}`);
    console.log(`Proof: ${cubeResult.certificate.proof}\n`);
    // Example 2: Federation consensus
    console.log('2. Federation Consensus Scenarios:');
    console.log('===================================');
    // 5-Cell (mustFederation) - requires unanimous agreement
    const fiveCellVotes = [
        { id: 'fed1', name: 'Fed Node 1', agrees: true, justification: 'Federation supports' },
        { id: 'fed2', name: 'Fed Node 2', agrees: true, justification: 'Federation agrees' },
        { id: 'fed3', name: 'Fed Node 3', agrees: true, justification: 'Federation votes yes' },
        { id: 'fed4', name: 'Fed Node 4', agrees: true, justification: 'Federation in favor' },
        { id: 'fed5', name: 'Fed Node 5', agrees: true, justification: 'Federation consensus' }
    ];
    const fiveCellResult = consensus.mustFederation(fiveCellVotes);
    console.log(`5-Cell (mustFederation): ${fiveCellResult.success ? 'VALID' : 'INVALID'}`);
    console.log(`Proof: ${fiveCellResult.certificate.proof}\n`);
    // 24-Cell (shouldFederation) - requires 20/24 agreement
    const twentyFourCellVotes = Array.from({ length: 24 }, (_, i) => ({
        id: `fed${i + 1}`,
        name: `Fed Node ${i + 1}`,
        agrees: i < 20, // First 20 agree, last 4 disagree
        justification: i < 20 ? 'Federation supports' : 'Federation opposes'
    }));
    const twentyFourCellResult = consensus.shouldFederation(twentyFourCellVotes);
    console.log(`24-Cell (shouldFederation): ${twentyFourCellResult.success ? 'VALID' : 'INVALID'}`);
    console.log(`Proof: ${twentyFourCellResult.certificate.proof}\n`);
    // Example 3: Global consensus
    console.log('3. Global Consensus Scenarios:');
    console.log('===============================');
    // Truncated Tetrahedron (mustGlobal) - requires unanimous agreement
    const truncatedTetrahedronVotes = Array.from({ length: 12 }, (_, i) => ({
        id: `global${i + 1}`,
        name: `Global Node ${i + 1}`,
        agrees: true, // All agree for unanimous consensus
        justification: 'Global consensus achieved'
    }));
    const truncatedTetrahedronResult = consensus.mustGlobal(truncatedTetrahedronVotes);
    console.log(`Truncated Tetrahedron (mustGlobal): ${truncatedTetrahedronResult.success ? 'VALID' : 'INVALID'}`);
    console.log(`Proof: ${truncatedTetrahedronResult.certificate.proof}\n`);
    // Example 4: Custom geometric consensus
    console.log('4. Custom Geometric Consensus:');
    console.log('===============================');
    const customVotes = [
        { id: 'custom1', name: 'Custom Node 1', agrees: true, justification: 'Custom consensus' },
        { id: 'custom2', name: 'Custom Node 2', agrees: true, justification: 'Custom agreement' },
        { id: 'custom3', name: 'Custom Node 3', agrees: false, justification: 'Custom disagreement' }
    ];
    const customResult = consensus.verifyConsensus(customVotes, GeometricType.ICOSAHEDRON, 'Custom consensus test');
    console.log(`Icosahedron (custom): ${customResult.success ? 'VALID' : 'INVALID'}`);
    console.log(`Proof: ${customResult.certificate.proof}\n`);
    console.log('=== Geometric Consensus Demo Complete ===');
}
// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runGeometricConsensusDemo();
}
//# sourceMappingURL=geometric-consensus-demo.js.map