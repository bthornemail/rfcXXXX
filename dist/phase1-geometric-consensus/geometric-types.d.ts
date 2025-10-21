/**
 * Geometric Types and Shapes for RFC XXXX Implementation
 *
 * Defines all Platonic, Archimedean, and 4D polytopes used in geometric consensus.
 * Based on RFC XXXX Appendix A specifications.
 */
export declare enum GeometricType {
    POINT = "POINT",
    LINE = "LINE",
    TRIANGLE = "TRIANGLE",
    SQUARE = "SQUARE",
    TETRAHEDRON = "TETRAHEDRON",
    CUBE = "CUBE",
    OCTAHEDRON = "OCTAHEDRON",
    DODECAHEDRON = "DODECAHEDRON",
    ICOSAHEDRON = "ICOSAHEDRON",
    FIVE_CELL = "FIVE_CELL",
    EIGHT_CELL = "EIGHT_CELL",
    SIXTEEN_CELL = "SIXTEEN_CELL",
    TWENTY_FOUR_CELL = "TWENTY_FOUR_CELL",
    SIX_HUNDRED_CELL = "SIX_HUNDRED_CELL",
    TRUNCATED_TETRAHEDRON = "TRUNCATED_TETRAHEDRON",
    CUBOCTAHEDRON = "CUBOCTAHEDRON",
    TRUNCATED_CUBE = "TRUNCATED_CUBE",
    TRUNCATED_OCTAHEDRON = "TRUNCATED_OCTAHEDRON",
    RHOMBICUBOCTAHEDRON = "RHOMBICUBOCTAHEDRON",
    TRUNCATED_CUBOCTAHEDRON = "TRUNCATED_CUBOCTAHEDRON",
    SNUB_CUBE = "SNUB_CUBE",
    ICOSIDODECAHEDRON = "ICOSIDODECAHEDRON",
    TRUNCATED_DODECAHEDRON = "TRUNCATED_DODECAHEDRON",
    TRUNCATED_ICOSAHEDRON = "TRUNCATED_ICOSAHEDRON",
    RHOMBICOSIDODECAHEDRON = "RHOMBICOSIDODECAHEDRON",
    TRUNCATED_ICOSIDODECAHEDRON = "TRUNCATED_ICOSIDODECAHEDRON",
    SNUB_DODECAHEDRON = "SNUB_DODECAHEDRON"
}
export interface GeometricShape {
    type: GeometricType;
    name: string;
    vertices: number;
    edges: number;
    faces: number;
    threshold: number;
    dual?: GeometricType;
    isSelfDual: boolean;
    dimension: number;
    schlaefli?: string;
    context: 'local' | 'federation' | 'global';
    description: string;
}
/**
 * Complete lookup table of all geometric shapes with mathematical properties
 * Based on RFC XXXX Appendix A specifications
 */
export declare const GEOMETRIC_SHAPES: Record<GeometricType, GeometricShape>;
/**
 * Get geometric shape by type
 */
export declare function getGeometricShape(type: GeometricType): GeometricShape;
/**
 * Get all shapes for a specific context
 */
export declare function getShapesByContext(context: 'local' | 'federation' | 'global'): GeometricShape[];
/**
 * Get dual of a geometric shape
 */
export declare function getDual(shape: GeometricShape): GeometricShape | null;
/**
 * Calculate required agreement count for consensus
 */
export declare function calculateRequiredAgreement(shape: GeometricShape): number;
/**
 * Check if a shape is valid for consensus
 */
export declare function isValidForConsensus(shape: GeometricShape, agreesCount: number): boolean;
/**
 * Get consensus keyword for a shape
 */
export declare function getConsensusKeyword(shape: GeometricShape): string;
/**
 * Find shapes by vertex count range
 */
export declare function findShapesByVertexRange(minVertices: number, maxVertices: number): GeometricShape[];
/**
 * Get shapes suitable for a given number of participants
 */
export declare function getSuitableShapes(participantCount: number): GeometricShape[];
