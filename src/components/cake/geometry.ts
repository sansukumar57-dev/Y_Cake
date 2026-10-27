import { LatheGeometry, Vector2 } from "three";
export function createRoundedCylinderGeometry(
  radius: number,
  height: number,
  bevel = 0.055,
  segments = 72,
) {
  const half = height / 2;
  const b = Math.min(bevel, radius * 0.35, height * 0.18);
  const points: Vector2[] = [];

  points.push(new Vector2(0, -half));
  points.push(new Vector2(radius - b, -half));

  const bottomArcSteps = 7;
  for (let index = 1; index <= bottomArcSteps; index += 1) {
    const angle = -Math.PI / 2 + (Math.PI / 2) * (index / bottomArcSteps);
    points.push(
      new Vector2(
        radius - b + Math.cos(angle) * b,
        -half + b + Math.sin(angle) * b,
      ),
    );
  }

  points.push(new Vector2(radius, half - b));

  const topArcSteps = 7;
  for (let index = 1; index <= topArcSteps; index += 1) {
    const angle = (Math.PI / 2) * (index / topArcSteps);
    points.push(
      new Vector2(
        radius - b + Math.cos(angle) * b,
        half - b + Math.sin(angle) * b,
      ),
    );
  }

  points.push(new Vector2(0, half));

  const geometry = new LatheGeometry(points, segments);
  geometry.computeVertexNormals();
  return geometry;
}

export function createDripGeometry(length: number, width: number) {
  const points: Vector2[] = [
    new Vector2(0.004, 0),
    new Vector2(width * 0.44, -length * 0.08),
    new Vector2(width * 0.72, -length * 0.3),
    new Vector2(width * 0.66, -length * 0.58),
    new Vector2(width * 0.46, -length * 0.82),
    new Vector2(width * 0.18, -length * 0.95),
    new Vector2(0.004, -length),
  ];
  const geometry = new LatheGeometry(points, 12);
  geometry.computeVertexNormals();
  return geometry;
}
