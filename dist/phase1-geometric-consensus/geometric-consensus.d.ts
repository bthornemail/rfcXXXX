/**
 * Geometric Consensus Verification Engine
 *
 * Implements RFC XXXX geometric consensus with mathematical proof generation.
 * Uses Platonic/Archimedean solids for consensus thresholds.
 */
import { GeometricType, GeometricShape } from './geometric-types.js';
import { BettiNumbers } from './betti-numbers.js';
export interface DecisionVertex {
    id: string;
    name: string;
    agrees: boolean;
    justification?: string;
    weight?: number;
}
export interface ConsensusCertificate {
    certificateId: string;
    geometricType: GeometricType;
    shape: GeometricShape;
    vertices: DecisionVertex[];
    agreesCount: number;
    requiredCount: number;
    thresholdPercentage: number;
    valid: boolean;
    proof: string;
    timestamp: string;
    bettiNumbers?: BettiNumbers;
    partitionInfo?: {
        isPartitioned: boolean;
        partitionCount: number;
    };
}
export interface ConsensusResult {
    certificate: ConsensusCertificate;
    success: boolean;
    message: string;
}
/**
 * Core Geometric Consensus Engine
 *
 * Implements algebraic verification: (agrees/vertices ≥ threshold) ∧ geometric_constraint → valid
 */
export declare class GeometricConsensus {
    private bettiCalculator;
    constructor();
    /**
     * MUST (Local) - Tetrahedron 4/4 unanimous consensus
     */
    mustLocal(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * SHOULD (Local) - Octahedron 5/6 strong consensus
     */
    shouldLocal(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * MAY (Local) - Cube 4/8 majority consensus
     */
    mayLocal(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * MUST (Federation) - 5-cell 5/5 unanimous consensus
     */
    mustFederation(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * SHOULD (Federation) - 24-cell 20/24 strong consensus
     */
    shouldFederation(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * MAY (Federation) - 8-cell 8/16 majority consensus
     */
    mayFederation(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * MUST (Global) - Truncated Tetrahedron 12/12 unanimous consensus
     */
    mustGlobal(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * SHOULD (Global) - Cuboctahedron 10/12 strong consensus
     */
    shouldGlobal(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * MAY (Global) - Truncated Cube 12/24 majority consensus
     */
    mayGlobal(criteria: DecisionVertex[]): ConsensusResult;
    /**
     * Generic consensus verification with custom geometric type
     */
    verifyConsensus(criteria: DecisionVertex[], geometricType: GeometricType, description: string): ConsensusResult;
    /**
     * Create consensus certificate with mathematical proof
     */
    private createConsensusCertificate;
    /**
     * Convert decision vertices to topological vertices
     */
    private convertToVertices;
    /**
     * Build consensus edges based on agreement relationships
     *
     * For consensus, we connect vertices that agree with each other
     */
    private buildConsensusEdges;
    /**
     * Generate mathematical proof for consensus
     */
    private generateMathematicalProof;
    /**
     * Generate unique certificate ID
     */
    private generateCertificateId;
    /**
     * Create error certificate for failed consensus
     */
    private createErrorCertificate;
    /**
     * Verify consensus with partition awareness
     */
    verifyConsensusWithPartitionDetection(criteria: DecisionVertex[], expectedType: GeometricType): Promise<ConsensusResult>;
    /**
     * Handle consensus in partitioned network
     */
    private handlePartitionedConsensus;
    /**
     * Get consensus statistics
     */
    getConsensusStatistics(certificates: ConsensusCertificate[]): {
        totalCertificates: number;
        successfulConsensus: number;
        failedConsensus: number;
        averageAgreement: number;
        partitionCount: number;
        geometricTypeDistribution: Record<string, number>;
    };
    /**
     * Validate certificate integrity
     */
    validateCertificate(certificate: ConsensusCertificate): boolean;
}
