import { PartitionDetector } from '../phase1-geometric-consensus/partition-detection.js';
import { BettiCalculator, Vertex, Edge } from '../phase1-geometric-consensus/betti-numbers.js';
import { DualPartitionRecovery } from '../phase1-geometric-consensus/dual-recovery.js';
import { GeometricConsensus, DecisionVertex } from '../phase1-geometric-consensus/geometric-consensus.js';
import { GeometricType } from '../phase1-geometric-consensus/geometric-types.js';

/**
 * Demonstration of network partition detection and recovery using geometric duality.
 * Shows how Betti numbers detect partitions and how dual-based recovery works.
 */
export function runPartitionHandlingDemo(): boolean {
  console.log('=== Network Partition Handling Demo ===\n');

  const partitionDetector = new PartitionDetector();
  const bettiCalculator = new BettiCalculator();
  const dualRecovery = new DualPartitionRecovery();
  const consensus = new GeometricConsensus();

  // Example 1: Betti number calculation for connected components
  console.log('1. Betti Number Calculation:');
  console.log('=============================');

  // Single connected component (no partition)
  const connectedVertices: Vertex[] = [
    { id: 'node1', name: 'Node 1', connected: new Set(['node2', 'node3']) },
    { id: 'node2', name: 'Node 2', connected: new Set(['node1', 'node3']) },
    { id: 'node3', name: 'Node 3', connected: new Set(['node1', 'node2']) }
  ];
  const connectedEdges: Edge[] = [
    { id: 'e1', from: 'node1', to: 'node2' },
    { id: 'e2', from: 'node2', to: 'node3' },
    { id: 'e3', from: 'node3', to: 'node1' }
  ];

  const connectedBetti = bettiCalculator.calculateBettiNumbers(connectedVertices, connectedEdges);
  console.log(`Connected graph - β₀ (components): ${connectedBetti.beta_0}`);
  console.log(`Partition detected: ${bettiCalculator.detectPartition(connectedBetti)}`);
  console.log(`Number of partitions: ${bettiCalculator.countPartitions(connectedBetti)}\n`);

  // Multiple connected components (partitioned)
  const partitionedVertices: Vertex[] = [
    { id: 'node1', name: 'Node 1', connected: new Set(['node2']) },
    { id: 'node2', name: 'Node 2', connected: new Set(['node1']) },
    { id: 'node3', name: 'Node 3', connected: new Set(['node4']) },
    { id: 'node4', name: 'Node 4', connected: new Set(['node3']) },
    { id: 'node5', name: 'Node 5', connected: new Set() } // Isolated node
  ];
  const partitionedEdges: Edge[] = [
    { id: 'e1', from: 'node1', to: 'node2' },
    { id: 'e2', from: 'node3', to: 'node4' }
  ];

  const partitionedBetti = bettiCalculator.calculateBettiNumbers(partitionedVertices, partitionedEdges);
  console.log(`Partitioned graph - β₀ (components): ${partitionedBetti.beta_0}`);
  console.log(`Partition detected: ${bettiCalculator.detectPartition(partitionedBetti)}`);
  console.log(`Number of partitions: ${bettiCalculator.countPartitions(partitionedBetti)}\n`);

  // Example 2: Partition detection with decision vertices
  console.log('2. Partition Detection with Decision Vertices:');
  console.log('===============================================');

  // Simulate a network partition scenario
  const decisionVertices: DecisionVertex[] = [
    { id: 'node1', name: 'Node 1', agrees: true, justification: 'Partition A - supports' },
    { id: 'node2', name: 'Node 2', agrees: true, justification: 'Partition A - agrees' },
    { id: 'node3', name: 'Node 3', agrees: false, justification: 'Partition B - opposes' },
    { id: 'node4', name: 'Node 4', agrees: false, justification: 'Partition B - disagrees' }
  ];

  // For partition detection, we need actual vertices and edges
  const verticesForPartition: Vertex[] = decisionVertices.map(v => ({ id: v.id, name: v.name, connected: new Set() }));
  verticesForPartition[0].connected.add(verticesForPartition[1].id);
  verticesForPartition[1].connected.add(verticesForPartition[0].id);
  // Simulate a partition by not connecting partition A to partition B
  verticesForPartition[2].connected.add(verticesForPartition[3].id);
  verticesForPartition[3].connected.add(verticesForPartition[2].id);

  // Note: edgesForPartition is not used as detectViaBettiNumbers only needs DecisionVertex[]

  const partitionInfo = partitionDetector.detectViaBettiNumbers(decisionVertices);
  console.log(`Partition detected: ${partitionInfo.isPartitioned}`);
  console.log(`Number of partitions: ${partitionInfo.partitionCount}`);
  console.log(`Betti numbers: β₀=${partitionInfo.bettiNumbers.beta_0}, β₁=${partitionInfo.bettiNumbers.beta_1}, β₂=${partitionInfo.bettiNumbers.beta_2}\n`);

  // Example 3: Geometric type decomposition
  console.log('3. Geometric Type Decomposition:');
  console.log('=================================');

  const originalType = GeometricType.TWENTY_FOUR_CELL;
  const partitionCount = 2;
  const decomposedType = partitionDetector.decomposeGeometricType(originalType, partitionCount);

  console.log(`Original type: ${GeometricType[originalType]}`);
  console.log(`Partition count: ${partitionCount}`);
  console.log(`Decomposed type: ${GeometricType[decomposedType]}\n`);

  // Example 4: Dual-based partition recovery
  console.log('4. Dual-Based Partition Recovery:');
  console.log('==================================');

  // Simulate consensus results from different partitions
  const partitionAVotes: DecisionVertex[] = [
    { id: 'node1', name: 'Node 1', agrees: true, justification: 'Partition A consensus' },
    { id: 'node2', name: 'Node 2', agrees: true, justification: 'Partition A agreement' }
  ];
  const partitionBVotes: DecisionVertex[] = [
    { id: 'node3', name: 'Node 3', agrees: true, justification: 'Partition B consensus' },
    { id: 'node4', name: 'Node 4', agrees: true, justification: 'Partition B agreement' }
  ];

  const partitionAConsensus = consensus.mustLocal(partitionAVotes);
  const partitionBConsensus = consensus.mustLocal(partitionBVotes);

  const partitionCertificates = [partitionAConsensus.certificate, partitionBConsensus.certificate];
  const originalConsensusType = GeometricType.CUBE; // Original was cube consensus

  const recoveredResult = dualRecovery.recoverFromPartition(partitionCertificates, originalConsensusType);

  console.log(`Recovered consensus type: ${GeometricType[recoveredResult.recoveredCertificate.geometricType]}`);
  console.log(`Recovered consensus valid: ${recoveredResult.success}`);
  console.log(`Recovered proof: ${recoveredResult.recoveredCertificate.proof}\n`);

  // Example 5: Threshold mapping via duality
  console.log('5. Threshold Mapping via Duality:');
  console.log('==================================');

  const partitionThreshold = 1.0; // 100% agreement in partition
  const originalType2 = GeometricType.CUBE;
  const dualType = GeometricType.OCTAHEDRON;

  const mappedThreshold = dualRecovery.mapThresholdViaDual(partitionThreshold, originalType2, dualType);
  console.log(`Partition threshold: ${partitionThreshold}`);
  console.log(`Original type: ${GeometricType[originalType2]}`);
  console.log(`Dual type: ${GeometricType[dualType]}`);
  console.log(`Mapped threshold: ${mappedThreshold}\n`);

  // Example 6: Complete partition recovery workflow
  console.log('6. Complete Partition Recovery Workflow:');
  console.log('=========================================');

  // Step 1: Detect partition
  const workflowDecisionVertices: DecisionVertex[] = [
    { id: 'workflow1', name: 'Workflow Node 1', agrees: true, justification: 'Workflow partition A' },
    { id: 'workflow2', name: 'Workflow Node 2', agrees: true, justification: 'Workflow partition A' },
    { id: 'workflow3', name: 'Workflow Node 3', agrees: true, justification: 'Workflow partition B' },
    { id: 'workflow4', name: 'Workflow Node 4', agrees: true, justification: 'Workflow partition B' }
  ];

  // For workflow partition detection, we need actual vertices and edges
  const workflowVertices: Vertex[] = workflowDecisionVertices.map(v => ({ id: v.id, name: v.name, connected: new Set() }));
  workflowVertices[0].connected.add(workflowVertices[1].id);
  workflowVertices[1].connected.add(workflowVertices[0].id);
  workflowVertices[2].connected.add(workflowVertices[3].id);
  workflowVertices[3].connected.add(workflowVertices[2].id);

  // Note: workflowEdges is not used as detectViaBettiNumbers only needs DecisionVertex[]

  const workflowPartitionInfo = partitionDetector.detectViaBettiNumbers(workflowDecisionVertices);
  console.log(`Step 1 - Partition detected: ${workflowPartitionInfo.isPartitioned}`);

  // Step 2: Achieve local consensus in each partition
  const partitionAWorkflow = workflowDecisionVertices.slice(0, 2);
  const partitionBWorkflow = workflowDecisionVertices.slice(2, 4);

  const partitionAConsensusWorkflow = consensus.mustLocal(partitionAWorkflow);
  const partitionBConsensusWorkflow = consensus.mustLocal(partitionBWorkflow);

  console.log(`Step 2 - Partition A consensus: ${partitionAConsensusWorkflow.success}`);
  console.log(`Step 2 - Partition B consensus: ${partitionBConsensusWorkflow.success}`);

  // Step 3: Recover unified consensus
  const workflowRecovery = dualRecovery.recoverFromPartition(
    [partitionAConsensusWorkflow.certificate, partitionBConsensusWorkflow.certificate],
    GeometricType.CUBE
  );

  console.log(`Step 3 - Unified recovery: ${workflowRecovery.success}`);
  console.log(`Step 3 - Recovery proof: ${workflowRecovery.recoveredCertificate.proof}\n`);

  console.log('=== Network Partition Handling Demo Complete ===');
  return true; // Demo completed successfully
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPartitionHandlingDemo();
}
