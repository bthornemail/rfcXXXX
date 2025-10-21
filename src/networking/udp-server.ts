/**
 * UDP Server for Geometric Consensus
 *
 * Implements simple UDP message passing for distributed geometric consensus.
 * Used as proof of concept for RFC XXXX networking requirements.
 */

import { createSocket, Socket } from 'dgram';
import { GeometricMessage, ConsensusProposal, ConsensusVote, GeometricProtocol } from './geometric-protocol.js';
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
export class UDPGeometricServer {
  private socket: Socket;
  private config: UDPServerConfig;
  private protocol: GeometricProtocol;
  private consensusState: ConsensusState;
  private messageHandlers: Map<string, (message: NetworkMessage) => void>;
  private isRunning: boolean;
  private nodeId: string;

  constructor(config: UDPServerConfig) {
    this.config = config;
    this.protocol = new GeometricProtocol();
    this.consensusState = {
      proposals: new Map(),
      votes: new Map(),
      participants: new Set(),
      networkTopology: null
    };
    this.messageHandlers = new Map();
    this.isRunning = false;
    this.nodeId = this.generateNodeId();

    this.socket = createSocket('udp4');
    this.setupSocketHandlers();
  }

  /**
   * Start the UDP server
   */
  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.bind(this.config.port, this.config.host, () => {
        this.isRunning = true;
        console.log(`UDP Geometric Server started on ${this.config.host}:${this.config.port}`);
        console.log(`Node ID: ${this.nodeId}`);

        // Start heartbeat
        this.startHeartbeat();

        resolve();
      });

      this.socket.on('error', (error) => {
        console.error('UDP Server error:', error);
        reject(error);
      });
    });
  }

  /**
   * Stop the UDP server
   */
  stop(): Promise<void> {
    return new Promise((resolve) => {
      this.isRunning = false;
      this.socket.close(() => {
        console.log('UDP Geometric Server stopped');
        resolve();
      });
    });
  }

  /**
   * Broadcast a geometric message to all participants
   */
  broadcast(message: GeometricMessage): void {
    const networkMessage: NetworkMessage = {
      type: 'geometric_message',
      data: message,
      timestamp: new Date().toISOString(),
      from: this.nodeId
    };

    this.broadcastToParticipants(networkMessage);
  }

  /**
   * Send a consensus proposal
   */
  sendConsensusProposal(
    geometricType: GeometricType,
    decision: string,
    justification: string,
    participants: string[]
  ): ConsensusProposal {
    const proposal = this.protocol.createConsensusProposal(
      this.nodeId,
      geometricType,
      participants,
      decision,
      justification
    );

    // Store proposal
    this.consensusState.proposals.set(proposal.proposalId, proposal);
    this.consensusState.votes.set(proposal.proposalId, []);

    // Broadcast proposal
    const networkMessage: NetworkMessage = {
      type: 'consensus_proposal',
      data: proposal,
      timestamp: new Date().toISOString(),
      from: this.nodeId
    };

    this.broadcastToParticipants(networkMessage);

    return proposal;
  }

  /**
   * Vote on a consensus proposal
   */
  voteOnProposal(
    proposalId: string,
    agrees: boolean,
    justification?: string
  ): ConsensusVote {
    const vote = this.protocol.createConsensusVote(
      proposalId,
      this.nodeId,
      agrees,
      justification
    );

    // Store vote
    const votes = this.consensusState.votes.get(proposalId) || [];
    votes.push(vote);
    this.consensusState.votes.set(proposalId, votes);

    // Broadcast vote
    const networkMessage: NetworkMessage = {
      type: 'consensus_vote',
      data: vote,
      timestamp: new Date().toISOString(),
      from: this.nodeId
    };

    this.broadcastToParticipants(networkMessage);

    return vote;
  }

  /**
   * Register message handler
   */
  onMessage(type: string, handler: (message: NetworkMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Register consensus proposal handler
   */
  onConsensusProposal(handler: (proposal: ConsensusProposal) => void): void {
    this.onMessage('consensus_proposal', (message) => {
      handler(message.data);
    });
  }

  /**
   * Register consensus vote handler
   */
  onConsensusVote(handler: (vote: ConsensusVote) => void): void {
    this.onMessage('consensus_vote', (message) => {
      handler(message.data);
    });
  }

  /**
   * Register geometric message handler
   */
  onGeometricMessage(handler: (message: GeometricMessage) => void): void {
    this.onMessage('geometric_message', (message) => {
      handler(message.data);
    });
  }

  /**
   * Add participant to network
   */
  addParticipant(participantId: string): void {
    this.consensusState.participants.add(participantId);
    console.log(`Added participant: ${participantId}`);
  }

  /**
   * Remove participant from network
   */
  removeParticipant(participantId: string): void {
    this.consensusState.participants.delete(participantId);
    console.log(`Removed participant: ${participantId}`);
  }

  /**
   * Get consensus state
   */
  getConsensusState(): ConsensusState {
    return {
      proposals: new Map(this.consensusState.proposals),
      votes: new Map(this.consensusState.votes),
      participants: new Set(this.consensusState.participants),
      networkTopology: this.consensusState.networkTopology
    };
  }

  /**
   * Get node ID
   */
  getNodeId(): string {
    return this.nodeId;
  }

  /**
   * Check if server is running
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Setup socket event handlers
   */
  private setupSocketHandlers(): void {
    this.socket.on('message', (buffer, remote) => {
      try {
        const message = JSON.parse(buffer.toString()) as NetworkMessage;

        // Validate message
        if (!this.validateNetworkMessage(message)) {
          console.warn('Invalid message received:', message);
          return;
        }

        // Handle message
        this.handleMessage(message, remote);

      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Handle incoming message
   */
  private handleMessage(message: NetworkMessage, remote: any): void {
    console.log(`Received ${message.type} from ${remote.address}:${remote.port}`);

    // Update participant list
    if (message.from !== this.nodeId) {
      this.consensusState.participants.add(message.from);
    }

    // Route to appropriate handler
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      try {
        handler(message);
      } catch (error) {
        console.error(`Error handling ${message.type}:`, error);
      }
    }

    // Handle specific message types
    switch (message.type) {
      case 'consensus_proposal':
        this.handleConsensusProposal(message.data);
        break;
      case 'consensus_vote':
        this.handleConsensusVote(message.data);
        break;
      case 'geometric_message':
        this.handleGeometricMessage(message.data);
        break;
      case 'heartbeat':
        this.handleHeartbeat(message);
        break;
    }
  }

  /**
   * Handle consensus proposal
   */
  private handleConsensusProposal(proposal: ConsensusProposal): void {
    // Store proposal if not already stored
    if (!this.consensusState.proposals.has(proposal.proposalId)) {
      this.consensusState.proposals.set(proposal.proposalId, proposal);
      this.consensusState.votes.set(proposal.proposalId, []);
      console.log(`Stored consensus proposal: ${proposal.proposalId}`);
    }
  }

  /**
   * Handle consensus vote
   */
  private handleConsensusVote(vote: ConsensusVote): void {
    // Store vote
    const votes = this.consensusState.votes.get(vote.proposalId) || [];
    votes.push(vote);
    this.consensusState.votes.set(vote.proposalId, votes);

    // Check if consensus is achieved
    const proposal = this.consensusState.proposals.get(vote.proposalId);
    if (proposal) {
      const result = this.protocol.processConsensusProposal(proposal, votes);

      if (result.status === 'achieved') {
        console.log(`Consensus achieved for proposal: ${vote.proposalId}`);
        proposal.status = 'achieved';
      } else if (result.status === 'failed') {
        console.log(`Consensus failed for proposal: ${vote.proposalId}`);
        proposal.status = 'failed';
      }
    }
  }

  /**
   * Handle geometric message
   */
  private handleGeometricMessage(message: GeometricMessage): void {
    // Validate geometric message
    if (this.protocol.validateMessage(message)) {
      console.log(`Valid geometric message: ${message.id}`);
    } else {
      console.warn(`Invalid geometric message: ${message.id}`);
    }
  }

  /**
   * Handle heartbeat
   */
  private handleHeartbeat(message: NetworkMessage): void {
    // Update participant status
    this.consensusState.participants.add(message.from);
  }

  /**
   * Broadcast message to all participants
   */
  private broadcastToParticipants(message: NetworkMessage): void {
    const messageBuffer = Buffer.from(JSON.stringify(message));

    // For demo purposes, broadcast to localhost on different ports
    // In a real implementation, this would use actual participant addresses
    const broadcastPorts = [3001, 3002, 3003, 3004];

    broadcastPorts.forEach(port => {
      if (port !== this.config.port) { // Don't send to self
        this.socket.send(messageBuffer, port, 'localhost', (error) => {
          if (error) {
            console.error(`Error broadcasting to port ${port}:`, error);
          }
        });
      }
    });
  }

  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    setInterval(() => {
      if (this.isRunning) {
        const heartbeat: NetworkMessage = {
          type: 'heartbeat',
          data: { nodeId: this.nodeId, status: 'active' },
          timestamp: new Date().toISOString(),
          from: this.nodeId
        };

        this.broadcastToParticipants(heartbeat);
      }
    }, 5000); // Send heartbeat every 5 seconds
  }

  /**
   * Validate network message
   */
  private validateNetworkMessage(message: NetworkMessage): boolean {
    return !!(
      message.type &&
      message.data &&
      message.timestamp &&
      message.from
    );
  }

  /**
   * Generate unique node ID
   */
  private generateNodeId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `node-${timestamp}-${random}`;
  }

  /**
   * Send message to specific participant
   */
  sendToParticipant(participantId: string, message: NetworkMessage): void {
    // For demo purposes, this is a placeholder
    // In a real implementation, this would use participant address mapping
    console.log(`Sending message to ${participantId}:`, message.type);
  }

  /**
   * Get participant list
   */
  getParticipants(): string[] {
    return Array.from(this.consensusState.participants);
  }

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
  } {
    const proposals = Array.from(this.consensusState.proposals.values());
    const votes = Array.from(this.consensusState.votes.values()).flat();

    return {
      totalProposals: proposals.length,
      achievedConsensus: proposals.filter(p => p.status === 'achieved').length,
      failedConsensus: proposals.filter(p => p.status === 'failed').length,
      pendingProposals: proposals.filter(p => p.status === 'pending').length,
      totalVotes: votes.length,
      activeParticipants: this.consensusState.participants.size
    };
  }
}
