/**
 * Geometric Consensus Verification Engine
 *
 * Implements RFC XXXX geometric consensus with mathematical proof generation.
 * Uses Platonic/Archimedean solids for consensus thresholds.
 */

import { GeometricType, GeometricShape, getGeometricShape, calculateRequiredAgreement, isValidForConsensus, getConsensusKeyword } from './geometric-types.js';
import { BettiCalculator, Vertex, Edge, BettiNumbers } from './betti-numbers.js';

export interface DecisionVertex {
  id: string;
  name: string;
  agrees: boolean;
  justification?: string;
  weight?: number;  // Optional weight for weighted consensus
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
export class GeometricConsensus {
  private bettiCalculator: BettiCalculator;

  constructor() {
    this.bettiCalculator = new BettiCalculator();
  }

  /**
   * MUST (Local) - Tetrahedron 4/4 unanimous consensus
   */
  mustLocal(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.TETRAHEDRON,
      'MUST (Local) - Unanimous consensus required'
    );
  }

  /**
   * SHOULD (Local) - Octahedron 5/6 strong consensus
   */
  shouldLocal(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.OCTAHEDRON,
      'SHOULD (Local) - Strong consensus preferred'
    );
  }

  /**
   * MAY (Local) - Cube 4/8 majority consensus
   */
  mayLocal(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.CUBE,
      'MAY (Local) - Majority consensus sufficient'
    );
  }

  /**
   * MUST (Federation) - 5-cell 5/5 unanimous consensus
   */
  mustFederation(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.FIVE_CELL,
      'MUST (Federation) - Unanimous federation consensus required'
    );
  }

  /**
   * SHOULD (Federation) - 24-cell 20/24 strong consensus
   */
  shouldFederation(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.TWENTY_FOUR_CELL,
      'SHOULD (Federation) - Strong federation consensus preferred'
    );
  }

  /**
   * MAY (Federation) - 8-cell 8/16 majority consensus
   */
  mayFederation(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.EIGHT_CELL,
      'MAY (Federation) - Majority federation consensus sufficient'
    );
  }

  /**
   * MUST (Global) - Truncated Tetrahedron 12/12 unanimous consensus
   */
  mustGlobal(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.TRUNCATED_TETRAHEDRON,
      'MUST (Global) - Unanimous global consensus required'
    );
  }

  /**
   * SHOULD (Global) - Cuboctahedron 10/12 strong consensus
   */
  shouldGlobal(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.CUBOCTAHEDRON,
      'SHOULD (Global) - Strong global consensus preferred'
    );
  }

  /**
   * MAY (Global) - Truncated Cube 12/24 majority consensus
   */
  mayGlobal(criteria: DecisionVertex[]): ConsensusResult {
    return this.verifyConsensus(
      criteria,
      GeometricType.TRUNCATED_CUBE,
      'MAY (Global) - Majority global consensus sufficient'
    );
  }

  /**
   * Generic consensus verification with custom geometric type
   */
  verifyConsensus(
    criteria: DecisionVertex[],
    geometricType: GeometricType,
    description: string
  ): ConsensusResult {
    try {
      const shape = getGeometricShape(geometricType);
      const certificate = this.createConsensusCertificate(criteria, shape, description);

      const success = certificate.valid;
      const message = success
        ? `Consensus achieved: ${certificate.agreesCount}/${criteria.length} agree (${(certificate.thresholdPercentage * 100).toFixed(1)}%)`
        : `Consensus failed: ${certificate.agreesCount}/${criteria.length} agree, need ${certificate.requiredCount} (${(certificate.thresholdPercentage * 100).toFixed(1)}%)`;

      return {
        certificate,
        success,
        message
      };
    } catch (error) {
      return {
        certificate: this.createErrorCertificate(criteria, geometricType, error as Error),
        success: false,
        message: `Consensus verification failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Create consensus certificate with mathematical proof
   */
  private createConsensusCertificate(
    criteria: DecisionVertex[],
    shape: GeometricShape,
    _description: string
  ): ConsensusCertificate {
    const agreesCount = criteria.filter(v => v.agrees).length;
    const requiredCount = calculateRequiredAgreement(shape);
    const thresholdPercentage = shape.threshold;
    const valid = isValidForConsensus(shape, agreesCount);

    // Calculate Betti numbers for partition detection
    const vertices = this.convertToVertices(criteria);
    const edges = this.buildConsensusEdges(criteria);
    const bettiNumbers = this.bettiCalculator.calculateBettiNumbers(vertices, edges);

    // Check for partitions
    const isPartitioned = this.bettiCalculator.detectPartition(bettiNumbers);
    const partitionCount = this.bettiCalculator.countPartitions(bettiNumbers);

    const certificate: ConsensusCertificate = {
      certificateId: this.generateCertificateId(),
      geometricType: shape.type,
      shape,
      vertices: criteria,
      agreesCount,
      requiredCount,
      thresholdPercentage,
      valid,
      proof: this.generateMathematicalProof(shape, agreesCount, requiredCount, valid),
      timestamp: new Date().toISOString(),
      bettiNumbers,
      partitionInfo: {
        isPartitioned,
        partitionCount
      }
    };

    return certificate;
  }

  /**
   * Convert decision vertices to topological vertices
   */
  private convertToVertices(criteria: DecisionVertex[]): Vertex[] {
    return criteria.map(v => ({
      id: v.id,
      name: v.name,
      connected: new Set<string>()  // Will be filled by edge building
    }));
  }

  /**
   * Build consensus edges based on agreement relationships
   *
   * For consensus, we connect vertices that agree with each other
   */
  private buildConsensusEdges(criteria: DecisionVertex[]): Edge[] {
    const edges: Edge[] = [];

    for (let i = 0; i < criteria.length; i++) {
      for (let j = i + 1; j < criteria.length; j++) {
        const v1 = criteria[i];
        const v2 = criteria[j];

        // Connect vertices that agree (both agree or both disagree)
        if (v1.agrees === v2.agrees) {
          edges.push({
            id: `consensus-edge-${i}-${j}`,
            from: v1.id,
            to: v2.id
          });
        }
      }
    }

    return edges;
  }

  /**
   * Generate mathematical proof for consensus
   */
  private generateMathematicalProof(
    shape: GeometricShape,
    agreesCount: number,
    requiredCount: number,
    valid: boolean
  ): string {
    const keyword = getConsensusKeyword(shape);
    const threshold = (shape.threshold * 100).toFixed(1);

    const proof = `
Mathematical Proof for ${keyword} Consensus:

Given:
- Geometric Type: ${shape.name} (${shape.type})
- Vertices: ${shape.vertices}
- Threshold: ${threshold}%
- Required Agreement: ${requiredCount}/${shape.vertices}
- Actual Agreement: ${agreesCount}/${shape.vertices}

Verification:
1. Threshold Check: ${agreesCount} ≥ ${requiredCount} = ${agreesCount >= requiredCount}
2. Geometric Constraint: ${shape.name} requires ${threshold}% agreement
3. Algebraic Verification: (${agreesCount}/${shape.vertices}) ≥ ${shape.threshold} = ${(agreesCount / shape.vertices).toFixed(3)} ≥ ${shape.threshold} = ${valid}

Conclusion: ${valid ? 'CONSENSUS ACHIEVED' : 'CONSENSUS FAILED'}

Geometric Properties:
- Schläfli Symbol: ${shape.schlaefli || 'N/A'}
- Dimension: ${shape.dimension}D
- Context: ${shape.context}
- Dual: ${shape.dual || 'Self-dual'}

This proof is mathematically verifiable and follows RFC XXXX specifications.
    `.trim();

    return proof;
  }

  /**
   * Generate unique certificate ID
   */
  private generateCertificateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `cert-${timestamp}-${random}`;
  }

  /**
   * Create error certificate for failed consensus
   */
  private createErrorCertificate(
    criteria: DecisionVertex[],
    geometricType: GeometricType,
    error: Error
  ): ConsensusCertificate {
    return {
      certificateId: this.generateCertificateId(),
      geometricType,
      shape: getGeometricShape(geometricType),
      vertices: criteria,
      agreesCount: 0,
      requiredCount: 0,
      thresholdPercentage: 0,
      valid: false,
      proof: `Error in consensus verification: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Verify consensus with partition awareness
   */
  async verifyConsensusWithPartitionDetection(
    criteria: DecisionVertex[],
    expectedType: GeometricType
  ): Promise<ConsensusResult> {
    const result = this.verifyConsensus(criteria, expectedType, 'Partition-aware consensus');

    if (result.certificate.partitionInfo?.isPartitioned) {
      // Handle partitioned consensus
      return this.handlePartitionedConsensus(result, criteria, expectedType);
    }

    return result;
  }

  /**
   * Handle consensus in partitioned network
   */
  private handlePartitionedConsensus(
    result: ConsensusResult,
    _criteria: DecisionVertex[],
    _expectedType: GeometricType
  ): ConsensusResult {
    const partitionCount = result.certificate.partitionInfo?.partitionCount || 1;

    // For partitioned networks, we need to verify consensus within each partition
    // This is a simplified implementation - full implementation would require
    // actual partition detection and separate consensus verification

    const modifiedResult: ConsensusResult = {
      ...result,
      message: `Partitioned consensus: ${result.message} (${partitionCount} partitions detected)`,
      certificate: {
        ...result.certificate,
        proof: result.certificate.proof + `

PARTITION DETECTION:
- Network is partitioned into ${partitionCount} components
- Consensus verification within partitions required
- This certificate represents partitioned consensus state
        `.trim()
      }
    };

    return modifiedResult;
  }

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
  } {
    const totalCertificates = certificates.length;
    const successfulConsensus = certificates.filter(c => c.valid).length;
    const failedConsensus = totalCertificates - successfulConsensus;
    const averageAgreement = certificates.reduce((sum, c) => sum + (c.agreesCount / c.vertices.length), 0) / totalCertificates;
    const partitionCount = certificates.filter(c => c.partitionInfo?.isPartitioned).length;

    const geometricTypeDistribution: Record<string, number> = {};
    certificates.forEach(c => {
      geometricTypeDistribution[c.geometricType] = (geometricTypeDistribution[c.geometricType] || 0) + 1;
    });

    return {
      totalCertificates,
      successfulConsensus,
      failedConsensus,
      averageAgreement,
      partitionCount,
      geometricTypeDistribution
    };
  }

  /**
   * Validate certificate integrity
   */
  validateCertificate(certificate: ConsensusCertificate): boolean {
    try {
      // Check basic properties
      if (!certificate.certificateId || !certificate.geometricType || !certificate.vertices) {
        return false;
      }

      // Verify agreement count
      const actualAgrees = certificate.vertices.filter(v => v.agrees).length;
      if (actualAgrees !== certificate.agreesCount) {
        return false;
      }

      // Verify required count calculation
      const expectedRequired = calculateRequiredAgreement(certificate.shape);
      if (expectedRequired !== certificate.requiredCount) {
        return false;
      }

      // Verify validity calculation
      const expectedValid = isValidForConsensus(certificate.shape, certificate.agreesCount);
      if (expectedValid !== certificate.valid) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
