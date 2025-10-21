/**
 * Real Weight Loader for RFC XXXX Implementation
 *
 * Provides real weight loading capabilities for neural network models.
 * Supports file-based and HTTP-based weight loading.
 */
import { ModelWeights } from './browser-model-runtime.js';
import { NeuralArchitecture } from './ipv6-encoder.js';
export interface WeightFileFormat {
    version: string;
    architecture: NeuralArchitecture;
    weights: {
        [key: string]: number[];
    };
    metadata: {
        created: string;
        description: string;
        checksum?: string;
    };
}
export declare class RealWeightLoader {
    /**
     * Load weights from a JSON file
     */
    loadFromFile(filePath: string): Promise<ModelWeights>;
    /**
     * Load weights from HTTP URL
     */
    loadFromHTTP(url: string): Promise<ModelWeights>;
    /**
     * Save weights to a JSON file
     */
    saveToFile(weights: ModelWeights, filePath: string, architecture: NeuralArchitecture, description?: string): Promise<void>;
    /**
     * Load weights from base64 encoded data
     */
    loadFromBase64(base64Data: string): Promise<ModelWeights>;
    /**
     * Save weights as base64 encoded data
     */
    saveToBase64(weights: ModelWeights, architecture: NeuralArchitecture, description?: string): Promise<string>;
    /**
     * Calculate a simple checksum for weight validation
     */
    private calculateChecksum;
    /**
     * Validate weight file format
     */
    validateWeightFile(weightFile: WeightFileFormat): boolean;
    /**
     * Get weight file information without loading weights
     */
    getFileInfo(filePath: string): Promise<{
        architecture: NeuralArchitecture;
        metadata: any;
    }>;
}
