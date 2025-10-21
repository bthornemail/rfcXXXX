/**
 * Geometric Types and Shapes for RFC XXXX Implementation
 *
 * Defines all Platonic, Archimedean, and 4D polytopes used in geometric consensus.
 * Based on RFC XXXX Appendix A specifications.
 */

export enum GeometricType {
  // 0D-2D (Local Context)
  POINT = 'POINT',
  LINE = 'LINE',
  TRIANGLE = 'TRIANGLE',
  SQUARE = 'SQUARE',

  // 3D Platonic Solids (Local Context)
  TETRAHEDRON = 'TETRAHEDRON',
  CUBE = 'CUBE',
  OCTAHEDRON = 'OCTAHEDRON',
  DODECAHEDRON = 'DODECAHEDRON',
  ICOSAHEDRON = 'ICOSAHEDRON',

  // 4D Regular Polytopes (Federation Context)
  FIVE_CELL = 'FIVE_CELL',
  EIGHT_CELL = 'EIGHT_CELL',
  SIXTEEN_CELL = 'SIXTEEN_CELL',
  TWENTY_FOUR_CELL = 'TWENTY_FOUR_CELL',
  SIX_HUNDRED_CELL = 'SIX_HUNDRED_CELL',

  // 3D Archimedean Solids (Global Context)
  TRUNCATED_TETRAHEDRON = 'TRUNCATED_TETRAHEDRON',
  CUBOCTAHEDRON = 'CUBOCTAHEDRON',
  TRUNCATED_CUBE = 'TRUNCATED_CUBE',
  TRUNCATED_OCTAHEDRON = 'TRUNCATED_OCTAHEDRON',
  RHOMBICUBOCTAHEDRON = 'RHOMBICUBOCTAHEDRON',
  TRUNCATED_CUBOCTAHEDRON = 'TRUNCATED_CUBOCTAHEDRON',
  SNUB_CUBE = 'SNUB_CUBE',
  ICOSIDODECAHEDRON = 'ICOSIDODECAHEDRON',
  TRUNCATED_DODECAHEDRON = 'TRUNCATED_DODECAHEDRON',
  TRUNCATED_ICOSAHEDRON = 'TRUNCATED_ICOSAHEDRON',
  RHOMBICOSIDODECAHEDRON = 'RHOMBICOSIDODECAHEDRON',
  TRUNCATED_ICOSIDODECAHEDRON = 'TRUNCATED_ICOSIDODECAHEDRON',
  SNUB_DODECAHEDRON = 'SNUB_DODECAHEDRON'
}

export interface GeometricShape {
  type: GeometricType;
  name: string;
  vertices: number;
  edges: number;
  faces: number;
  threshold: number;        // Consensus threshold (0.0-1.0)
  dual?: GeometricType;     // Dual polyhedron
  isSelfDual: boolean;
  dimension: number;
  schlaefli?: string;       // Schläfli symbol
  context: 'local' | 'federation' | 'global';
  description: string;
}

/**
 * Complete lookup table of all geometric shapes with mathematical properties
 * Based on RFC XXXX Appendix A specifications
 */
export const GEOMETRIC_SHAPES: Record<GeometricType, GeometricShape> = {
  // 0D-2D Shapes (Local Context)
  [GeometricType.POINT]: {
    type: GeometricType.POINT,
    name: 'Point',
    vertices: 1,
    edges: 0,
    faces: 0,
    threshold: 1.0,  // 1/1 = 100%
    isSelfDual: true,
    dimension: 0,
    context: 'local',
    description: '0D point - unanimous consensus required'
  },

  [GeometricType.LINE]: {
    type: GeometricType.LINE,
    name: 'Line',
    vertices: 2,
    edges: 1,
    faces: 0,
    threshold: 1.0,  // 2/2 = 100%
    isSelfDual: true,
    dimension: 1,
    context: 'local',
    description: '1D line - bilateral consensus'
  },

  [GeometricType.TRIANGLE]: {
    type: GeometricType.TRIANGLE,
    name: 'Triangle',
    vertices: 3,
    edges: 3,
    faces: 1,
    threshold: 1.0,  // 3/3 = 100%
    isSelfDual: true,
    dimension: 2,
    context: 'local',
    description: '2D triangle - trilateral consensus'
  },

  [GeometricType.SQUARE]: {
    type: GeometricType.SQUARE,
    name: 'Square',
    vertices: 4,
    edges: 4,
    faces: 1,
    threshold: 0.75,  // 3/4 = 75%
    dual: GeometricType.SQUARE,
    isSelfDual: true,
    dimension: 2,
    context: 'local',
    description: '2D square - quadrilateral consensus'
  },

  // 3D Platonic Solids (Local Context)
  [GeometricType.TETRAHEDRON]: {
    type: GeometricType.TETRAHEDRON,
    name: 'Tetrahedron',
    vertices: 4,
    edges: 6,
    faces: 4,
    threshold: 1.0,  // 4/4 = 100%
    dual: GeometricType.TETRAHEDRON,
    isSelfDual: true,
    dimension: 3,
    schlaefli: '{3,3}',
    context: 'local',
    description: '3D tetrahedron - MUST (unanimous)'
  },

  [GeometricType.CUBE]: {
    type: GeometricType.CUBE,
    name: 'Cube',
    vertices: 8,
    edges: 12,
    faces: 6,
    threshold: 0.5,  // 4/8 = 50%
    dual: GeometricType.OCTAHEDRON,
    isSelfDual: false,
    dimension: 3,
    schlaefli: '{4,3}',
    context: 'local',
    description: '3D cube - MAY (majority)'
  },

  [GeometricType.OCTAHEDRON]: {
    type: GeometricType.OCTAHEDRON,
    name: 'Octahedron',
    vertices: 6,
    edges: 12,
    faces: 8,
    threshold: 0.833,  // 5/6 = 83.3%
    dual: GeometricType.CUBE,
    isSelfDual: false,
    dimension: 3,
    schlaefli: '{3,4}',
    context: 'local',
    description: '3D octahedron - SHOULD (strong consensus)'
  },

  [GeometricType.DODECAHEDRON]: {
    type: GeometricType.DODECAHEDRON,
    name: 'Dodecahedron',
    vertices: 20,
    edges: 30,
    faces: 12,
    threshold: 0.6,  // 12/20 = 60%
    dual: GeometricType.ICOSAHEDRON,
    isSelfDual: false,
    dimension: 3,
    schlaefli: '{5,3}',
    context: 'local',
    description: '3D dodecahedron - committee consensus'
  },

  [GeometricType.ICOSAHEDRON]: {
    type: GeometricType.ICOSAHEDRON,
    name: 'Icosahedron',
    vertices: 12,
    edges: 30,
    faces: 20,
    threshold: 0.75,  // 9/12 = 75%
    dual: GeometricType.DODECAHEDRON,
    isSelfDual: false,
    dimension: 3,
    schlaefli: '{3,5}',
    context: 'local',
    description: '3D icosahedron - high consensus'
  },

  // 4D Regular Polytopes (Federation Context)
  [GeometricType.FIVE_CELL]: {
    type: GeometricType.FIVE_CELL,
    name: '5-cell',
    vertices: 5,
    edges: 10,
    faces: 10,
    threshold: 1.0,  // 5/5 = 100%
    dual: GeometricType.FIVE_CELL,
    isSelfDual: true,
    dimension: 4,
    schlaefli: '{3,3,3}',
    context: 'federation',
    description: '4D 5-cell - MUST_FEDERATION (unanimous)'
  },

  [GeometricType.EIGHT_CELL]: {
    type: GeometricType.EIGHT_CELL,
    name: '8-cell',
    vertices: 16,
    edges: 32,
    faces: 24,
    threshold: 0.5,  // 8/16 = 50%
    dual: GeometricType.SIXTEEN_CELL,
    isSelfDual: false,
    dimension: 4,
    schlaefli: '{4,3,3}',
    context: 'federation',
    description: '4D 8-cell - MAY_FEDERATION (majority)'
  },

  [GeometricType.SIXTEEN_CELL]: {
    type: GeometricType.SIXTEEN_CELL,
    name: '16-cell',
    vertices: 8,
    edges: 24,
    faces: 32,
    threshold: 0.75,  // 6/8 = 75%
    dual: GeometricType.EIGHT_CELL,
    isSelfDual: false,
    dimension: 4,
    schlaefli: '{3,3,4}',
    context: 'federation',
    description: '4D 16-cell - SHOULD_FEDERATION (strong consensus)'
  },

  [GeometricType.TWENTY_FOUR_CELL]: {
    type: GeometricType.TWENTY_FOUR_CELL,
    name: '24-cell',
    vertices: 24,
    edges: 96,
    faces: 96,
    threshold: 0.833,  // 20/24 = 83.3%
    dual: GeometricType.TWENTY_FOUR_CELL,
    isSelfDual: true,
    dimension: 4,
    schlaefli: '{3,4,3}',
    context: 'federation',
    description: '4D 24-cell - SHOULD_FEDERATION (strong consensus)'
  },

  [GeometricType.SIX_HUNDRED_CELL]: {
    type: GeometricType.SIX_HUNDRED_CELL,
    name: '600-cell',
    vertices: 120,
    edges: 720,
    faces: 1200,
    threshold: 0.6,  // 72/120 = 60%
    dual: GeometricType.SIX_HUNDRED_CELL,
    isSelfDual: false,
    dimension: 4,
    schlaefli: '{3,3,5}',
    context: 'federation',
    description: '4D 600-cell - large federation consensus'
  },

  // 3D Archimedean Solids (Global Context)
  [GeometricType.TRUNCATED_TETRAHEDRON]: {
    type: GeometricType.TRUNCATED_TETRAHEDRON,
    name: 'Truncated Tetrahedron',
    vertices: 12,
    edges: 18,
    faces: 8,
    threshold: 1.0,  // 12/12 = 100%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D truncated tetrahedron - MUST_GLOBAL (unanimous)'
  },

  [GeometricType.CUBOCTAHEDRON]: {
    type: GeometricType.CUBOCTAHEDRON,
    name: 'Cuboctahedron',
    vertices: 12,
    edges: 24,
    faces: 14,
    threshold: 0.833,  // 10/12 = 83.3%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D cuboctahedron - SHOULD_GLOBAL (strong consensus)'
  },

  [GeometricType.TRUNCATED_CUBE]: {
    type: GeometricType.TRUNCATED_CUBE,
    name: 'Truncated Cube',
    vertices: 24,
    edges: 36,
    faces: 14,
    threshold: 0.5,  // 12/24 = 50%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D truncated cube - MAY_GLOBAL (majority)'
  },

  [GeometricType.TRUNCATED_OCTAHEDRON]: {
    type: GeometricType.TRUNCATED_OCTAHEDRON,
    name: 'Truncated Octahedron',
    vertices: 24,
    edges: 36,
    faces: 14,
    threshold: 0.75,  // 18/24 = 75%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D truncated octahedron - committee consensus'
  },

  [GeometricType.RHOMBICUBOCTAHEDRON]: {
    type: GeometricType.RHOMBICUBOCTAHEDRON,
    name: 'Rhombicuboctahedron',
    vertices: 24,
    edges: 48,
    faces: 26,
    threshold: 0.625,  // 15/24 = 62.5%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D rhombicuboctahedron - balanced consensus'
  },

  [GeometricType.TRUNCATED_CUBOCTAHEDRON]: {
    type: GeometricType.TRUNCATED_CUBOCTAHEDRON,
    name: 'Truncated Cuboctahedron',
    vertices: 48,
    edges: 72,
    faces: 26,
    threshold: 0.5,  // 24/48 = 50%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D truncated cuboctahedron - MAY_GLOBAL (majority)'
  },

  [GeometricType.SNUB_CUBE]: {
    type: GeometricType.SNUB_CUBE,
    name: 'Snub Cube',
    vertices: 24,
    edges: 60,
    faces: 38,
    threshold: 0.75,  // 18/24 = 75%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D snub cube - committee consensus'
  },

  [GeometricType.ICOSIDODECAHEDRON]: {
    type: GeometricType.ICOSIDODECAHEDRON,
    name: 'Icosidodecahedron',
    vertices: 30,
    edges: 60,
    faces: 32,
    threshold: 0.8,  // 24/30 = 80%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D icosidodecahedron - strong consensus'
  },

  [GeometricType.TRUNCATED_DODECAHEDRON]: {
    type: GeometricType.TRUNCATED_DODECAHEDRON,
    name: 'Truncated Dodecahedron',
    vertices: 60,
    edges: 90,
    faces: 32,
    threshold: 0.5,  // 30/60 = 50%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D truncated dodecahedron - MAY_GLOBAL (majority)'
  },

  [GeometricType.TRUNCATED_ICOSAHEDRON]: {
    type: GeometricType.TRUNCATED_ICOSAHEDRON,
    name: 'Truncated Icosahedron',
    vertices: 60,
    edges: 90,
    faces: 32,
    threshold: 0.75,  // 45/60 = 75%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D truncated icosahedron - committee consensus'
  },

  [GeometricType.RHOMBICOSIDODECAHEDRON]: {
    type: GeometricType.RHOMBICOSIDODECAHEDRON,
    name: 'Rhombicosidodecahedron',
    vertices: 60,
    edges: 120,
    faces: 62,
    threshold: 0.6,  // 36/60 = 60%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D rhombicosidodecahedron - balanced consensus'
  },

  [GeometricType.TRUNCATED_ICOSIDODECAHEDRON]: {
    type: GeometricType.TRUNCATED_ICOSIDODECAHEDRON,
    name: 'Truncated Icosidodecahedron',
    vertices: 120,
    edges: 180,
    faces: 62,
    threshold: 0.5,  // 60/120 = 50%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D truncated icosidodecahedron - MAY_GLOBAL (majority)'
  },

  [GeometricType.SNUB_DODECAHEDRON]: {
    type: GeometricType.SNUB_DODECAHEDRON,
    name: 'Snub Dodecahedron',
    vertices: 60,
    edges: 150,
    faces: 92,
    threshold: 0.75,  // 45/60 = 75%
    isSelfDual: false,
    dimension: 3,
    context: 'global',
    description: '3D snub dodecahedron - committee consensus'
  }
};

/**
 * Get geometric shape by type
 */
export function getGeometricShape(type: GeometricType): GeometricShape {
  const shape = GEOMETRIC_SHAPES[type];
  if (!shape) {
    throw new Error(`Unknown geometric type: ${type}`);
  }
  return shape;
}

/**
 * Get all shapes for a specific context
 */
export function getShapesByContext(context: 'local' | 'federation' | 'global'): GeometricShape[] {
  return Object.values(GEOMETRIC_SHAPES).filter(shape => shape.context === context);
}

/**
 * Get dual of a geometric shape
 */
export function getDual(shape: GeometricShape): GeometricShape | null {
  if (shape.isSelfDual) {
    return shape;
  }
  if (shape.dual) {
    return getGeometricShape(shape.dual);
  }
  return null;
}

/**
 * Calculate required agreement count for consensus
 */
export function calculateRequiredAgreement(shape: GeometricShape): number {
  return Math.ceil(shape.vertices * shape.threshold);
}

/**
 * Check if a shape is valid for consensus
 */
export function isValidForConsensus(shape: GeometricShape, agreesCount: number): boolean {
  const required = calculateRequiredAgreement(shape);
  return agreesCount >= required;
}

/**
 * Get consensus keyword for a shape
 */
export function getConsensusKeyword(shape: GeometricShape): string {
  const { context, threshold } = shape;

  if (threshold >= 1.0) {
    return `MUST_${context.toUpperCase()}`;
  } else if (threshold >= 0.8) {
    return `SHOULD_${context.toUpperCase()}`;
  } else {
    return `MAY_${context.toUpperCase()}`;
  }
}

/**
 * Find shapes by vertex count range
 */
export function findShapesByVertexRange(minVertices: number, maxVertices: number): GeometricShape[] {
  return Object.values(GEOMETRIC_SHAPES).filter(
    shape => shape.vertices >= minVertices && shape.vertices <= maxVertices
  );
}

/**
 * Get shapes suitable for a given number of participants
 */
export function getSuitableShapes(participantCount: number): GeometricShape[] {
  return Object.values(GEOMETRIC_SHAPES).filter(
    shape => shape.vertices >= participantCount
  ).sort((a, b) => a.vertices - b.vertices);
}
