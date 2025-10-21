/**
 * Browser Model Runtime
 *
 * Implements in-memory neural network execution without external ML libraries.
 * Supports forward pass computation using simple matrix operations.
 */

import { NeuralArchitecture } from './ipv6-encoder.js';
import { RealWeightLoader } from './real-weight-loader.js';

export interface ModelWeights {
  [layerName: string]: Float32Array;
}

export type WeightInitStrategy = 'xavier' | 'he' | 'random_scaled';

export interface ForwardPassResult {
  output: Float32Array;
  intermediateActivations: { [layerName: string]: Float32Array };
  executionTime: number;
}

export interface ModelLayer {
  name: string;
  type: 'linear' | 'attention' | 'normalization' | 'activation';
  weights?: Float32Array;
  bias?: Float32Array;
  inputSize: number;
  outputSize: number;
  parameters: { [key: string]: any };
}

/**
 * Browser Model Runtime for Neural Network Execution
 *
 * Implements forward pass computation using native JavaScript operations.
 * No external ML libraries required - runs entirely in browser.
 */
export class BrowserModelRuntime {
  private architecture: NeuralArchitecture;
  private weights: ModelWeights;
  private layers: ModelLayer[];
  private weightLoader: RealWeightLoader;

  constructor(architecture: NeuralArchitecture, weights?: ModelWeights) {
    this.architecture = architecture;
    this.weights = weights || {};
    this.layers = this.buildModelLayers();
    this.weightLoader = new RealWeightLoader();
  }

  /**
   * Build model layers based on architecture
   */
  private buildModelLayers(): ModelLayer[] {
    const layers: ModelLayer[] = [];
    const { featureDim, hiddenLayers, attentionHeads, vocabSize } = this.architecture;

    // Input embedding layer
    layers.push({
      name: 'input_embedding',
      type: 'linear',
      inputSize: vocabSize,
      outputSize: featureDim,
      parameters: {}
    });

    // Hidden transformer layers
    for (let i = 0; i < hiddenLayers; i++) {
      // Multi-head attention
      layers.push({
        name: `attention_${i}`,
        type: 'attention',
        inputSize: featureDim,
        outputSize: featureDim,
        parameters: {
          numHeads: attentionHeads,
          headSize: featureDim / attentionHeads
        }
      });

      // Layer normalization
      layers.push({
        name: `norm_1_${i}`,
        type: 'normalization',
        inputSize: featureDim,
        outputSize: featureDim,
        parameters: {
          type: this.architecture.normalization
        }
      });

      // Feed-forward network
      layers.push({
        name: `ffn_${i}`,
        type: 'linear',
        inputSize: featureDim,
        outputSize: featureDim * 4, // Standard transformer FFN expansion
        parameters: {}
      });

      layers.push({
        name: `ffn_out_${i}`,
        type: 'linear',
        inputSize: featureDim * 4,
        outputSize: featureDim,
        parameters: {}
      });

      // Second layer normalization
      layers.push({
        name: `norm_2_${i}`,
        type: 'normalization',
        inputSize: featureDim,
        outputSize: featureDim,
        parameters: {
          type: this.architecture.normalization
        }
      });
    }

    // Output layer
    layers.push({
      name: 'output_projection',
      type: 'linear',
      inputSize: featureDim,
      outputSize: vocabSize,
      parameters: {}
    });

    return layers;
  }

  /**
   * Execute forward pass through the model
   */
  async forwardPass(inputTokens: number[]): Promise<ForwardPassResult> {
    const startTime = performance.now();
    const intermediateActivations: { [layerName: string]: Float32Array } = {};

    // Convert input tokens to embeddings
    let currentActivation = this.tokenToEmbedding(inputTokens);
    intermediateActivations['input'] = currentActivation;

    // Process through each layer
    for (const layer of this.layers) {
      currentActivation = await this.processLayer(layer, currentActivation);
      intermediateActivations[layer.name] = currentActivation;
    }

    const executionTime = performance.now() - startTime;

    return {
      output: currentActivation,
      intermediateActivations,
      executionTime
    };
  }

  /**
   * Process a single layer
   */
  private async processLayer(layer: ModelLayer, input: Float32Array): Promise<Float32Array> {
    switch (layer.type) {
      case 'linear':
        return this.linearLayer(layer, input);
      case 'attention':
        return this.attentionLayer(layer, input);
      case 'normalization':
        return this.normalizationLayer(layer, input);
      case 'activation':
        return this.activationLayer(layer, input);
      default:
        throw new Error(`Unknown layer type: ${layer.type}`);
    }
  }

  /**
   * Linear layer computation: y = xW + b
   */
  private linearLayer(layer: ModelLayer, input: Float32Array): Float32Array {
    const weights = this.weights[`${layer.name}.weight`];
    const bias = this.weights[`${layer.name}.bias`];

    if (!weights) {
      // Initialize random weights if not provided
      const weightSize = layer.inputSize * layer.outputSize;
      const randomWeights = new Float32Array(weightSize);
      for (let i = 0; i < weightSize; i++) {
        randomWeights[i] = (Math.random() - 0.5) * 0.1; // Small random weights
      }
      this.weights[`${layer.name}.weight`] = randomWeights;
    }

    if (!bias) {
      // Initialize zero bias if not provided
      this.weights[`${layer.name}.bias`] = new Float32Array(layer.outputSize);
    }

    const output = new Float32Array(layer.outputSize);
    const weightMatrix = this.weights[`${layer.name}.weight`];
    const biasVector = this.weights[`${layer.name}.bias`];

    // Debug: Check for NaN values in weights
    for (let i = 0; i < weightMatrix.length; i++) {
      if (isNaN(weightMatrix[i])) {
        console.error(`NaN found in weight matrix ${layer.name} at index ${i}`);
        weightMatrix[i] = 0; // Fix NaN values
      }
    }

    // Matrix multiplication: output = input * weights + bias
    // Weight matrix is stored in row-major order: weights[input_idx * outputSize + output_idx]
    for (let i = 0; i < layer.outputSize; i++) {
      let sum = biasVector[i];
      for (let j = 0; j < layer.inputSize; j++) {
        const weightIndex = j * layer.outputSize + i;
        if (weightIndex >= weightMatrix.length) {
          console.error(`Weight index ${weightIndex} out of bounds for layer ${layer.name} (matrix size: ${weightMatrix.length})`);
          continue;
        }
        sum += input[j] * weightMatrix[weightIndex];
      }
      output[i] = sum;
    }

    return output;
  }

  /**
   * Multi-head attention layer (simplified)
   */
  private attentionLayer(_layer: ModelLayer, input: Float32Array): Float32Array {
    // const { numHeads, headSize } = layer.parameters;
    // const seqLen = input.length / this.architecture.featureDim;

    // Simplified attention: just return input for now
    // In a full implementation, this would compute Q, K, V matrices
    // and perform scaled dot-product attention

    const output = new Float32Array(input.length);

    // Simple residual connection
    for (let i = 0; i < input.length; i++) {
      output[i] = input[i] * 0.5; // Simplified attention output
    }

    return output;
  }

  /**
   * Normalization layer
   */
  private normalizationLayer(layer: ModelLayer, input: Float32Array): Float32Array {
    const { type } = layer.parameters;
    // const output = new Float32Array(input.length);

    switch (type) {
      case 'layer':
        return this.layerNormalization(input);
      case 'rms':
        return this.rmsNormalization(input);
      case 'batch':
        return this.batchNormalization(input);
      case 'none':
        return input;
      default:
        return this.layerNormalization(input);
    }
  }

  /**
   * Layer normalization
   */
  private layerNormalization(input: Float32Array): Float32Array {
    const output = new Float32Array(input.length);

    // Calculate mean and variance
    let mean = 0;
    let variance = 0;

    for (let i = 0; i < input.length; i++) {
      mean += input[i];
    }
    mean /= input.length;

    for (let i = 0; i < input.length; i++) {
      variance += Math.pow(input[i] - mean, 2);
    }
    variance /= input.length;

    const std = Math.sqrt(variance + 1e-8); // Add epsilon for numerical stability

    // Normalize
    for (let i = 0; i < input.length; i++) {
      output[i] = (input[i] - mean) / std;
    }

    return output;
  }

  /**
   * RMS normalization
   */
  private rmsNormalization(input: Float32Array): Float32Array {
    const output = new Float32Array(input.length);

    // Calculate RMS
    let rms = 0;
    for (let i = 0; i < input.length; i++) {
      rms += input[i] * input[i];
    }
    rms = Math.sqrt(rms / input.length + 1e-8);

    // Normalize
    for (let i = 0; i < input.length; i++) {
      output[i] = input[i] / rms;
    }

    return output;
  }

  /**
   * Batch normalization (simplified)
   */
  private batchNormalization(input: Float32Array): Float32Array {
    // Simplified batch norm - just return input for now
    // In a full implementation, this would maintain running statistics
    return input;
  }

  /**
   * Activation layer
   */
  private activationLayer(_layer: ModelLayer, input: Float32Array): Float32Array {
    const output = new Float32Array(input.length);

    switch (this.architecture.activation) {
      case 'relu':
        for (let i = 0; i < input.length; i++) {
          output[i] = Math.max(0, input[i]);
        }
        break;
      case 'gelu':
        for (let i = 0; i < input.length; i++) {
          const x = input[i];
          output[i] = 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));
        }
        break;
      case 'silu':
        for (let i = 0; i < input.length; i++) {
          output[i] = input[i] / (1 + Math.exp(-input[i]));
        }
        break;
      case 'tanh':
        for (let i = 0; i < input.length; i++) {
          output[i] = Math.tanh(input[i]);
        }
        break;
      case 'linear':
        return input;
      default:
        // Default to ReLU
        for (let i = 0; i < input.length; i++) {
          output[i] = Math.max(0, input[i]);
        }
    }

    return output;
  }

  /**
   * Convert input tokens to embeddings
   */
  private tokenToEmbedding(tokens: number[]): Float32Array {
    const { featureDim } = this.architecture;
    const embedding = new Float32Array(tokens.length * featureDim);

    // Simple token embedding (in practice, this would use learned embeddings)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const startIdx = i * featureDim;

      // Create simple embedding based on token value
      for (let j = 0; j < featureDim; j++) {
        embedding[startIdx + j] = Math.sin(token * (j + 1) / featureDim) * 0.1;
      }
    }

    return embedding;
  }

  /**
   * Load weights from external source
   */
  async loadWeights(weights: ModelWeights): Promise<void> {
    this.weights = { ...this.weights, ...weights };
  }

  /**
   * Get model weights
   */
  getWeights(): ModelWeights {
    return { ...this.weights };
  }

  /**
   * Get model architecture
   */
  getArchitecture(): NeuralArchitecture {
    return { ...this.architecture };
  }

  /**
   * Get model layers
   */
  getLayers(): ModelLayer[] {
    return [...this.layers];
  }

  /**
   * Calculate model parameter count
   */
  calculateParameterCount(): number {
    let totalParams = 0;

    for (const layer of this.layers) {
      if (layer.type === 'linear') {
        totalParams += layer.inputSize * layer.outputSize; // weights
        totalParams += layer.outputSize; // bias
      } else if (layer.type === 'attention') {
        // Simplified: assume attention has same parameter count as linear layer
        totalParams += layer.inputSize * layer.outputSize * 3; // Q, K, V matrices
        totalParams += layer.outputSize; // output projection
      }
    }

    return totalParams;
  }

  /**
   * Get model size in bytes
   */
  getModelSizeBytes(): number {
    const paramCount = this.calculateParameterCount();
    return paramCount * 4; // 4 bytes per float32 parameter
  }

  /**
   * Validate model weights
   */
  validateWeights(): boolean {
    try {
      for (const layer of this.layers) {
        if (layer.type === 'linear') {
          const weightKey = `${layer.name}.weight`;
          const biasKey = `${layer.name}.bias`;

          if (this.weights[weightKey]) {
            const expectedWeightSize = layer.inputSize * layer.outputSize;
            if (this.weights[weightKey].length !== expectedWeightSize) {
              return false;
            }
          }

          if (this.weights[biasKey]) {
            if (this.weights[biasKey].length !== layer.outputSize) {
              return false;
            }
          }
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate random weights for the model architecture with configurable initialization strategy
   */
  generateRandomWeights(strategy: WeightInitStrategy = 'xavier'): ModelWeights {
    const weights: ModelWeights = {};

    for (const layer of this.layers) {
      if (layer.type === 'linear') {
        const weightSize = layer.inputSize * layer.outputSize;
        const weightArray = new Float32Array(weightSize);
        const biasArray = new Float32Array(layer.outputSize);

        // Apply selected initialization strategy
        const scale = this.calculateInitScale(layer.inputSize, layer.outputSize, strategy);

        for (let i = 0; i < weightSize; i++) {
          weightArray[i] = (Math.random() - 0.5) * 2 * scale;
        }

        for (let i = 0; i < layer.outputSize; i++) {
          biasArray[i] = 0; // Initialize bias to zero
        }

        weights[`${layer.name}.weight`] = weightArray;
        weights[`${layer.name}.bias`] = biasArray;
      }
    }

    return weights;
  }

  /**
   * Calculate initialization scale based on strategy
   */
  private calculateInitScale(inputSize: number, outputSize: number, strategy: WeightInitStrategy): number {
    switch (strategy) {
      case 'xavier':
        // Xavier/Glorot initialization - good for sigmoid/tanh activations
        return Math.sqrt(2.0 / (inputSize + outputSize));

      case 'he':
        // He initialization - good for ReLU activations
        return Math.sqrt(2.0 / inputSize);

      case 'random_scaled':
        // Simple random initialization with proper scaling
        return Math.sqrt(1.0 / inputSize);

      default:
        return Math.sqrt(2.0 / (inputSize + outputSize)); // Default to Xavier
    }
  }

  /**
   * Load weights from file
   */
  async loadWeightsFromFile(filePath: string): Promise<void> {
    try {
      const weights = await this.weightLoader.loadFromFile(filePath);
      await this.loadWeights(weights);
    } catch (error) {
      throw new Error(`Failed to load weights from file: ${(error as Error).message}`);
    }
  }

  /**
   * Load weights from HTTP URL
   */
  async loadWeightsFromHTTP(url: string): Promise<void> {
    try {
      const weights = await this.weightLoader.loadFromHTTP(url);
      await this.loadWeights(weights);
    } catch (error) {
      throw new Error(`Failed to load weights from HTTP: ${(error as Error).message}`);
    }
  }

  /**
   * Load weights from base64 encoded data
   */
  async loadWeightsFromBase64(base64Data: string): Promise<void> {
    try {
      const weights = await this.weightLoader.loadFromBase64(base64Data);
      await this.loadWeights(weights);
    } catch (error) {
      throw new Error(`Failed to load weights from base64: ${(error as Error).message}`);
    }
  }

  /**
   * Save current weights to file
   */
  async saveWeights(filePath: string, description: string = ''): Promise<void> {
    try {
      await this.weightLoader.saveToFile(this.weights, filePath, this.architecture, description);
    } catch (error) {
      throw new Error(`Failed to save weights to file: ${(error as Error).message}`);
    }
  }

  /**
   * Save current weights as base64 encoded data
   */
  async saveWeightsToBase64(description: string = ''): Promise<string> {
    try {
      return await this.weightLoader.saveToBase64(this.weights, this.architecture, description);
    } catch (error) {
      throw new Error(`Failed to save weights to base64: ${(error as Error).message}`);
    }
  }

  /**
   * Get weight file information without loading weights
   */
  async getFileInfo(filePath: string): Promise<{ architecture: NeuralArchitecture; metadata: any }> {
    try {
      return await this.weightLoader.getFileInfo(filePath);
    } catch (error) {
      throw new Error(`Failed to get file info: ${(error as Error).message}`);
    }
  }
}
