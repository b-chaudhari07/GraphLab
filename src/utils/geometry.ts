/**
 * Geometric calculations for SVG Graph rendering.
 * Supports straight lines, curved dual-directed edges, and self-loops.
 */

export interface Point {
  x: number;
  y: number;
}

export const VERTEX_RADIUS = 24;

/**
 * Calculates Euclidean distance between two points.
 */
export function getDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates line end points adjusted for vertex radius so arrows/lines don't clip inside circles.
 */
export function getAdjustedEdgeEndpoints(
  source: Point,
  target: Point,
  radius: number = VERTEX_RADIUS
): { start: Point; end: Point; mid: Point; angle: number } {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return {
      start: { ...source },
      end: { ...target },
      mid: { ...source },
      angle: 0,
    };
  }

  const unitX = dx / distance;
  const unitY = dy / distance;

  // Start point offset from center by radius
  const startX = source.x + unitX * radius;
  const startY = source.y + unitY * radius;

  // End point offset from center by radius + arrow padding (e.g. 6px)
  const endX = target.x - unitX * (radius + 6);
  const endY = target.y - unitY * (radius + 6);

  // Mid point for weight label
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    mid: { x: midX, y: midY },
    angle,
  };
}

/**
 * Calculates curved Bezier path for dual directed edges (when both A -> B and B -> A exist).
 */
export function getCurvedEdgePath(
  source: Point,
  target: Point,
  radius: number = VERTEX_RADIUS,
  offsetDistance: number = 32
): { path: string; labelPos: Point } {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return getSelfLoopPath(source, radius);
  }

  const unitX = dx / distance;
  const unitY = dy / distance;

  // Perpendicular normal vector for curvature
  const normalX = -unitY;
  const normalY = unitX;

  // Control point for quadratic curve
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const controlX = midX + normalX * offsetDistance;
  const controlY = midY + normalY * offsetDistance;

  // Start & End points adjusted for radius
  const startX = source.x + unitX * radius;
  const startY = source.y + unitY * radius;
  const endX = target.x - unitX * (radius + 6);
  const endY = target.y - unitY * (radius + 6);

  const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  // Midpoint on quadratic Bezier B(0.5) = 0.25*start + 0.5*control + 0.25*end
  const labelPos = {
    x: 0.25 * startX + 0.5 * controlX + 0.25 * endX,
    y: 0.25 * startY + 0.5 * controlY + 0.25 * endY,
  };

  return { path, labelPos };
}

/**
 * SVG Path generator for self-loop edges.
 */
export function getSelfLoopPath(center: Point, radius: number = VERTEX_RADIUS): { path: string; labelPos: Point } {
  const startX = center.x - 10;
  const startY = center.y - radius;
  const endX = center.x + 10;
  const endY = center.y - radius;

  const path = `M ${startX} ${startY} C ${center.x - 30} ${center.y - radius - 40}, ${center.x + 30} ${center.y - radius - 40}, ${endX} ${endY}`;
  const labelPos = { x: center.x, y: center.y - radius - 35 };

  return { path, labelPos };
}
