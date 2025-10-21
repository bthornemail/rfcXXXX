/**
 * Main entry point for all demonstration examples.
 * This file exports all demo functions and provides a unified interface.
 */

import { runGeometricConsensusDemo } from './geometric-consensus-demo.js';
import { runPartitionHandlingDemo } from './partition-handling-demo.js';
import { runIPv6NeuralDemo } from './ipv6-neural-demo.js';
import { runIntegratedDemo } from './integrated-demo.js';

export { runGeometricConsensusDemo, runPartitionHandlingDemo, runIPv6NeuralDemo, runIntegratedDemo };

/**
 * Runs all demonstrations in sequence.
 * This is useful for comprehensive testing and showcasing all features.
 */
export function runAllDemos(): void {
  console.log('🚀 Starting RFC XXXX Complete Demonstration Suite\n');

  try {
    console.log('Running Geometric Consensus Demo...');
    runGeometricConsensusDemo();
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('Running Partition Handling Demo...');
    runPartitionHandlingDemo();
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('Running IPv6 Neural Demo...');
    runIPv6NeuralDemo();
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('Running Integrated Demo...');
    runIntegratedDemo();
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('✅ All demonstrations completed successfully!');
  } catch (error) {
    console.error('❌ Error during demonstration:', error);
  }
}

/**
 * Runs a specific demonstration by name.
 * @param demoName The name of the demo to run
 */
export function runDemo(demoName: string): void {
  switch (demoName.toLowerCase()) {
    case 'consensus':
    case 'geometric-consensus':
      runGeometricConsensusDemo();
      break;
    case 'partition':
    case 'partition-handling':
      runPartitionHandlingDemo();
      break;
    case 'ipv6':
    case 'ipv6-neural':
      runIPv6NeuralDemo();
      break;
    case 'integrated':
      runIntegratedDemo();
      break;
    case 'all':
      runAllDemos();
      break;
    default:
      console.error(`Unknown demo: ${demoName}`);
      console.log('Available demos: consensus, partition, ipv6, integrated, all');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const demoName = process.argv[2] || 'all';
  runDemo(demoName);
}
