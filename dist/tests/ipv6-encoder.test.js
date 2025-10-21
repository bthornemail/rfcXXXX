import { IPv6NeuralEncoder } from '../phase2-ipv6-neural/ipv6-encoder.js';
/**
 * Test suite for IPv6 neural architecture encoding and decoding.
 * Tests bit-level packing, parameter validation, and round-trip encoding.
 */
export function testIPv6Encoder() {
    console.log('Testing IPv6 Neural Encoder...');
    const encoder = new IPv6NeuralEncoder();
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
    // Test 1: Basic encoding and decoding
    runTest('Basic encoding and decoding', () => {
        const arch = {
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
        const ipv6 = encoder.architectureToIPv6(arch);
        const decoded = encoder.ipv6ToArchitecture(ipv6);
        return decoded.modelFamily === arch.modelFamily &&
            decoded.featureDim === arch.featureDim &&
            decoded.hiddenLayers === arch.hiddenLayers &&
            decoded.attentionHeads === arch.attentionHeads &&
            decoded.activation === arch.activation &&
            decoded.normalization === arch.normalization &&
            decoded.contextLength === arch.contextLength &&
            decoded.vocabSize === arch.vocabSize &&
            Math.abs(decoded.dropout - arch.dropout) < 0.001 &&
            Math.abs(decoded.learningRate - arch.learningRate) < 1e-6;
    });
    // Test 2: Maximum values encoding
    runTest('Maximum values encoding', () => {
        const arch = {
            modelFamily: 15, // 4 bits max
            featureDim: 4095, // 12 bits max
            hiddenLayers: 255, // 8 bits max
            attentionHeads: 255, // 8 bits max
            activation: 'linear',
            normalization: 'none',
            contextLength: 2047, // 11 bits max
            vocabSize: 65535, // 16 bits max
            dropout: 1.0,
            learningRate: 0.1
        };
        const ipv6 = encoder.architectureToIPv6(arch);
        const decoded = encoder.ipv6ToArchitecture(ipv6);
        return decoded.modelFamily === 15 &&
            decoded.featureDim === 4095 &&
            decoded.hiddenLayers === 255 &&
            decoded.attentionHeads === 255 &&
            decoded.activation === 'linear' &&
            decoded.normalization === 'none' &&
            decoded.contextLength === 2047 &&
            decoded.vocabSize === 65535;
    });
    // Test 3: Minimum values encoding
    runTest('Minimum values encoding', () => {
        const arch = {
            modelFamily: 0,
            featureDim: 0,
            hiddenLayers: 0,
            attentionHeads: 0,
            activation: 'relu',
            normalization: 'layer',
            contextLength: 0,
            vocabSize: 0,
            dropout: 0.0,
            learningRate: 0.000001
        };
        const ipv6 = encoder.architectureToIPv6(arch);
        const decoded = encoder.ipv6ToArchitecture(ipv6);
        return decoded.modelFamily === 0 &&
            decoded.featureDim === 0 &&
            decoded.hiddenLayers === 0 &&
            decoded.attentionHeads === 0 &&
            decoded.activation === 'relu' &&
            decoded.normalization === 'layer' &&
            decoded.contextLength === 0 &&
            decoded.vocabSize === 0 &&
            decoded.dropout === 0.0;
    });
    // Test 4: All activation functions
    runTest('All activation functions', () => {
        const activations = ['relu', 'gelu', 'silu', 'tanh', 'linear'];
        for (const activation of activations) {
            const arch = {
                modelFamily: 0,
                featureDim: 100,
                hiddenLayers: 1,
                attentionHeads: 1,
                activation,
                normalization: 'layer',
                contextLength: 100,
                vocabSize: 1000,
                dropout: 0.1,
                learningRate: 0.001
            };
            const ipv6 = encoder.architectureToIPv6(arch);
            const decoded = encoder.ipv6ToArchitecture(ipv6);
            if (decoded.activation !== activation) {
                return false;
            }
        }
        return true;
    });
    // Test 5: All normalization types
    runTest('All normalization types', () => {
        const normalizations = ['layer', 'rms', 'batch', 'none'];
        for (const normalization of normalizations) {
            const arch = {
                modelFamily: 0,
                featureDim: 100,
                hiddenLayers: 1,
                attentionHeads: 1,
                activation: 'relu',
                normalization,
                contextLength: 100,
                vocabSize: 1000,
                dropout: 0.1,
                learningRate: 0.001
            };
            const ipv6 = encoder.architectureToIPv6(arch);
            const decoded = encoder.ipv6ToArchitecture(ipv6);
            if (decoded.normalization !== normalization) {
                return false;
            }
        }
        return true;
    });
    // Test 6: Dropout precision
    runTest('Dropout precision', () => {
        const dropoutValues = [0.0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0];
        for (const dropout of dropoutValues) {
            const arch = {
                modelFamily: 0,
                featureDim: 100,
                hiddenLayers: 1,
                attentionHeads: 1,
                activation: 'relu',
                normalization: 'layer',
                contextLength: 100,
                vocabSize: 1000,
                dropout,
                learningRate: 0.001
            };
            const ipv6 = encoder.architectureToIPv6(arch);
            const decoded = encoder.ipv6ToArchitecture(ipv6);
            if (Math.abs(decoded.dropout - dropout) > 0.01) { // Allow some precision loss
                return false;
            }
        }
        return true;
    });
    // Test 7: Learning rate precision
    runTest('Learning rate precision', () => {
        const learningRates = [0.000001, 0.00001, 0.0001, 0.001, 0.01, 0.1];
        for (const lr of learningRates) {
            const arch = {
                modelFamily: 0,
                featureDim: 100,
                hiddenLayers: 1,
                attentionHeads: 1,
                activation: 'relu',
                normalization: 'layer',
                contextLength: 100,
                vocabSize: 1000,
                dropout: 0.1,
                learningRate: lr
            };
            const ipv6 = encoder.architectureToIPv6(arch);
            const decoded = encoder.ipv6ToArchitecture(ipv6);
            if (Math.abs(decoded.learningRate - lr) / lr > 0.1) { // Allow 10% relative error
                return false;
            }
        }
        return true;
    });
    // Test 8: IPv6 address format validation
    runTest('IPv6 address format validation', () => {
        const arch = {
            modelFamily: 1,
            featureDim: 512,
            hiddenLayers: 8,
            attentionHeads: 8,
            activation: 'relu',
            normalization: 'batch',
            contextLength: 512,
            vocabSize: 30000,
            dropout: 0.2,
            learningRate: 0.001
        };
        const ipv6 = encoder.architectureToIPv6(arch);
        // Check IPv6 format: 8 segments separated by colons
        const segments = ipv6.split(':');
        if (segments.length !== 8)
            return false;
        // Check each segment is valid hex
        for (const segment of segments) {
            if (segment.length > 4)
                return false;
            if (!/^[0-9a-fA-F]+$/.test(segment))
                return false;
        }
        return true;
    });
    // Test 9: Invalid input validation
    runTest('Invalid input validation', () => {
        const invalidArchs = [
            { ...{}, modelFamily: -1 },
            { ...{}, modelFamily: 16 },
            { ...{}, featureDim: -1 },
            { ...{}, featureDim: 4096 },
            { ...{}, hiddenLayers: -1 },
            { ...{}, hiddenLayers: 16 },
            { ...{}, attentionHeads: -1 },
            { ...{}, attentionHeads: 256 },
            { ...{}, contextLength: -1 },
            { ...{}, contextLength: 2048 },
            { ...{}, vocabSize: -1 },
            { ...{}, vocabSize: 65536 },
            { ...{}, dropout: -0.1 },
            { ...{}, dropout: 1.1 },
            { ...{}, learningRate: -0.001 }
        ];
        let errorCount = 0;
        for (const invalidArch of invalidArchs) {
            try {
                encoder.architectureToIPv6(invalidArch);
                return false; // Should have thrown an error
            }
            catch (error) {
                errorCount++;
            }
        }
        return errorCount === invalidArchs.length;
    });
    // Test 10: Invalid IPv6 address handling
    runTest('Invalid IPv6 address handling', () => {
        const invalidAddresses = [
            'invalid-address',
            '2001:db8::1:2:3:4:5:6:7:8', // Too many segments
            '2001:db8::1:2:3', // Too few segments
            '2001:db8::1:2:3:4:5:6:7', // 7 segments
            'gggg:hhhh:iiii:jjjj:kkkk:llll:mmmm:nnnn', // Invalid hex
            '2001:db8::1:2:3:4:5:6:7:8:9', // Way too many segments
            'not-an-ipv6-address'
        ];
        let errorCount = 0;
        for (const invalidAddr of invalidAddresses) {
            try {
                encoder.ipv6ToArchitecture(invalidAddr);
                return false; // Should have thrown an error
            }
            catch (error) {
                errorCount++;
            }
        }
        return errorCount === invalidAddresses.length;
    });
    // Test 11: Round-trip consistency with different architectures
    runTest('Round-trip consistency', () => {
        const testArchitectures = [
            // GPT-like
            {
                modelFamily: 0, featureDim: 768, hiddenLayers: 12, attentionHeads: 12,
                activation: 'gelu', normalization: 'layer',
                contextLength: 1024, vocabSize: 50257, dropout: 0.1, learningRate: 0.0001
            },
            // BERT-like
            {
                modelFamily: 0, featureDim: 1024, hiddenLayers: 12, attentionHeads: 12,
                activation: 'gelu', normalization: 'layer',
                contextLength: 512, vocabSize: 30000, dropout: 0.1, learningRate: 0.00005
            },
            // CNN-like
            {
                modelFamily: 2, featureDim: 512, hiddenLayers: 8, attentionHeads: 0,
                activation: 'relu', normalization: 'batch',
                contextLength: 224, vocabSize: 1000, dropout: 0.2, learningRate: 0.001
            }
        ];
        for (const arch of testArchitectures) {
            const ipv6 = encoder.architectureToIPv6(arch);
            const decoded = encoder.ipv6ToArchitecture(ipv6);
            if (decoded.modelFamily !== arch.modelFamily ||
                decoded.featureDim !== arch.featureDim ||
                decoded.hiddenLayers !== arch.hiddenLayers ||
                decoded.attentionHeads !== arch.attentionHeads ||
                decoded.activation !== arch.activation ||
                decoded.normalization !== arch.normalization ||
                decoded.contextLength !== arch.contextLength ||
                decoded.vocabSize !== arch.vocabSize ||
                Math.abs(decoded.dropout - arch.dropout) > 0.01 ||
                Math.abs(decoded.learningRate - arch.learningRate) / arch.learningRate > 0.1) {
                return false;
            }
        }
        return true;
    });
    // Test 12: Edge case values
    runTest('Edge case values', () => {
        const edgeCases = [
            { dropout: 0.001, learningRate: 0.0000001 }, // Very small values
            { dropout: 0.999, learningRate: 0.1 }, // Very large values
            { dropout: 0.5, learningRate: 0.0001 } // Middle values
        ];
        for (const edgeCase of edgeCases) {
            const arch = {
                modelFamily: 0,
                featureDim: 100,
                hiddenLayers: 1,
                attentionHeads: 1,
                activation: 'relu',
                normalization: 'layer',
                contextLength: 100,
                vocabSize: 1000,
                dropout: edgeCase.dropout,
                learningRate: edgeCase.learningRate
            };
            const ipv6 = encoder.architectureToIPv6(arch);
            const decoded = encoder.ipv6ToArchitecture(ipv6);
            if (Math.abs(decoded.dropout - edgeCase.dropout) > 0.01 ||
                Math.abs(decoded.learningRate - edgeCase.learningRate) / edgeCase.learningRate > 0.1) {
                return false;
            }
        }
        return true;
    });
    console.log(`\nIPv6 Encoder Tests: ${testsPassed}/${testsTotal} passed`);
    return testsPassed === testsTotal;
}
//# sourceMappingURL=ipv6-encoder.test.js.map