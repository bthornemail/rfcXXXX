/**
 * Betti Number Calculation for Topological Invariants
 *
 * Implements O(v) partition detection using algebraic topology.
 * Based on RFC XXXX Appendix I specifications.
 */
export interface Vertex {
    id: string;
    name: string;
    connected: Set<string>;
}
export interface Edge {
    id: string;
    from: string;
    to: string;
}
export interface BettiNumbers {
    beta_0: number;
    beta_1: number;
    beta_2: number;
}
export interface SimplicialComplex {
    vertices: Vertex[];
    edges: Edge[];
    faces: number[][];
}
/**
 * Betti Number Calculator using algebraic topology
 *
 * Key insight: β₀ = number of connected components = partition count
 * This provides O(v) partition detection vs O(v²) graph traversal
 */
export declare class BettiCalculator {
    /**
     * Calculate Betti numbers for a simplicial complex
     *
     * Algorithm:
     * 1. Build adjacency matrix from vertices and edges
     * 2. Compute connected components (β₀)
     * 3. Compute cycles (β₁) using rank-nullity theorem
     * 4. Compute voids (β₂) for 3D+ complexes
     */
    calculateBettiNumbers(vertices: Vertex[], edges: Edge[]): BettiNumbers;
    /**
     * Detect network partition using Betti numbers
     *
     * Key insight: β₀ > 1 means the network is partitioned
     * This is O(v) vs O(v²) for traditional graph traversal
     */
    detectPartition(betti: BettiNumbers): boolean;
    /**
     * Count number of partitions
     */
    countPartitions(betti: BettiNumbers): number;
    /**
     * Build adjacency matrix from vertices and edges
     */
    private buildAdjacencyMatrix;
    /**
     * Calculate connected components using DFS
     *
     * This gives us β₀ (number of connected components)
     */
    private calculateConnectedComponents;
    /**
     * Depth-first search for connected components
     */
    private dfs;
    /**
     * Calculate cycles (β₁) using rank-nullity theorem
     *
     * For a graph: β₁ = E - V + C
     * Where E = edges, V = vertices, C = connected components
     */
    private calculateCycles;
    /**
     * Calculate voids (β₂) for 3D+ complexes
     *
     * Simplified calculation for 2D simplicial complexes
     * For full 3D calculation, would need tetrahedral faces
     */
    private calculateVoids;
    /**
     * Build simplicial complex from geometric shape
     *
     * Converts a geometric shape into a simplicial complex for Betti calculation
     */
    buildSimplicialComplex(shapeType: string, vertices: Vertex[]): SimplicialComplex;
    /**
     * Build tetrahedron edges (4 vertices, 6 edges)
     */
    private buildTetrahedronEdges;
    /**
     * Build tetrahedron faces (4 triangular faces)
     */
    private buildTetrahedronFaces;
    /**
     * Build cube edges (8 vertices, 12 edges)
     */
    private buildCubeEdges;
    /**
     * Build cube faces (6 square faces as 2 triangles each)
     */
    private buildCubeFaces;
    /**
     * Build octahedron edges (6 vertices, 12 edges)
     */
    private buildOctahedronEdges;
    /**
     * Build octahedron faces (8 triangular faces)
     */
    private buildOctahedronFaces;
    /**
     * Build complete graph edges (all vertices connected)
     */
    private buildCompleteGraphEdges;
    /**
     * Calculate partition information from Betti numbers
     */
    calculatePartitionInfo(betti: BettiNumbers, _vertices: Vertex[]): {
        isPartitioned: boolean;
        partitionCount: number;
        components: Set<string>[];
        bettiNumbers: BettiNumbers;
    };
    /**
     * Verify Betti number properties
     */
    verifyBettiProperties(betti: BettiNumbers, vertices: Vertex[], edges: Edge[]): boolean;
}
