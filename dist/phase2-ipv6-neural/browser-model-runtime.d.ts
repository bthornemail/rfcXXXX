/**
 * Browser Model Runtime
 *
 * Implements in-memory neural network execution without external ML libraries.
 * Supports forward pass computation using simple matrix operations.
 */
import { NeuralArchitecture } from './ipv6-encoder.js';
export interface ModelWeights {
    [layerName: string]: Float32Array;
}
export type WeightInitStrategy = 'xavier' | 'he' | 'random_scaled';
export interface ForwardPassResult {
    output: Float32Array;
    intermediateActivations: {
        [layerName: string]: Float32Array;
    };
    executionTime: number;
}
export interface ModelLayer {
    name: string;
    type: 'linear' | 'attention' | 'normalization' | 'activation';
    weights?: Float32Array;
    bias?: Float32Array;
    inputSize: number;
    outputSize: number;
    parameters: {
        [key: string]: any;
    };
}
/**
 * Browser Model Runtime for Neural Network Execution
 *
 * Implements forward pass computation using native JavaScript operations.
 * No external ML libraries required - runs entirely in browser.
 */
export declare class BrowserModelRuntime {
    private architecture;
    private weights;
    private layers;
    private weightLoader;
    constructor(architecture: NeuralArchitecture, weights?: ModelWeights);
    /**
     * Build model layers based on architecture
     */
    private buildModelLayers;
    /**
     * Execute forward pass through the model
     */
    forwardPass(inputTokens: number[]): Promise<ForwardPassResult>;
    /**
     * Process a single layer
     */
    private processLayer;
    /**
     * Linear layer computation: y = xW + b
     */
    private linearLayer;
    /**
     * Multi-head attention layer (simplified)
     */
    private attentionLayer;
    /**
     * Normalization layer
     */
    private normalizationLayer;
    /**
     * Layer normalization
     */
    private layerNormalization;
    /**
     * RMS normalization
     */
    private rmsNormalization;
    /**
     * Batch normalization (simplified)
     */
    private batchNormalization;
    /**
     * Activation layer
     */
    private activationLayer;
    /**
     * Convert input tokens to embeddings
     */
    private tokenToEmbedding;
    /**
     * Load weights from external source
     */
    loadWeights(weights: ModelWeights): Promise<void>;
    /**
     * Get model weights
     */
    getWeights(): ModelWeights;
    /**
     * Get model architecture
     */
    getArchitecture(): NeuralArchitecture;
    /**
     * Get model layers
     */
    getLayers(): ModelLayer[];
    /**
     * Calculate model parameter count
     */
    calculateParameterCount(): number;
    /**
     * Get model size in bytes
     */
    getModelSizeBytes(): number;
    /**
     * Validate model weights
     */
    validateWeights(): boolean;
    /**
     * Generate random weights for the model architecture with configurable initialization strategy
     */
    generateRandomWeights(strategy?: WeightInitStrategy): ModelWeights;
    /**
     * Calculate initialization scale based on strategy
     */
    private calculateInitScale;
    /**
     * Load weights from file
     */
    loadWeightsFromFile(filePath: string): Promise<void>;
    /**
     * Load weights from HTTP URL
     */
    loadWeightsFromHTTP(url: string): Promise<void>;
    /**
     * Load weights from base64 encoded data
     */
    loadWeightsFromBase64(base64Data: string): Promise<void>;
    /**
     * Save current weights to file
     */
    saveWeights(filePath: string, description?: string): Promise<void>;
    /**
     * Save current weights as base64 encoded data
     */
    saveWeightsToBase64(description?: string): Promise<string>;
    /**
     * Get weight file information without loading weights
     */
    getFileInfo(filePath: string): Promise<{
        architecture: NeuralArchitecture;
        metadata: any;
    }>;
}
