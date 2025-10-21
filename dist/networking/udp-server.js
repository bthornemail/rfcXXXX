/**
 * UDP Server for Geometric Consensus
 *
 * Implements simple UDP message passing for distributed geometric consensus.
 * Used as proof of concept for RFC XXXX networking requirements.
 */
import { createSocket } from 'dgram';
import { GeometricProtocol } from './geometric-protocol.js';
/**
 * UDP Geometric Server
 *
 * Handles UDP communication for geometric consensus protocols.
 * Implements basic message passing and consensus coordination.
 */
export class UDPGeometricServer {
    socket;
    config;
    protocol;
    consensusState;
    messageHandlers;
    isRunning;
    nodeId;
    constructor(config) {
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
    start() {
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
    stop() {
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
    broadcast(message) {
        const networkMessage = {
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
    sendConsensusProposal(geometricType, decision, justification, participants) {
        const proposal = this.protocol.createConsensusProposal(this.nodeId, geometricType, participants, decision, justification);
        // Store proposal
        this.consensusState.proposals.set(proposal.proposalId, proposal);
        this.consensusState.votes.set(proposal.proposalId, []);
        // Broadcast proposal
        const networkMessage = {
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
    voteOnProposal(proposalId, agrees, justification) {
        const vote = this.protocol.createConsensusVote(proposalId, this.nodeId, agrees, justification);
        // Store vote
        const votes = this.consensusState.votes.get(proposalId) || [];
        votes.push(vote);
        this.consensusState.votes.set(proposalId, votes);
        // Broadcast vote
        const networkMessage = {
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
    onMessage(type, handler) {
        this.messageHandlers.set(type, handler);
    }
    /**
     * Register consensus proposal handler
     */
    onConsensusProposal(handler) {
        this.onMessage('consensus_proposal', (message) => {
            handler(message.data);
        });
    }
    /**
     * Register consensus vote handler
     */
    onConsensusVote(handler) {
        this.onMessage('consensus_vote', (message) => {
            handler(message.data);
        });
    }
    /**
     * Register geometric message handler
     */
    onGeometricMessage(handler) {
        this.onMessage('geometric_message', (message) => {
            handler(message.data);
        });
    }
    /**
     * Add participant to network
     */
    addParticipant(participantId) {
        this.consensusState.participants.add(participantId);
        console.log(`Added participant: ${participantId}`);
    }
    /**
     * Remove participant from network
     */
    removeParticipant(participantId) {
        this.consensusState.participants.delete(participantId);
        console.log(`Removed participant: ${participantId}`);
    }
    /**
     * Get consensus state
     */
    getConsensusState() {
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
    getNodeId() {
        return this.nodeId;
    }
    /**
     * Check if server is running
     */
    isServerRunning() {
        return this.isRunning;
    }
    /**
     * Setup socket event handlers
     */
    setupSocketHandlers() {
        this.socket.on('message', (buffer, remote) => {
            try {
                const message = JSON.parse(buffer.toString());
                // Validate message
                if (!this.validateNetworkMessage(message)) {
                    console.warn('Invalid message received:', message);
                    return;
                }
                // Handle message
                this.handleMessage(message, remote);
            }
            catch (error) {
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
    handleMessage(message, remote) {
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
            }
            catch (error) {
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
    handleConsensusProposal(proposal) {
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
    handleConsensusVote(vote) {
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
            }
            else if (result.status === 'failed') {
                console.log(`Consensus failed for proposal: ${vote.proposalId}`);
                proposal.status = 'failed';
            }
        }
    }
    /**
     * Handle geometric message
     */
    handleGeometricMessage(message) {
        // Validate geometric message
        if (this.protocol.validateMessage(message)) {
            console.log(`Valid geometric message: ${message.id}`);
        }
        else {
            console.warn(`Invalid geometric message: ${message.id}`);
        }
    }
    /**
     * Handle heartbeat
     */
    handleHeartbeat(message) {
        // Update participant status
        this.consensusState.participants.add(message.from);
    }
    /**
     * Broadcast message to all participants
     */
    broadcastToParticipants(message) {
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
    startHeartbeat() {
        setInterval(() => {
            if (this.isRunning) {
                const heartbeat = {
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
    validateNetworkMessage(message) {
        return !!(message.type &&
            message.data &&
            message.timestamp &&
            message.from);
    }
    /**
     * Generate unique node ID
     */
    generateNodeId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `node-${timestamp}-${random}`;
    }
    /**
     * Send message to specific participant
     */
    sendToParticipant(participantId, message) {
        // For demo purposes, this is a placeholder
        // In a real implementation, this would use participant address mapping
        console.log(`Sending message to ${participantId}:`, message.type);
    }
    /**
     * Get participant list
     */
    getParticipants() {
        return Array.from(this.consensusState.participants);
    }
    /**
     * Get consensus statistics
     */
    getConsensusStatistics() {
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
//# sourceMappingURL=udp-server.js.map