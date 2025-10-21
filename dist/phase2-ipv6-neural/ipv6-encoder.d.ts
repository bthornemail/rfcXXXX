/**
 * IPv6 Neural Architecture Encoder
 *
 * Implements RFC XXXX Appendix II IPv6 ↔ Neural Architecture mapping.
 * Uses 8-segment IPv6 addresses to encode complete neural architectures.
 */
export interface NeuralArchitecture {
    modelFamily: number;
    featureDim: number;
    hiddenLayers: number;
    attentionHeads: number;
    activation: ActivationType;
    normalization: NormalizationType;
    contextLength: number;
    vocabSize: number;
    dropout: number;
    learningRate: number;
    ipv6Address?: string;
}
export type ActivationType = 'relu' | 'gelu' | 'silu' | 'tanh' | 'linear' | 'swish' | 'mish' | 'elu' | 'leaky_relu' | 'sigmoid' | 'softmax' | 'softplus' | 'softsign' | 'hard_sigmoid' | 'exponential' | 'selu';
export type NormalizationType = 'layer' | 'rms' | 'batch' | 'group' | 'instance' | 'weight' | 'spectral' | 'adaptive' | 'none' | 'l2' | 'max' | 'minmax' | 'robust' | 'quantile' | 'power' | 'unit_variance';
/**
 * IPv6 Neural Architecture Encoder
 *
 * Maps neural architecture parameters to IPv6 addresses using bit-level packing.
 * Each IPv6 address segment (16 bits) encodes specific architecture parameters.
 */
export declare class IPv6NeuralEncoder {
    private static readonly ACTIVATION_MAP;
    private static readonly NORMALIZATION_MAP;
    private static readonly ACTIVATION_REVERSE;
    private static readonly NORMALIZATION_REVERSE;
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
    architectureToIPv6(arch: NeuralArchitecture): string;
    /**
     * Convert IPv6 address to neural architecture
     */
    ipv6ToArchitecture(ipv6: string): NeuralArchitecture;
    /**
     * Parse IPv6 address into segments
     */
    private parseIPv6;
    /**
     * Validate neural architecture parameters
     */
    private validateArchitecture;
    /**
     * Create example architectures for testing
     */
    static createExampleArchitectures(): NeuralArchitecture[];
    /**
     * Test round-trip encoding/decoding
     */
    testRoundTrip(arch: NeuralArchitecture): boolean;
    /**
     * Get architecture summary
     */
    getArchitectureSummary(arch: NeuralArchitecture): string;
    /**
     * Calculate architecture complexity score
     */
    calculateComplexityScore(arch: NeuralArchitecture): number;
}
