export const WIDTH = 340;
const TOOTH = 8.5;
const TEETH = Math.floor(WIDTH / TOOTH);

export function zigzagTop() {
  const pts = [`M0,0 L0,12`];
  for (let i = 0; i <= TEETH; i++) {
    const x = i * TOOTH;
    pts.push(`L${x},${i % 2 === 0 ? 6 : 12}`);
  }
  pts.push(`L${WIDTH},12 L${WIDTH},0 Z`);
  return pts.join(" ");
}

export function zigzagBottom() {
  const pts = [`M0,0`];
  for (let i = 0; i <= TEETH; i++) {
    const x = i * TOOTH;
    pts.push(`L${x},${i % 2 === 0 ? 6 : 0}`);
  }
  pts.push(`L${WIDTH},14 L0,14 Z`);
  return pts.join(" ");
}
