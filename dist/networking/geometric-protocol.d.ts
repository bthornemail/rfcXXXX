/**
 * Geometric Protocol Message Format
 *
 * Implements RFC XXXX geometric message format for distributed consensus.
 * Includes topological metadata and geometric constraints.
 */
import { BettiNumbers } from '../phase1-geometric-consensus/betti-numbers.js';
import { GeometricType } from '../phase1-geometric-consensus/geometric-types.js';
export interface GeometricMessage {
    id: string;
    from: string;
    to: string;
    content: string;
    parents: string[];
    group: string;
    shape: string;
    geometricMetadata: {
        incidenceRelations: string[];
        topologicalProperties: BettiNumbers;
        geometricType: GeometricType;
        threshold: number;
        consensusLevel: 'local' | 'federation' | 'global';
    };
    timestamp: string;
    signature?: string;
}
export interface ConsensusProposal {
    proposalId: string;
    proposer: string;
    geometricType: GeometricType;
    participants: string[];
    decision: string;
    justification: string;
    requiredAgreement: number;
    currentAgreement: number;
    status: 'pending' | 'achieved' | 'failed' | 'timeout';
    timestamp: string;
    expirationTime: string;
}
export interface ConsensusVote {
    voteId: string;
    proposalId: string;
    voter: string;
    agrees: boolean;
    justification?: string;
    weight?: number;
    timestamp: string;
    signature?: string;
}
export interface NetworkTopology {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    bettiNumbers: BettiNumbers;
    isConnected: boolean;
    partitionCount: number;
}
export interface NetworkNode {
    id: string;
    address: string;
    port: number;
    capabilities: string[];
    status: 'active' | 'inactive' | 'partitioned';
    lastSeen: string;
    geometricPosition?: {
        x: number;
        y: number;
        z: number;
    };
}
export interface NetworkEdge {
    id: string;
    from: string;
    to: string;
    weight: number;
    latency: number;
    reliability: number;
    lastUsed: string;
}
/**
 * Geometric Protocol Message Handler
 *
 * Handles creation, validation, and processing of geometric protocol messages.
 */
export declare class GeometricProtocol {
    /**
     * Create a geometric consensus message
     */
    createConsensusMessage(from: string, to: string, content: string, geometricType: GeometricType, parents?: string[], group?: string): GeometricMessage;
    /**
     * Create a consensus proposal
     */
    createConsensusProposal(proposer: string, geometricType: GeometricType, participants: string[], decision: string, justification: string, expirationMinutes?: number): ConsensusProposal;
    /**
     * Create a consensus vote
     */
    createConsensusVote(proposalId: string, voter: string, agrees: boolean, justification?: string, weight?: number): ConsensusVote;
    /**
     * Validate geometric message
     */
    validateMessage(message: GeometricMessage): boolean;
    /**
     * Process consensus proposal
     */
    processConsensusProposal(proposal: ConsensusProposal, votes: ConsensusVote[]): {
        status: 'pending' | 'achieved' | 'failed' | 'timeout';
        agreementCount: number;
        requiredCount: number;
        threshold: number;
        validVotes: ConsensusVote[];
    };
    /**
     * Build network topology from nodes and edges
     */
    buildNetworkTopology(nodes: NetworkNode[], edges: NetworkEdge[]): NetworkTopology;
    /**
     * Calculate Betti numbers for network topology
     */
    private calculateNetworkBettiNumbers;
    /**
     * Build adjacency matrix
     */
    private buildAdjacencyMatrix;
    /**
     * Calculate connected components using DFS
     */
    private calculateConnectedComponents;
    /**
     * Depth-first search
     */
    private dfs;
    /**
     * Generate incidence relations for geometric type
     */
    private generateIncidenceRelations;
    /**
     * Get default topological properties for geometric type
     */
    private getDefaultTopologicalProperties;
    /**
     * Get threshold for geometric type
     */
    private getThresholdForType;
    /**
     * Get consensus level for geometric type
     */
    private getConsensusLevel;
    /**
     * Calculate required agreement for geometric type
     */
    private calculateRequiredAgreement;
    /**
     * Generate unique message ID
     */
    private generateMessageId;
    /**
     * Generate unique proposal ID
     */
    private generateProposalId;
    /**
     * Generate unique vote ID
     */
    private generateVoteId;
    /**
     * Serialize message to JSON
     */
    serializeMessage(message: GeometricMessage): string;
    /**
     * Deserialize message from JSON
     */
    deserializeMessage(json: string): GeometricMessage;
    /**
     * Create message signature (placeholder)
     */
    createSignature(message: GeometricMessage, _privateKey: string): string;
    /**
     * Verify message signature (placeholder)
     */
    verifySignature(_message: GeometricMessage, _signature: string, _publicKey: string): boolean;
}
