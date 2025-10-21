import { IPv6NeuralEncoder, NeuralArchitecture } from '../phase2-ipv6-neural/ipv6-encoder.js';
import { BrowserModelRuntime } from '../phase2-ipv6-neural/browser-model-runtime.js';

/**
 * Demonstration of IPv6 neural architecture encoding and browser model runtime.
 * Shows how neural network architectures are encoded as IPv6 addresses and executed in browsers.
 */
export function runIPv6NeuralDemo(): void {
  console.log('=== IPv6 Neural Architecture Demo ===\n');

  const encoder = new IPv6NeuralEncoder();

  // Example 1: Encode various neural architectures to IPv6
  console.log('1. Neural Architecture to IPv6 Encoding:');
  console.log('=========================================');

  // GPT-like transformer architecture
  const gptArchitecture: NeuralArchitecture = {
    modelFamily: 0, // Transformer
    featureDim: 768, // 768-dimensional embeddings
    hiddenLayers: 12, // 12 transformer layers
    attentionHeads: 12, // 12 attention heads
    activation: 'gelu',
    normalization: 'layer',
    contextLength: 1024, // 1024 token context
    vocabSize: 50257, // GPT-2 vocabulary size
    dropout: 0.1, // 10% dropout
    learningRate: 0.0001 // 1e-4 learning rate
  };

  const gptIPv6 = encoder.architectureToIPv6(gptArchitecture);
  console.log('GPT-like Architecture:');
  console.log(`  Model Family: ${gptArchitecture.modelFamily} (Transformer)`);
  console.log(`  Feature Dim: ${gptArchitecture.featureDim}`);
  console.log(`  Hidden Layers: ${gptArchitecture.hiddenLayers}`);
  console.log(`  Attention Heads: ${gptArchitecture.attentionHeads}`);
  console.log(`  Activation: ${gptArchitecture.activation}`);
  console.log(`  Normalization: ${gptArchitecture.normalization}`);
  console.log(`  Context Length: ${gptArchitecture.contextLength}`);
  console.log(`  Vocab Size: ${gptArchitecture.vocabSize}`);
  console.log(`  Dropout: ${gptArchitecture.dropout}`);
  console.log(`  Learning Rate: ${gptArchitecture.learningRate}`);
  console.log(`  IPv6 Address: ${gptIPv6}\n`);

  // BERT-like architecture
  const bertArchitecture: NeuralArchitecture = {
    modelFamily: 0, // Transformer
    featureDim: 1024, // 1024-dimensional embeddings
    hiddenLayers: 12, // 12 transformer layers (fits in 4 bits: 0-15)
    attentionHeads: 12, // 12 attention heads (fits in 4 bits: 0-15)
    activation: 'gelu',
    normalization: 'layer',
    contextLength: 512, // 512 token context
    vocabSize: 30000, // BERT vocabulary size
    dropout: 0.1, // 10% dropout
    learningRate: 0.00005 // 5e-5 learning rate
  };

  const bertIPv6 = encoder.architectureToIPv6(bertArchitecture);
  console.log('BERT-like Architecture:');
  console.log(`  Model Family: ${bertArchitecture.modelFamily} (Transformer)`);
  console.log(`  Feature Dim: ${bertArchitecture.featureDim}`);
  console.log(`  Hidden Layers: ${bertArchitecture.hiddenLayers}`);
  console.log(`  Attention Heads: ${bertArchitecture.attentionHeads}`);
  console.log(`  Activation: ${bertArchitecture.activation}`);
  console.log(`  Normalization: ${bertArchitecture.normalization}`);
  console.log(`  Context Length: ${bertArchitecture.contextLength}`);
  console.log(`  Vocab Size: ${bertArchitecture.vocabSize}`);
  console.log(`  Dropout: ${bertArchitecture.dropout}`);
  console.log(`  Learning Rate: ${bertArchitecture.learningRate}`);
  console.log(`  IPv6 Address: ${bertIPv6}\n`);

  // CNN architecture
  const cnnArchitecture: NeuralArchitecture = {
    modelFamily: 2, // CNN
    featureDim: 512, // 512 feature maps
    hiddenLayers: 8, // 8 convolutional layers
    attentionHeads: 0, // No attention heads for CNN
    activation: 'relu',
    normalization: 'batch',
    contextLength: 224, // 224x224 image size
    vocabSize: 1000, // 1000 classes
    dropout: 0.2, // 20% dropout
    learningRate: 0.001 // 1e-3 learning rate
  };

  const cnnIPv6 = encoder.architectureToIPv6(cnnArchitecture);
  console.log('CNN Architecture:');
  console.log(`  Model Family: ${cnnArchitecture.modelFamily} (CNN)`);
  console.log(`  Feature Dim: ${cnnArchitecture.featureDim}`);
  console.log(`  Hidden Layers: ${cnnArchitecture.hiddenLayers}`);
  console.log(`  Attention Heads: ${cnnArchitecture.attentionHeads}`);
  console.log(`  Activation: ${cnnArchitecture.activation}`);
  console.log(`  Normalization: ${cnnArchitecture.normalization}`);
  console.log(`  Context Length: ${cnnArchitecture.contextLength}`);
  console.log(`  Vocab Size: ${cnnArchitecture.vocabSize}`);
  console.log(`  Dropout: ${cnnArchitecture.dropout}`);
  console.log(`  Learning Rate: ${cnnArchitecture.learningRate}`);
  console.log(`  IPv6 Address: ${cnnIPv6}\n`);

  // Example 2: Decode IPv6 addresses back to architectures
  console.log('2. IPv6 to Neural Architecture Decoding:');
  console.log('=========================================');

  try {
    const decodedGPT = encoder.ipv6ToArchitecture(gptIPv6);
    console.log('Decoded GPT Architecture:');
    console.log(`  Model Family: ${decodedGPT.modelFamily}`);
    console.log(`  Feature Dim: ${decodedGPT.featureDim}`);
    console.log(`  Hidden Layers: ${decodedGPT.hiddenLayers}`);
    console.log(`  Attention Heads: ${decodedGPT.attentionHeads}`);
    console.log(`  Activation: ${decodedGPT.activation}`);
    console.log(`  Normalization: ${decodedGPT.normalization}`);
    console.log(`  Context Length: ${decodedGPT.contextLength}`);
    console.log(`  Vocab Size: ${decodedGPT.vocabSize}`);
    console.log(`  Dropout: ${decodedGPT.dropout}`);
    console.log(`  Learning Rate: ${decodedGPT.learningRate}`);
    console.log(`  IPv6 Address: ${decodedGPT.ipv6Address}\n`);

    // Verify round-trip encoding/decoding
    const roundTripValid =
      decodedGPT.modelFamily === gptArchitecture.modelFamily &&
      decodedGPT.featureDim === gptArchitecture.featureDim &&
      decodedGPT.hiddenLayers === gptArchitecture.hiddenLayers &&
      decodedGPT.attentionHeads === gptArchitecture.attentionHeads &&
      decodedGPT.activation === gptArchitecture.activation &&
      decodedGPT.normalization === gptArchitecture.normalization &&
      decodedGPT.contextLength === gptArchitecture.contextLength &&
      decodedGPT.vocabSize === gptArchitecture.vocabSize &&
      Math.abs(decodedGPT.dropout - gptArchitecture.dropout) < 0.001 &&
      Math.abs(decodedGPT.learningRate - gptArchitecture.learningRate) < 1e-6;

    console.log(`Round-trip encoding/decoding valid: ${roundTripValid}\n`);
  } catch (error) {
    console.error(`Error decoding IPv6 address: ${error}\n`);
  }

  // Example 3: Browser model runtime simulation
  console.log('3. Browser Model Runtime Simulation:');
  console.log('=====================================');

  const gptArchitecture2 = encoder.ipv6ToArchitecture(gptIPv6);
  const modelWeights = new BrowserModelRuntime(gptArchitecture2);

  // Generate real weights using configurable initialization strategy
  const realWeights = modelWeights.generateRandomWeights('xavier');

  modelWeights.loadWeights(realWeights)
    .then(() => {
      console.log('Model weights loaded from localStorage successfully');

              // Perform a forward pass
              const inputTensor = [1, 2]; // Use integer tokens, not floats
              return modelWeights.forwardPass(inputTensor);
    })
    .then((output: any) => {
      console.log(`Forward pass output: [${output.output.join(', ')}]`);
      console.log(`Model weights:`, modelWeights.getWeights());
    })
    .catch((error: Error) => {
      console.error(`Error in browser model runtime: ${error}`);
    });

  // Load weights from real generation (simulating HTTP loading)
  const httpModelWeights = new BrowserModelRuntime(bertArchitecture);
  const httpWeights = httpModelWeights.generateRandomWeights('he'); // Use He initialization for BERT

  httpModelWeights.loadWeights(httpWeights)
    .then(() => {
      console.log('Model weights loaded from localStorage successfully');

      // Perform a forward pass
      const inputTensor = [3, 4]; // Use integer tokens, not floats
      return httpModelWeights.forwardPass(inputTensor);
    })
    .then((output: any) => {
      console.log(`HTTP forward pass output: [${output.output.join(', ')}]`);
    })
    .catch((error: Error) => {
      console.error(`Error in HTTP model runtime: ${error}`);
    });

  // Example 4: IPv6 address validation and edge cases
  console.log('4. IPv6 Address Validation and Edge Cases:');
  console.log('===========================================');

  // Test edge case architectures
  const edgeCaseArchitecture: NeuralArchitecture = {
    modelFamily: 15, // Maximum value
    featureDim: 4095, // Maximum 12-bit value
    hiddenLayers: 255, // Maximum 8-bit value
    attentionHeads: 255, // Maximum 8-bit value
    activation: 'linear',
    normalization: 'none',
    contextLength: 2047, // Maximum 11-bit value
    vocabSize: 65535, // Maximum 16-bit value
    dropout: 1.0, // Maximum dropout
    learningRate: 0.1 // High learning rate
  };

  try {
    const edgeCaseIPv6 = encoder.architectureToIPv6(edgeCaseArchitecture);
    console.log(`Edge case architecture IPv6: ${edgeCaseIPv6}`);

    const decodedEdgeCase = encoder.ipv6ToArchitecture(edgeCaseIPv6);
    console.log(`Decoded edge case - Model Family: ${decodedEdgeCase.modelFamily}`);
    console.log(`Decoded edge case - Feature Dim: ${decodedEdgeCase.featureDim}`);
    console.log(`Decoded edge case - Dropout: ${decodedEdgeCase.dropout}\n`);
  } catch (error) {
    console.error(`Error with edge case architecture: ${error}\n`);
  }

  // Example 5: Invalid IPv6 address handling
  console.log('5. Invalid IPv6 Address Handling:');
  console.log('==================================');

  const invalidIPv6Addresses = [
    'invalid-address',
    '2001:db8::1:2:3:4:5:6:7:8', // Too many segments
    '2001:db8::1:2:3', // Too few segments
    '2001:db8::1:2:3:4:5:6:7', // 7 segments instead of 8
    'gggg:hhhh:iiii:jjjj:kkkk:llll:mmmm:nnnn' // Invalid hex
  ];

  invalidIPv6Addresses.forEach((invalidAddr, index) => {
    try {
      const decoded = encoder.ipv6ToArchitecture(invalidAddr);
      console.log(`Invalid address ${index + 1} unexpectedly decoded: ${decoded}`);
    } catch (error) {
      console.log(`Invalid address ${index + 1} correctly rejected: ${(error as Error).message}`);
    }
  });

  console.log('\n=== IPv6 Neural Architecture Demo Complete ===');
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIPv6NeuralDemo();
}
