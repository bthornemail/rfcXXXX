/**
 * Network Partition Detection via Geometric Duality
 *
 * Implements RFC XXXX Appendix I partition handling using Betti numbers
 * and geometric decomposition for O(v) partition detection.
 */
import { GeometricType } from './geometric-types.js';
import { BettiNumbers } from './betti-numbers.js';
import { DecisionVertex, ConsensusCertificate } from './geometric-consensus.js';
export interface PartitionInfo {
    isPartitioned: boolean;
    partitionCount: number;
    components: Set<string>[];
    bettiNumbers: BettiNumbers;
    originalGeometricType: GeometricType;
    decomposedGeometricType?: GeometricType;
    partitionVertices: DecisionVertex[][];
}
export interface PartitionCertificate {
    certificateId: string;
    originalCertificate: ConsensusCertificate;
    partitionInfo: PartitionInfo;
    decompositionProof: string;
    timestamp: string;
}
/**
 * Network Partition Detector using Betti Numbers
 *
 * Key innovation: O(v) partition detection vs O(v²) graph traversal
 * Uses β₀ (connected components) for instant partition detection
 */
export declare class PartitionDetector {
    private bettiCalculator;
    constructor();
    /**
     * Detect network partition via Betti numbers
     *
     * Algorithm:
     * 1. Build consensus graph from decision vertices
     * 2. Calculate Betti numbers using algebraic topology
     * 3. β₀ > 1 indicates partition
     * 4. Decompose geometric type based on partition count
     */
    detectViaBettiNumbers(vertices: DecisionVertex[]): PartitionInfo;
    /**
     * Decompose geometric type under partition
     *
     * Maps original geometric type to appropriate decomposed type
     * based on partition count and geometric properties
     */
    decomposeGeometricType(original: GeometricType, partitionCount: number): GeometricType;
    /**
     * Get default decomposition for unknown geometric types
     */
    private getDefaultDecomposition;
    /**
     * Convert decision vertices to topological vertices
     */
    private convertToVertices;
    /**
     * Build consensus edges based on agreement relationships
     */
    private buildConsensusEdges;
    /**
     * Find connected components using DFS
     */
    private findConnectedComponents;
    /**
     * Depth-first search for connected components
     */
    private dfs;
    /**
     * Group vertices by partition
     */
    private groupVerticesByPartition;
    /**
     * Infer geometric type from vertex count
     */
    private inferGeometricType;
    /**
     * Create partition certificate
     */
    createPartitionCertificate(originalCertificate: ConsensusCertificate, partitionInfo: PartitionInfo): PartitionCertificate;
    /**
     * Generate decomposition proof
     */
    private generateDecompositionProof;
    /**
     * Generate unique certificate ID
     */
    private generateCertificateId;
    /**
     * Analyze partition impact on consensus
     */
    analyzePartitionImpact(partitionInfo: PartitionInfo): {
        consensusPossible: boolean;
        requiredAgreementPerPartition: number[];
        totalRequiredAgreement: number;
        impactAssessment: string;
    };
    /**
     * Validate partition detection results
     */
    validatePartitionDetection(partitionInfo: PartitionInfo): boolean;
}
