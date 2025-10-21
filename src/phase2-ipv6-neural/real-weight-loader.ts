/**
 * Real Weight Loader for RFC XXXX Implementation
 *
 * Provides real weight loading capabilities for neural network models.
 * Supports file-based and HTTP-based weight loading.
 */

import { ModelWeights } from './browser-model-runtime.js';
import { NeuralArchitecture } from './ipv6-encoder.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface WeightFileFormat {
  version: string;
  architecture: NeuralArchitecture;
  weights: { [key: string]: number[] };
  metadata: {
    created: string;
    description: string;
    checksum?: string;
  };
}

export class RealWeightLoader {

  /**
   * Load weights from a JSON file
   */
  async loadFromFile(filePath: string): Promise<ModelWeights> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const weightFile: WeightFileFormat = JSON.parse(fileContent);

      // Validate file format
      if (!weightFile.weights || !weightFile.architecture) {
        throw new Error('Invalid weight file format');
      }

      // Convert string keys back to Float32Array
      const weights: ModelWeights = {};
      for (const [key, value] of Object.entries(weightFile.weights)) {
        if (Array.isArray(value)) {
          weights[key] = new Float32Array(value);
        } else {
          weights[key] = value;
        }
      }

      return weights;
    } catch (error) {
      throw new Error(`Failed to load weights from file ${filePath}: ${(error as Error).message}`);
    }
  }

  /**
   * Load weights from HTTP URL
   */
  async loadFromHTTP(url: string): Promise<ModelWeights> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const weightFile: WeightFileFormat = await response.json();

      // Validate file format
      if (!weightFile.weights || !weightFile.architecture) {
        throw new Error('Invalid weight file format from HTTP');
      }

      // Convert string keys back to Float32Array
      const weights: ModelWeights = {};
      for (const [key, value] of Object.entries(weightFile.weights)) {
        if (Array.isArray(value)) {
          weights[key] = new Float32Array(value);
        } else {
          weights[key] = value;
        }
      }

      return weights;
    } catch (error) {
      throw new Error(`Failed to load weights from HTTP ${url}: ${(error as Error).message}`);
    }
  }

  /**
   * Save weights to a JSON file
   */
  async saveToFile(weights: ModelWeights, filePath: string, architecture: NeuralArchitecture, description: string = ''): Promise<void> {
    try {
      // Convert Float32Array to regular arrays for JSON serialization
      const serializableWeights: { [key: string]: number[] } = {};
      for (const [key, value] of Object.entries(weights)) {
        if (value instanceof Float32Array) {
          serializableWeights[key] = Array.from(value);
        } else {
          serializableWeights[key] = Array.from(value);
        }
      }

      const weightFile: WeightFileFormat = {
        version: '1.0.0',
        architecture,
        weights: serializableWeights,
        metadata: {
          created: new Date().toISOString(),
          description,
          checksum: this.calculateChecksum(weights)
        }
      };

      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, JSON.stringify(weightFile, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save weights to file ${filePath}: ${(error as Error).message}`);
    }
  }

  /**
   * Load weights from base64 encoded data
   */
  async loadFromBase64(base64Data: string): Promise<ModelWeights> {
    try {
      const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
      const weightFile: WeightFileFormat = JSON.parse(jsonString);

      // Validate file format
      if (!weightFile.weights || !weightFile.architecture) {
        throw new Error('Invalid weight file format from base64');
      }

      // Convert string keys back to Float32Array
      const weights: ModelWeights = {};
      for (const [key, value] of Object.entries(weightFile.weights)) {
        if (Array.isArray(value)) {
          weights[key] = new Float32Array(value);
        } else {
          weights[key] = value;
        }
      }

      return weights;
    } catch (error) {
      throw new Error(`Failed to load weights from base64: ${(error as Error).message}`);
    }
  }

  /**
   * Save weights as base64 encoded data
   */
  async saveToBase64(weights: ModelWeights, architecture: NeuralArchitecture, description: string = ''): Promise<string> {
    try {
      // Convert Float32Array to regular arrays for JSON serialization
      const serializableWeights: { [key: string]: number[] } = {};
      for (const [key, value] of Object.entries(weights)) {
        if (value instanceof Float32Array) {
          serializableWeights[key] = Array.from(value);
        } else {
          serializableWeights[key] = Array.from(value);
        }
      }

      const weightFile: WeightFileFormat = {
        version: '1.0.0',
        architecture,
        weights: serializableWeights,
        metadata: {
          created: new Date().toISOString(),
          description,
          checksum: this.calculateChecksum(weights)
        }
      };

      const jsonString = JSON.stringify(weightFile, null, 2);
      return Buffer.from(jsonString, 'utf-8').toString('base64');
    } catch (error) {
      throw new Error(`Failed to save weights to base64: ${(error as Error).message}`);
    }
  }

  /**
   * Calculate a simple checksum for weight validation
   */
  private calculateChecksum(weights: ModelWeights): string {
    let checksum = 0;
    for (const [key, value] of Object.entries(weights)) {
      checksum += key.length;
      if (value instanceof Float32Array) {
        for (let i = 0; i < Math.min(value.length, 100); i++) {
          checksum += Math.abs(value[i]) * 1000;
        }
      }
    }
    return checksum.toString(16);
  }

  /**
   * Validate weight file format
   */
  validateWeightFile(weightFile: WeightFileFormat): boolean {
    try {
      // Check required fields
      if (!weightFile.version || !weightFile.architecture || !weightFile.weights || !weightFile.metadata) {
        return false;
      }

      // Check architecture fields
      const arch = weightFile.architecture;
      if (typeof arch.modelFamily !== 'number' ||
          typeof arch.featureDim !== 'number' ||
          typeof arch.hiddenLayers !== 'number' ||
          typeof arch.attentionHeads !== 'number' ||
          typeof arch.vocabSize !== 'number') {
        return false;
      }

      // Check weights structure
      if (typeof weightFile.weights !== 'object') {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get weight file information without loading weights
   */
  async getFileInfo(filePath: string): Promise<{ architecture: NeuralArchitecture; metadata: any }> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const weightFile: WeightFileFormat = JSON.parse(fileContent);

      if (!this.validateWeightFile(weightFile)) {
        throw new Error('Invalid weight file format');
      }

      return {
        architecture: weightFile.architecture,
        metadata: weightFile.metadata
      };
    } catch (error) {
      throw new Error(`Failed to read file info from ${filePath}: ${(error as Error).message}`);
    }
  }
}
