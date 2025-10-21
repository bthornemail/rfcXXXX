/**
 * IPv6 Neural Architecture Encoder
 *
 * Implements RFC XXXX Appendix II IPv6 ↔ Neural Architecture mapping.
 * Uses 8-segment IPv6 addresses to encode complete neural architectures.
 */

export interface NeuralArchitecture {
  modelFamily: number;        // 0-15 (4 bits)
  featureDim: number;         // 0-4095 (12 bits)
  hiddenLayers: number;       // 0-15 (4 bits)
  attentionHeads: number;     // 0-15 (4 bits)
  activation: ActivationType; // 0-15 (4 bits)
  normalization: NormalizationType; // 0-15 (4 bits)
  contextLength: number;      // 0-4095 (12 bits)
  vocabSize: number;          // 0-65535 (16 bits)
  dropout: number;            // 0-100 (7 bits, percentage)
  learningRate: number;       // 0-127 (7 bits, scaled)
  ipv6Address?: string;       // Generated IPv6 address
}

export type ActivationType = 'relu' | 'gelu' | 'silu' | 'tanh' | 'linear' | 'swish' | 'mish' | 'elu' | 'leaky_relu' | 'sigmoid' | 'softmax' | 'softplus' | 'softsign' | 'hard_sigmoid' | 'exponential' | 'selu';

export type NormalizationType = 'layer' | 'rms' | 'batch' | 'group' | 'instance' | 'weight' | 'spectral' | 'adaptive' | 'none' | 'l2' | 'max' | 'minmax' | 'robust' | 'quantile' | 'power' | 'unit_variance';

/**
 * IPv6 Neural Architecture Encoder
 *
 * Maps neural architecture parameters to IPv6 addresses using bit-level packing.
 * Each IPv6 address segment (16 bits) encodes specific architecture parameters.
 */
export class IPv6NeuralEncoder {

  // Activation type mapping
  private static readonly ACTIVATION_MAP: Record<ActivationType, number> = {
    'relu': 0, 'gelu': 1, 'silu': 2, 'tanh': 3, 'linear': 4,
    'swish': 5, 'mish': 6, 'elu': 7, 'leaky_relu': 8, 'sigmoid': 9,
    'softmax': 10, 'softplus': 11, 'softsign': 12, 'hard_sigmoid': 13,
    'exponential': 14, 'selu': 15
  };

  // Normalization type mapping
  private static readonly NORMALIZATION_MAP: Record<NormalizationType, number> = {
    'layer': 0, 'rms': 1, 'batch': 2, 'group': 3, 'instance': 4,
    'weight': 5, 'spectral': 6, 'adaptive': 7, 'none': 8, 'l2': 9,
    'max': 10, 'minmax': 11, 'robust': 12, 'quantile': 13,
    'power': 14, 'unit_variance': 15
  };

  // Reverse mappings
  private static readonly ACTIVATION_REVERSE = Object.fromEntries(
    Object.entries(IPv6NeuralEncoder.ACTIVATION_MAP).map(([k, v]) => [v, k])
  ) as Record<number, ActivationType>;

  private static readonly NORMALIZATION_REVERSE = Object.fromEntries(
    Object.entries(IPv6NeuralEncoder.NORMALIZATION_MAP).map(([k, v]) => [v, k])
  ) as Record<number, NormalizationType>;

  /**
   * Convert neural architecture to IPv6 address
   *
   * IPv6 Format: 8 segments of 16 bits each
   * Segment 0: Model Family (4) + Feature Dim (12)
   * Segment 1: Hidden Layers (4) + Attention Heads (4) + Activation (4) + Normalization (4)
   * Segment 2: Context Length (12) + Dropout (4)
   * Segment 3: Vocab Size (16)
   * Segment 4: Learning Rate (7) + Reserved (9)
   * Segment 5-7: Reserved for future extensions
   */
  architectureToIPv6(arch: NeuralArchitecture): string {
    // Validate input parameters
    this.validateArchitecture(arch);

    // Pack parameters into IPv6 segments
    const segments: number[] = [];

    // Segment 0: Model Family (4 bits) + Feature Dim (12 bits)
    const segment0 = (arch.modelFamily << 12) | (arch.featureDim & 0xFFF);
    segments.push(segment0);

    // Segment 1: Hidden Layers (4) + Attention Heads (4) + Activation (4) + Normalization (4)
    const activationCode = IPv6NeuralEncoder.ACTIVATION_MAP[arch.activation];
    const normalizationCode = IPv6NeuralEncoder.NORMALIZATION_MAP[arch.normalization];
    const segment1 = (arch.hiddenLayers << 12) | (arch.attentionHeads << 8) | (activationCode << 4) | normalizationCode;
    segments.push(segment1);

    // Segment 2: Context Length (12 bits) + Dropout (4 bits)
    const dropoutScaled = Math.round(arch.dropout * 15 / 100); // Scale 0-100 to 0-15
    const segment2 = (arch.contextLength << 4) | (dropoutScaled & 0xF);
    segments.push(segment2);

    // Segment 3: Vocab Size (16 bits)
    segments.push(arch.vocabSize & 0xFFFF);

    // Segment 4: Learning Rate (7 bits) + Reserved (9 bits)
    const learningRateScaled = Math.round(arch.learningRate * 127); // Scale 0-1 to 0-127
    const segment4 = (learningRateScaled << 9);
    segments.push(segment4);

    // Segments 5-7: Reserved for future extensions
    segments.push(0, 0, 0);

    // Convert to IPv6 format
    const ipv6 = segments.map(seg => seg.toString(16).padStart(4, '0')).join(':');

    return ipv6;
  }

  /**
   * Convert IPv6 address to neural architecture
   */
  ipv6ToArchitecture(ipv6: string): NeuralArchitecture {
    // Parse IPv6 address
    const segments = this.parseIPv6(ipv6);

    if (segments.length !== 8) {
      throw new Error(`Invalid IPv6 address: expected 8 segments, got ${segments.length}`);
    }

    // Extract parameters from segments
    const segment0 = segments[0];
    const segment1 = segments[1];
    const segment2 = segments[2];
    const segment3 = segments[3];
    const segment4 = segments[4];

    // Segment 0: Model Family (4 bits) + Feature Dim (12 bits)
    const modelFamily = (segment0 >> 12) & 0xF;
    const featureDim = segment0 & 0xFFF;

    // Segment 1: Hidden Layers (4) + Attention Heads (4) + Activation (4) + Normalization (4)
    const hiddenLayers = (segment1 >> 12) & 0xF;
    const attentionHeads = (segment1 >> 8) & 0xF;
    const activationCode = (segment1 >> 4) & 0xF;
    const normalizationCode = segment1 & 0xF;

    // Segment 2: Context Length (12 bits) + Dropout (4 bits)
    const contextLength = (segment2 >> 4) & 0xFFF;
    const dropoutScaled = segment2 & 0xF;

    // Segment 3: Vocab Size (16 bits)
    const vocabSize = segment3 & 0xFFFF;

    // Segment 4: Learning Rate (7 bits) + Reserved (9 bits)
    const learningRateScaled = (segment4 >> 9) & 0x7F;

    // Convert codes back to types
    const activation = IPv6NeuralEncoder.ACTIVATION_REVERSE[activationCode];
    const normalization = IPv6NeuralEncoder.NORMALIZATION_REVERSE[normalizationCode];

    if (!activation) {
      throw new Error(`Invalid activation code: ${activationCode}`);
    }

    if (!normalization) {
      throw new Error(`Invalid normalization code: ${normalizationCode}`);
    }

    // Scale values back to original ranges
    const dropout = (dropoutScaled * 100) / 15; // Scale 0-15 back to 0-100
    const learningRate = learningRateScaled / 127; // Scale 0-127 back to 0-1

    const architecture: NeuralArchitecture = {
      modelFamily,
      featureDim,
      hiddenLayers,
      attentionHeads,
      activation,
      normalization,
      contextLength,
      vocabSize,
      dropout,
      learningRate,
      ipv6Address: ipv6
    };

    // Validate decoded architecture
    this.validateArchitecture(architecture);

    return architecture;
  }

  /**
   * Parse IPv6 address into segments
   */
  private parseIPv6(ipv6: string): number[] {
    // Remove any whitespace and convert to lowercase
    const cleaned = ipv6.trim().toLowerCase();

    // Handle compressed IPv6 (::)
    let expanded = cleaned;
    if (cleaned.includes('::')) {
      const parts = cleaned.split('::');
      if (parts.length !== 2) {
        throw new Error('Invalid IPv6 format: multiple :: found');
      }

      const leftParts = parts[0] ? parts[0].split(':') : [];
      const rightParts = parts[1] ? parts[1].split(':') : [];
      const missingSegments = 8 - leftParts.length - rightParts.length;

      if (missingSegments < 0) {
        throw new Error('Invalid IPv6 format: too many segments');
      }

      const zeros = Array(missingSegments).fill('0');
      expanded = [...leftParts, ...zeros, ...rightParts].join(':');
    }

    // Split into segments
    const segments = expanded.split(':');

    if (segments.length !== 8) {
      throw new Error(`Invalid IPv6 format: expected 8 segments, got ${segments.length}`);
    }

    // Convert each segment to number
    return segments.map(segment => {
      if (segment.length === 0 || segment.length > 4) {
        throw new Error(`Invalid IPv6 segment: ${segment}`);
      }

      const num = parseInt(segment, 16);
      if (isNaN(num) || num < 0 || num > 0xFFFF) {
        throw new Error(`Invalid IPv6 segment value: ${segment}`);
      }

      return num;
    });
  }

  /**
   * Validate neural architecture parameters
   */
  private validateArchitecture(arch: NeuralArchitecture): void {
    if (arch.modelFamily < 0 || arch.modelFamily > 15) {
      throw new Error(`Model family must be 0-15, got ${arch.modelFamily}`);
    }

    if (arch.featureDim < 0 || arch.featureDim > 4095) {
      throw new Error(`Feature dimension must be 0-4095, got ${arch.featureDim}`);
    }

    if (arch.hiddenLayers < 0 || arch.hiddenLayers > 15) {
      throw new Error(`Hidden layers must be 0-15, got ${arch.hiddenLayers}`);
    }

    if (arch.attentionHeads < 0 || arch.attentionHeads > 15) {
      throw new Error(`Attention heads must be 0-15, got ${arch.attentionHeads}`);
    }

    if (!IPv6NeuralEncoder.ACTIVATION_MAP.hasOwnProperty(arch.activation)) {
      throw new Error(`Invalid activation type: ${arch.activation}`);
    }

    if (!IPv6NeuralEncoder.NORMALIZATION_MAP.hasOwnProperty(arch.normalization)) {
      throw new Error(`Invalid normalization type: ${arch.normalization}`);
    }

    if (arch.contextLength < 0 || arch.contextLength > 4095) {
      throw new Error(`Context length must be 0-4095, got ${arch.contextLength}`);
    }

    if (arch.vocabSize < 0 || arch.vocabSize > 65535) {
      throw new Error(`Vocab size must be 0-65535, got ${arch.vocabSize}`);
    }

    if (arch.dropout < 0 || arch.dropout > 100) {
      throw new Error(`Dropout must be 0-100, got ${arch.dropout}`);
    }

    if (arch.learningRate < 0 || arch.learningRate > 1) {
      throw new Error(`Learning rate must be 0-1, got ${arch.learningRate}`);
    }
  }

  /**
   * Create example architectures for testing
   */
  static createExampleArchitectures(): NeuralArchitecture[] {
    return [
      {
        modelFamily: 1,
        featureDim: 512,
        hiddenLayers: 6,
        attentionHeads: 8,
        activation: 'gelu',
        normalization: 'layer',
        contextLength: 2048,
        vocabSize: 50257,
        dropout: 0.1,
        learningRate: 0.001
      },
      {
        modelFamily: 2,
        featureDim: 768,
        hiddenLayers: 12,
        attentionHeads: 12,
        activation: 'relu',
        normalization: 'batch',
        contextLength: 1024,
        vocabSize: 30000,
        dropout: 0.2,
        learningRate: 0.0005
      },
      {
        modelFamily: 3,
        featureDim: 1024,
        hiddenLayers: 24,
        attentionHeads: 16,
        activation: 'silu',
        normalization: 'rms',
        contextLength: 4096,
        vocabSize: 100000,
        dropout: 0.0,
        learningRate: 0.0001
      }
    ];
  }

  /**
   * Test round-trip encoding/decoding
   */
  testRoundTrip(arch: NeuralArchitecture): boolean {
    try {
      const ipv6 = this.architectureToIPv6(arch);
      const decoded = this.ipv6ToArchitecture(ipv6);

      // Compare all fields except ipv6Address (which will be set)
      return (
        decoded.modelFamily === arch.modelFamily &&
        decoded.featureDim === arch.featureDim &&
        decoded.hiddenLayers === arch.hiddenLayers &&
        decoded.attentionHeads === arch.attentionHeads &&
        decoded.activation === arch.activation &&
        decoded.normalization === arch.normalization &&
        decoded.contextLength === arch.contextLength &&
        decoded.vocabSize === arch.vocabSize &&
        Math.abs(decoded.dropout - arch.dropout) < 0.01 && // Allow small rounding error
        Math.abs(decoded.learningRate - arch.learningRate) < 0.001 // Allow small rounding error
      );
    } catch (error) {
      console.error('Round-trip test failed:', error);
      return false;
    }
  }

  /**
   * Get architecture summary
   */
  getArchitectureSummary(arch: NeuralArchitecture): string {
    return `
Neural Architecture Summary:
- Model Family: ${arch.modelFamily}
- Feature Dimension: ${arch.featureDim}
- Hidden Layers: ${arch.hiddenLayers}
- Attention Heads: ${arch.attentionHeads}
- Activation: ${arch.activation}
- Normalization: ${arch.normalization}
- Context Length: ${arch.contextLength}
- Vocab Size: ${arch.vocabSize}
- Dropout: ${arch.dropout}%
- Learning Rate: ${arch.learningRate}
- IPv6 Address: ${arch.ipv6Address || 'Not encoded'}
    `.trim();
  }

  /**
   * Calculate architecture complexity score
   */
  calculateComplexityScore(arch: NeuralArchitecture): number {
    // Weighted complexity calculation
    const weights = {
      featureDim: 0.3,
      hiddenLayers: 0.25,
      attentionHeads: 0.2,
      contextLength: 0.15,
      vocabSize: 0.1
    };

    // Normalize values to 0-1 range
    const normalized = {
      featureDim: arch.featureDim / 4095,
      hiddenLayers: arch.hiddenLayers / 15,
      attentionHeads: arch.attentionHeads / 15,
      contextLength: arch.contextLength / 4095,
      vocabSize: arch.vocabSize / 65535
    };

    // Calculate weighted sum
    const complexity = Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (normalized[key as keyof typeof normalized] * weight);
    }, 0);

    return Math.round(complexity * 100) / 100; // Round to 2 decimal places
  }
}
