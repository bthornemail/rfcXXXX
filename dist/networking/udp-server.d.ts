/**
 * UDP Server for Geometric Consensus
 *
 * Implements simple UDP message passing for distributed geometric consensus.
 * Used as proof of concept for RFC XXXX networking requirements.
 */
import { GeometricMessage, ConsensusProposal, ConsensusVote } from './geometric-protocol.js';
import { GeometricType } from '../phase1-geometric-consensus/geometric-types.js';
export interface UDPServerConfig {
    port: number;
    host: string;
    maxMessageSize: number;
    timeout: number;
    retryAttempts: number;
}
export interface NetworkMessage {
    type: 'consensus_proposal' | 'consensus_vote' | 'geometric_message' | 'heartbeat' | 'topology_update';
    data: any;
    timestamp: string;
    from: string;
    to?: string;
}
export interface ConsensusState {
    proposals: Map<string, ConsensusProposal>;
    votes: Map<string, ConsensusVote[]>;
    participants: Set<string>;
    networkTopology: any;
}
/**
 * UDP Geometric Server
 *
 * Handles UDP communication for geometric consensus protocols.
 * Implements basic message passing and consensus coordination.
 */
export declare class UDPGeometricServer {
    private socket;
    private config;
    private protocol;
    private consensusState;
    private messageHandlers;
    private isRunning;
    private nodeId;
    constructor(config: UDPServerConfig);
    /**
     * Start the UDP server
     */
    start(): Promise<void>;
    /**
     * Stop the UDP server
     */
    stop(): Promise<void>;
    /**
     * Broadcast a geometric message to all participants
     */
    broadcast(message: GeometricMessage): void;
    /**
     * Send a consensus proposal
     */
    sendConsensusProposal(geometricType: GeometricType, decision: string, justification: string, participants: string[]): ConsensusProposal;
    /**
     * Vote on a consensus proposal
     */
    voteOnProposal(proposalId: string, agrees: boolean, justification?: string): ConsensusVote;
    /**
     * Register message handler
     */
    onMessage(type: string, handler: (message: NetworkMessage) => void): void;
    /**
     * Register consensus proposal handler
     */
    onConsensusProposal(handler: (proposal: ConsensusProposal) => void): void;
    /**
     * Register consensus vote handler
     */
    onConsensusVote(handler: (vote: ConsensusVote) => void): void;
    /**
     * Register geometric message handler
     */
    onGeometricMessage(handler: (message: GeometricMessage) => void): void;
    /**
     * Add participant to network
     */
    addParticipant(participantId: string): void;
    /**
     * Remove participant from network
     */
    removeParticipant(participantId: string): void;
    /**
     * Get consensus state
     */
    getConsensusState(): ConsensusState;
    /**
     * Get node ID
     */
    getNodeId(): string;
    /**
     * Check if server is running
     */
    isServerRunning(): boolean;
    /**
     * Setup socket event handlers
     */
    private setupSocketHandlers;
    /**
     * Handle incoming message
     */
    private handleMessage;
    /**
     * Handle consensus proposal
     */
    private handleConsensusProposal;
    /**
     * Handle consensus vote
     */
    private handleConsensusVote;
    /**
     * Handle geometric message
     */
    private handleGeometricMessage;
    /**
     * Handle heartbeat
     */
    private handleHeartbeat;
    /**
     * Broadcast message to all participants
     */
    private broadcastToParticipants;
    /**
     * Start heartbeat mechanism
     */
    private startHeartbeat;
    /**
     * Validate network message
     */
    private validateNetworkMessage;
    /**
     * Generate unique node ID
     */
    private generateNodeId;
    /**
     * Send message to specific participant
     */
    sendToParticipant(participantId: string, message: NetworkMessage): void;
    /**
     * Get participant list
     */
    getParticipants(): string[];
    /**
     * Get consensus statistics
     */
    getConsensusStatistics(): {
        totalProposals: number;
        achievedConsensus: number;
        failedConsensus: number;
        pendingProposals: number;
        totalVotes: number;
        activeParticipants: number;
    };
}
