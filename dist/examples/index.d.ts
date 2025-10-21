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
export declare function runAllDemos(): void;
/**
 * Runs a specific demonstration by name.
 * @param demoName The name of the demo to run
 */
export declare function runDemo(demoName: string): void;
