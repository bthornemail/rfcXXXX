/**
 * Geometric Protocol Message Format
 *
 * Implements RFC XXXX geometric message format for distributed consensus.
 * Includes topological metadata and geometric constraints.
 */
import { GeometricType } from '../phase1-geometric-consensus/geometric-types.js';
/**
 * Geometric Protocol Message Handler
 *
 * Handles creation, validation, and processing of geometric protocol messages.
 */
export class GeometricProtocol {
    /**
     * Create a geometric consensus message
     */
    createConsensusMessage(from, to, content, geometricType, parents = [], group = 'default') {
        const message = {
            id: this.generateMessageId(),
            from,
            to,
            content,
            parents,
            group,
            shape: geometricType,
            geometricMetadata: {
                incidenceRelations: this.generateIncidenceRelations(geometricType),
                topologicalProperties: this.getDefaultTopologicalProperties(geometricType),
                geometricType,
                threshold: this.getThresholdForType(geometricType),
                consensusLevel: this.getConsensusLevel(geometricType)
            },
            timestamp: new Date().toISOString()
        };
        return message;
    }
    /**
     * Create a consensus proposal
     */
    createConsensusProposal(proposer, geometricType, participants, decision, justification, expirationMinutes = 30) {
        const requiredAgreement = this.calculateRequiredAgreement(geometricType, participants.length);
        const expirationTime = new Date(Date.now() + expirationMinutes * 60 * 1000).toISOString();
        return {
            proposalId: this.generateProposalId(),
            proposer,
            geometricType,
            participants,
            decision,
            justification,
            requiredAgreement,
            currentAgreement: 0,
            status: 'pending',
            timestamp: new Date().toISOString(),
            expirationTime
        };
    }
    /**
     * Create a consensus vote
     */
    createConsensusVote(proposalId, voter, agrees, justification, weight = 1.0) {
        return {
            voteId: this.generateVoteId(),
            proposalId,
            voter,
            agrees,
            justification,
            weight,
            timestamp: new Date().toISOString()
        };
    }
    /**
     * Validate geometric message
     */
    validateMessage(message) {
        try {
            // Check required fields
            if (!message.id || !message.from || !message.to || !message.content) {
                return false;
            }
            // Validate geometric metadata
            const { geometricMetadata } = message;
            if (!geometricMetadata.geometricType ||
                !geometricMetadata.topologicalProperties ||
                geometricMetadata.threshold < 0 ||
                geometricMetadata.threshold > 1) {
                return false;
            }
            // Validate Betti numbers
            const { beta_0, beta_1, beta_2 } = geometricMetadata.topologicalProperties;
            if (beta_0 < 0 || beta_1 < 0 || beta_2 < 0) {
                return false;
            }
            // Validate timestamp
            const timestamp = new Date(message.timestamp);
            if (isNaN(timestamp.getTime())) {
                return false;
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Process consensus proposal
     */
    processConsensusProposal(proposal, votes) {
        // Check if proposal has expired
        const now = new Date();
        const expiration = new Date(proposal.expirationTime);
        if (now > expiration) {
            return {
                status: 'timeout',
                agreementCount: 0,
                requiredCount: proposal.requiredAgreement,
                threshold: this.getThresholdForType(proposal.geometricType),
                validVotes: []
            };
        }
        // Filter valid votes
        const validVotes = votes.filter(vote => vote.proposalId === proposal.proposalId &&
            proposal.participants.includes(vote.voter));
        // Count agreements
        const agreementCount = validVotes
            .filter(vote => vote.agrees)
            .reduce((sum, vote) => sum + (vote.weight || 1.0), 0);
        const requiredCount = proposal.requiredAgreement;
        const threshold = this.getThresholdForType(proposal.geometricType);
        // Determine status
        let status = 'pending';
        if (agreementCount >= requiredCount) {
            status = 'achieved';
        }
        else if (validVotes.length >= proposal.participants.length) {
            status = 'failed';
        }
        return {
            status,
            agreementCount,
            requiredCount,
            threshold,
            validVotes
        };
    }
    /**
     * Build network topology from nodes and edges
     */
    buildNetworkTopology(nodes, edges) {
        // Calculate Betti numbers for network topology
        const bettiNumbers = this.calculateNetworkBettiNumbers(nodes, edges);
        // Determine connectivity
        const isConnected = bettiNumbers.beta_0 === 1;
        const partitionCount = bettiNumbers.beta_0;
        return {
            nodes,
            edges,
            bettiNumbers,
            isConnected,
            partitionCount
        };
    }
    /**
     * Calculate Betti numbers for network topology
     */
    calculateNetworkBettiNumbers(nodes, edges) {
        // Convert to vertex/edge format for Betti calculation
        const vertices = nodes.map(node => ({
            id: node.id,
            name: node.id,
            connected: new Set()
        }));
        const networkEdges = edges.map(edge => ({
            id: edge.id,
            from: edge.from,
            to: edge.to
        }));
        // Build adjacency matrix
        const adjacency = this.buildAdjacencyMatrix(vertices, networkEdges);
        // Calculate connected components (β₀)
        const beta_0 = this.calculateConnectedComponents(vertices, adjacency);
        // Calculate cycles (β₁)
        const beta_1 = Math.max(0, edges.length - nodes.length + beta_0);
        // For network topology, β₂ is typically 0
        const beta_2 = 0;
        return { beta_0, beta_1, beta_2 };
    }
    /**
     * Build adjacency matrix
     */
    buildAdjacencyMatrix(vertices, edges) {
        const n = vertices.length;
        const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
        // Create vertex ID to index mapping
        const vertexIndex = new Map();
        vertices.forEach((v, i) => vertexIndex.set(v.id, i));
        // Fill adjacency matrix
        edges.forEach(edge => {
            const fromIndex = vertexIndex.get(edge.from);
            const toIndex = vertexIndex.get(edge.to);
            if (fromIndex !== undefined && toIndex !== undefined) {
                matrix[fromIndex][toIndex] = 1;
                matrix[toIndex][fromIndex] = 1; // Undirected graph
            }
        });
        return matrix;
    }
    /**
     * Calculate connected components using DFS
     */
    calculateConnectedComponents(vertices, adjacency) {
        const n = vertices.length;
        const visited = new Array(n).fill(false);
        let components = 0;
        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                this.dfs(i, adjacency, visited);
                components++;
            }
        }
        return components;
    }
    /**
     * Depth-first search
     */
    dfs(vertex, adjacency, visited) {
        visited[vertex] = true;
        for (let i = 0; i < adjacency[vertex].length; i++) {
            if (adjacency[vertex][i] === 1 && !visited[i]) {
                this.dfs(i, adjacency, visited);
            }
        }
    }
    /**
     * Generate incidence relations for geometric type
     */
    generateIncidenceRelations(geometricType) {
        // Generate incidence relations based on geometric type
        // This is a simplified implementation
        const relations = [];
        switch (geometricType) {
            case GeometricType.TETRAHEDRON:
                relations.push('vertex-face', 'edge-vertex', 'face-edge');
                break;
            case GeometricType.CUBE:
                relations.push('vertex-face', 'edge-vertex', 'face-edge', 'face-vertex');
                break;
            case GeometricType.OCTAHEDRON:
                relations.push('vertex-face', 'edge-vertex', 'face-edge');
                break;
            default:
                relations.push('vertex-face', 'edge-vertex');
        }
        return relations;
    }
    /**
     * Get default topological properties for geometric type
     */
    getDefaultTopologicalProperties(_geometricType) {
        // Default Betti numbers for connected geometric shapes
        return {
            beta_0: 1, // Connected
            beta_1: 0, // No cycles (for simple shapes)
            beta_2: 0 // No voids
        };
    }
    /**
     * Get threshold for geometric type
     */
    getThresholdForType(geometricType) {
        // Simplified threshold mapping
        const thresholds = {
            [GeometricType.POINT]: 0,
            [GeometricType.LINE]: 0,
            [GeometricType.TRIANGLE]: 0,
            [GeometricType.SQUARE]: 0,
            [GeometricType.TETRAHEDRON]: 1.0,
            [GeometricType.CUBE]: 0.5,
            [GeometricType.OCTAHEDRON]: 0.833,
            [GeometricType.DODECAHEDRON]: 0.6,
            [GeometricType.ICOSAHEDRON]: 0.75,
            [GeometricType.FIVE_CELL]: 1.0,
            [GeometricType.EIGHT_CELL]: 0.5,
            [GeometricType.SIXTEEN_CELL]: 0.75,
            [GeometricType.TWENTY_FOUR_CELL]: 0.833,
            [GeometricType.SIX_HUNDRED_CELL]: 0.6,
            [GeometricType.TRUNCATED_TETRAHEDRON]: 1.0,
            [GeometricType.CUBOCTAHEDRON]: 0.8,
            [GeometricType.TRUNCATED_CUBE]: 0.75,
            [GeometricType.TRUNCATED_OCTAHEDRON]: 0.75,
            [GeometricType.RHOMBICUBOCTAHEDRON]: 0.6,
            [GeometricType.TRUNCATED_CUBOCTAHEDRON]: 0.6,
            [GeometricType.SNUB_CUBE]: 0.5,
            [GeometricType.ICOSIDODECAHEDRON]: 0.8,
            [GeometricType.TRUNCATED_DODECAHEDRON]: 0.7,
            [GeometricType.TRUNCATED_ICOSAHEDRON]: 0.7,
            [GeometricType.RHOMBICOSIDODECAHEDRON]: 0.6,
            [GeometricType.TRUNCATED_ICOSIDODECAHEDRON]: 0.6,
            [GeometricType.SNUB_DODECAHEDRON]: 0.5
        };
        return thresholds[geometricType] || 0.5;
    }
    /**
     * Get consensus level for geometric type
     */
    getConsensusLevel(geometricType) {
        // Map geometric types to consensus levels
        if ([GeometricType.TETRAHEDRON, GeometricType.CUBE, GeometricType.OCTAHEDRON,
            GeometricType.DODECAHEDRON, GeometricType.ICOSAHEDRON].includes(geometricType)) {
            return 'local';
        }
        if ([GeometricType.FIVE_CELL, GeometricType.EIGHT_CELL, GeometricType.SIXTEEN_CELL,
            GeometricType.TWENTY_FOUR_CELL, GeometricType.SIX_HUNDRED_CELL].includes(geometricType)) {
            return 'federation';
        }
        return 'global';
    }
    /**
     * Calculate required agreement for geometric type
     */
    calculateRequiredAgreement(geometricType, participantCount) {
        const threshold = this.getThresholdForType(geometricType);
        return Math.ceil(participantCount * threshold);
    }
    /**
     * Generate unique message ID
     */
    generateMessageId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `msg-${timestamp}-${random}`;
    }
    /**
     * Generate unique proposal ID
     */
    generateProposalId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `prop-${timestamp}-${random}`;
    }
    /**
     * Generate unique vote ID
     */
    generateVoteId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `vote-${timestamp}-${random}`;
    }
    /**
     * Serialize message to JSON
     */
    serializeMessage(message) {
        return JSON.stringify(message, null, 2);
    }
    /**
     * Deserialize message from JSON
     */
    deserializeMessage(json) {
        const message = JSON.parse(json);
        if (!this.validateMessage(message)) {
            throw new Error('Invalid message format');
        }
        return message;
    }
    /**
     * Create message signature (placeholder)
     */
    createSignature(message, _privateKey) {
        // Placeholder for cryptographic signature
        // In a real implementation, this would use proper cryptography
        const data = `${message.id}:${message.from}:${message.timestamp}`;
        return `sig-${Buffer.from(data).toString('base64').substring(0, 16)}`;
    }
    /**
     * Verify message signature (placeholder)
     */
    verifySignature(_message, _signature, _publicKey) {
        // Placeholder for signature verification
        // In a real implementation, this would use proper cryptography
        return _signature.startsWith('sig-');
    }
}
//# sourceMappingURL=geometric-protocol.js.map