import { GeometricConsensus } from '../phase1-geometric-consensus/geometric-consensus.js';
import { PartitionDetector } from '../phase1-geometric-consensus/partition-detection.js';
import { DualPartitionRecovery } from '../phase1-geometric-consensus/dual-recovery.js';
import { IPv6NeuralEncoder } from '../phase2-ipv6-neural/ipv6-encoder.js';
import { BrowserModelRuntime } from '../phase2-ipv6-neural/browser-model-runtime.js';
import { GeometricType } from '../phase1-geometric-consensus/geometric-types.js';
/**
 * Integration test suite that tests how all components work together.
 * Tests complete workflows and cross-component interactions.
 */
export async function testIntegration() {
    console.log('Testing Integration...');
    const consensus = new GeometricConsensus();
    const partitionDetector = new PartitionDetector();
    const dualRecovery = new DualPartitionRecovery();
    const encoder = new IPv6NeuralEncoder();
    let testsPassed = 0;
    let testsTotal = 0;
    // Helper function to run a test
    function runTest(testName, testFn) {
        testsTotal++;
        try {
            const result = testFn();
            if (result instanceof Promise) {
                result.then((asyncResult) => {
                    if (asyncResult) {
                        console.log(`✅ ${testName}`);
                        testsPassed++;
                    }
                    else {
                        console.log(`❌ ${testName}`);
                    }
                }).catch((error) => {
                    console.log(`❌ ${testName} - Error: ${error.message}`);
                });
            }
            else {
                if (result) {
                    console.log(`✅ ${testName}`);
                    testsPassed++;
                }
                else {
                    console.log(`❌ ${testName}`);
                }
            }
        }
        catch (error) {
            console.log(`❌ ${testName} - Error: ${error.message}`);
        }
    }
    // Test 1: Complete neural architecture consensus workflow
    runTest('Complete neural architecture consensus workflow', () => {
        // Step 1: Define architecture
        const architecture = {
            modelFamily: 0,
            featureDim: 768,
            hiddenLayers: 12,
            attentionHeads: 12,
            activation: 'gelu',
            normalization: 'layer',
            contextLength: 1024,
            vocabSize: 50257,
            dropout: 0.1,
            learningRate: 0.0001
        };
        // Step 2: Encode to IPv6
        encoder.architectureToIPv6(architecture);
        // Step 3: Achieve consensus on architecture
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: true, justification: 'Supports architecture' },
            { id: 'node2', name: 'Node 2', agrees: true, justification: 'Agrees with proposal' },
            { id: 'node3', name: 'Node 3', agrees: true, justification: 'Votes in favor' },
            { id: 'node4', name: 'Node 4', agrees: true, justification: 'Consensus achieved' }
        ];
        const consensusResult = consensus.mustLocal(votes);
        const ipv6 = encoder.architectureToIPv6(architecture);
        // Step 4: Verify all steps succeeded
        return consensusResult.success &&
            ipv6.length > 0 &&
            ipv6.includes(':') &&
            consensusResult.certificate.agreesCount === 4;
    });
    // Test 2: Partition detection and recovery workflow
    runTest('Partition detection and recovery workflow', () => {
        // Step 1: Simulate partitioned network
        const partitionedVotes = [
            { id: 'partition1_node1', name: 'Partition A Node 1', agrees: true, justification: 'Partition A supports' },
            { id: 'partition1_node2', name: 'Partition A Node 2', agrees: true, justification: 'Partition A agrees' },
            { id: 'partition2_node1', name: 'Partition B Node 1', agrees: true, justification: 'Partition B supports' },
            { id: 'partition2_node2', name: 'Partition B Node 2', agrees: true, justification: 'Partition B agrees' }
        ];
        // Step 2: Detect partition
        const partitionInfo = partitionDetector.detectViaBettiNumbers(partitionedVotes);
        // Step 3: Achieve local consensus in each partition
        const partitionA = partitionedVotes.slice(0, 2);
        const partitionB = partitionedVotes.slice(2, 4);
        const partitionAConsensus = consensus.mustLocal(partitionA);
        const partitionBConsensus = consensus.mustLocal(partitionB);
        // Step 4: Recover unified consensus
        const recoveredConsensus = dualRecovery.recoverFromPartition([partitionAConsensus.certificate, partitionBConsensus.certificate], GeometricType.CUBE);
        // Step 5: Verify recovery succeeded
        return partitionInfo.isPartitioned &&
            partitionAConsensus.success &&
            partitionBConsensus.success &&
            recoveredConsensus.success &&
            recoveredConsensus.recoveredCertificate.agreesCount === 4;
    });
    // Test 3: Model distribution and execution workflow
    runTest('Model distribution and execution workflow', async () => {
        // Step 1: Define and encode architecture
        const architecture = {
            modelFamily: 0,
            featureDim: 512,
            hiddenLayers: 8,
            attentionHeads: 8,
            activation: 'relu',
            normalization: 'layer',
            contextLength: 512,
            vocabSize: 30000,
            dropout: 0.1,
            learningRate: 0.001
        };
        encoder.architectureToIPv6(architecture);
        // Step 2: Create model instance
        const modelWeights = new BrowserModelRuntime(architecture);
        // Step 3: Load real weights
        const realWeights = modelWeights.generateRandomWeights('xavier');
        return modelWeights.loadWeights(realWeights)
            .then(() => {
            // Step 4: Perform inference
            const inputTensor = [1.0, 2.0];
            return modelWeights.forwardPass(inputTensor);
        })
            .then((output) => {
            // Step 5: Verify inference succeeded
            return output.output.length === 2 &&
                typeof output.output[0] === 'number' &&
                typeof output.output[1] === 'number' &&
                !isNaN(output.output[0]) &&
                !isNaN(output.output[1]);
        })
            .catch(() => false);
    });
    // Test 4: Cross-component data consistency
    runTest('Cross-component data consistency', () => {
        // Test that data flows correctly between components
        const architecture = {
            modelFamily: 1,
            featureDim: 1024,
            hiddenLayers: 12,
            attentionHeads: 12,
            activation: 'gelu',
            normalization: 'layer',
            contextLength: 1024,
            vocabSize: 50000,
            dropout: 0.15,
            learningRate: 0.00005
        };
        // Encode and decode
        const ipv6 = encoder.architectureToIPv6(architecture);
        const decoded = encoder.ipv6ToArchitecture(ipv6);
        // Create consensus votes based on architecture properties
        const votes = [
            { id: 'node1', name: 'Node 1', agrees: decoded.featureDim === 1024, justification: 'Feature dim check' },
            { id: 'node2', name: 'Node 2', agrees: decoded.hiddenLayers === 12, justification: 'Hidden layers check' },
            { id: 'node3', name: 'Node 3', agrees: decoded.activation === 'gelu', justification: 'Activation check' },
            { id: 'node4', name: 'Node 4', agrees: decoded.dropout > 0.1, justification: 'Dropout check' }
        ];
        const consensusResult = consensus.mustLocal(votes);
        // Verify consistency across components
        return consensusResult.success &&
            decoded.modelFamily === architecture.modelFamily &&
            decoded.featureDim === architecture.featureDim &&
            decoded.hiddenLayers === architecture.hiddenLayers &&
            decoded.activation === architecture.activation;
    });
    // Test 5: Error handling across components
    runTest('Error handling across components', () => {
        let errorHandled = false;
        try {
            // Try to create consensus with invalid votes
            const invalidVotes = [
                { id: 'node1', name: 'Node 1', agrees: true },
                { id: 'node1', name: 'Node 1', agrees: false } // Duplicate ID
            ];
            consensus.mustLocal(invalidVotes);
            // Try to encode invalid architecture
            const invalidArch = {
                modelFamily: -1, // Invalid
                featureDim: 100,
                hiddenLayers: 1,
                attentionHeads: 1,
                activation: 'relu',
                normalization: 'layer',
                contextLength: 100,
                vocabSize: 1000,
                dropout: 0.1,
                learningRate: 0.001
            };
            encoder.architectureToIPv6(invalidArch);
            return false; // Should have thrown errors
        }
        catch (error) {
            errorHandled = true;
        }
        return errorHandled;
    });
    // Test 6: Performance with large datasets
    runTest('Performance with large datasets', async () => {
        const startTime = Date.now();
        // Create large consensus scenario
        const largeVotes = Array.from({ length: 100 }, (_, i) => ({
            id: `node${i + 1}`,
            name: `Node ${i + 1}`,
            agrees: i < 80, // 80% agreement
            justification: `Node ${i + 1} vote`
        }));
        const consensusResult = consensus.shouldFederation(largeVotes);
        // Create multiple architectures
        const architectures = Array.from({ length: 50 }, (_, i) => ({
            modelFamily: i % 3,
            featureDim: 100 + i * 10,
            hiddenLayers: 1 + (i % 10),
            attentionHeads: 1 + (i % 8),
            activation: ['relu', 'gelu', 'silu'][i % 3],
            normalization: ['layer', 'batch', 'rms'][i % 3],
            contextLength: 100 + i * 50,
            vocabSize: 1000 + i * 100,
            dropout: 0.1 + (i % 10) * 0.01,
            learningRate: 0.001 / (1 + i)
        }));
        // Encode all architectures
        const ipv6Addresses = architectures.map(arch => encoder.architectureToIPv6(arch));
        const endTime = Date.now();
        const duration = endTime - startTime;
        // Verify performance is reasonable (less than 1 second for this test)
        return duration < 1000 &&
            consensusResult.certificate.agreesCount === 80 &&
            ipv6Addresses.length === 50 &&
            ipv6Addresses.every(addr => addr.includes(':'));
    });
    // Test 7: Memory management
    runTest('Memory management', async () => {
        // Create multiple model instances
        const models = [];
        for (let i = 0; i < 10; i++) {
            const architecture = {
                modelFamily: 0,
                featureDim: 100 + i,
                hiddenLayers: 1,
                attentionHeads: 1,
                activation: 'relu',
                normalization: 'layer',
                contextLength: 100,
                vocabSize: 1000,
                dropout: 0.1,
                learningRate: 0.001
            };
            const model = new BrowserModelRuntime(architecture);
            models.push(model);
        }
        // Load real weights for all models
        const loadPromises = models.map(model => {
            const realWeights = model.generateRandomWeights('he'); // Use He for ReLU
            return model.loadWeights(realWeights);
        });
        return Promise.all(loadPromises)
            .then(() => {
            // Perform inference on all models
            const inferencePromises = models.map(model => model.forwardPass([1.0, 2.0]));
            return Promise.all(inferencePromises);
        })
            .then((outputs) => {
            // Verify all models produced valid outputs
            return outputs.length === 10 &&
                outputs.every(output => output.output.length === 2);
        })
            .catch(() => false);
    });
    // Test 8: Concurrent operations
    runTest('Concurrent operations', async () => {
        // Simulate concurrent consensus operations
        const consensusPromises = Array.from({ length: 5 }, (_, i) => {
            const votes = [
                { id: `concurrent${i}_1`, name: `Concurrent ${i} 1`, agrees: true },
                { id: `concurrent${i}_2`, name: `Concurrent ${i} 2`, agrees: true },
                { id: `concurrent${i}_3`, name: `Concurrent ${i} 3`, agrees: true },
                { id: `concurrent${i}_4`, name: `Concurrent ${i} 4`, agrees: true }
            ];
            return Promise.resolve(consensus.mustLocal(votes));
        });
        // Simulate concurrent encoding operations
        const encodingPromises = Array.from({ length: 5 }, (_, i) => {
            const architecture = {
                modelFamily: i % 2,
                featureDim: 100 + i * 10,
                hiddenLayers: 1,
                attentionHeads: 1,
                activation: 'relu',
                normalization: 'layer',
                contextLength: 100,
                vocabSize: 1000,
                dropout: 0.1,
                learningRate: 0.001
            };
            return Promise.resolve(encoder.architectureToIPv6(architecture));
        });
        return Promise.all([...consensusPromises, ...encodingPromises])
            .then((results) => {
            const consensusResults = results.slice(0, 5);
            const encodingResults = results.slice(5, 10);
            return consensusResults.every((result) => result.success) &&
                encodingResults.every((result) => typeof result === 'string' ? result.includes(':') : true);
        })
            .catch(() => false);
    });
    console.log(`\nIntegration Tests: ${testsPassed}/${testsTotal} passed`);
    return testsPassed === testsTotal;
}
//# sourceMappingURL=integration.test.js.map