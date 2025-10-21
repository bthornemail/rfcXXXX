/**
 * Dual-Based Partition Recovery Mechanisms
 *
 * Implements RFC XXXX Appendix I dual recovery using geometric duality
 * for O(1) recovery vs O(v²) leader election.
 */
import { GeometricType } from './geometric-types.js';
import { ConsensusCertificate } from './geometric-consensus.js';
export interface DualRecoveryResult {
    success: boolean;
    recoveredCertificate: ConsensusCertificate;
    recoveryProof: string;
    dualMapping: {
        original: GeometricType;
        dual: GeometricType;
        thresholdMapping: number;
    };
    timestamp: string;
}
export interface PartitionRecoveryPlan {
    planId: string;
    partitionCertificates: ConsensusCertificate[];
    originalType: GeometricType;
    recoveryStrategy: 'dual' | 'hierarchical' | 'federated';
    estimatedRecoveryTime: number;
    recoverySteps: RecoveryStep[];
}
export interface RecoveryStep {
    stepId: string;
    description: string;
    geometricType: GeometricType;
    requiredParticipants: number;
    expectedOutcome: string;
    dependencies: string[];
}
/**
 * Dual Partition Recovery Engine
 *
 * Uses geometric duality for O(1) recovery vs O(v²) leader election.
 * Key insight: Dual polyhedra preserve threshold semantics through
 * vertex-face exchange, enabling automatic isomorphism.
 */
export declare class DualPartitionRecovery {
    /**
     * Recover unified consensus from partition states using duality
     *
     * Algorithm:
     * 1. Collect consensus certificates from all partitions
     * 2. Apply dual mapping to unify threshold semantics
     * 3. Verify geometric constraints are preserved
     * 4. Generate unified consensus certificate
     */
    recoverFromPartition(partitionCertificates: ConsensusCertificate[], originalType: GeometricType): DualRecoveryResult;
    /**
     * Map threshold via dual geometric transformation
     *
     * Key insight: Dual polyhedra preserve consensus semantics
     * through vertex-face exchange, enabling threshold mapping
     */
    mapThresholdViaDual(partitionThreshold: number, original: GeometricType, dual: GeometricType): number;
    /**
     * Create partition recovery plan
     */
    createRecoveryPlan(partitionCertificates: ConsensusCertificate[], originalType: GeometricType): PartitionRecoveryPlan;
    /**
     * Validate partition certificates
     */
    private validatePartitionCertificates;
    /**
     * Apply dual mapping to unify threshold semantics
     */
    private applyDualMapping;
    /**
     * Calculate threshold mapping between dual shapes
     */
    private calculateThresholdMapping;
    /**
     * Generate recovery proof
     */
    private generateRecoveryProof;
    /**
     * Create recovered certificate
     */
    private createRecoveredCertificate;
    /**
     * Create error certificate
     */
    private createErrorCertificate;
    /**
     * Determine recovery strategy
     */
    private determineRecoveryStrategy;
    /**
     * Generate recovery steps
     */
    private generateRecoverySteps;
    /**
     * Estimate recovery time
     */
    private estimateRecoveryTime;
    /**
     * Generate unique certificate ID
     */
    private generateCertificateId;
    /**
     * Generate unique plan ID
     */
    private generatePlanId;
    /**
     * Validate recovery result
     */
    validateRecoveryResult(result: DualRecoveryResult): boolean;
}
