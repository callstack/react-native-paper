/**
 * Worklet path builders for the wavy progress indicators. They run inside `useAnimatedProps`
 * on the UI thread, so they must stay self-contained (no outside captures beyond their args)
 * and return an SVG `d` string. Coordinates are rounded to 2dp to keep the string small.
 */

const round = (value: number) => {
  'worklet';
  return Math.round(value * 100) / 100;
};

export const NO_DRAW_PATH = 'M0,0';

/**
 * Straight horizontal segment from `x0` to `x1` at height `y`. Used for the track and as the
 * flat fallback when the wave amplitude is 0.
 */
export function buildStraightPath(x0: number, x1: number, y: number): string {
  'worklet';
  if (x1 <= x0) return NO_DRAW_PATH;
  return `M${round(x0)},${round(y)}L${round(x1)},${round(y)}`;
}

/**
 * Wavy segment from `tailX` to `headX`, centered on `centerY`. The wave is a chain of quadratic
 * curves, two per `wavelength`: anchors sit on the centerline every half wavelength and control
 * points sit at the quarter points, with the bump direction flipping each half wave. A quadratic
 * peaks at half its control height, so the control offset is `2 * amplitude` to make the visible
 * peak equal `amplitude`.
 *
 * The wave slides by `waveShift` (px): the anchor grid is `(x + waveShift) / halfWave`, so the
 * pattern moves under a fixed window. Only the visible `[tailX, headX]` range is emitted; the
 * boundary cells are cut precisely. Because each cell's control point sits at the midpoint in x,
 * x is linear in the curve parameter, so a target x maps to a parameter by simple interpolation.
 *
 * `amplitude <= 0` returns a straight line (track / wave switched off / reduce motion).
 */
export function buildLinearWavePath(
  tailX: number,
  headX: number,
  centerY: number,
  amplitude: number,
  wavelength: number,
  waveShift: number
): string {
  'worklet';
  if (headX <= tailX) return NO_DRAW_PATH;
  if (amplitude <= 0) return buildStraightPath(tailX, headX, centerY);

  const halfWave = wavelength / 2;
  const controlY = amplitude * 2;

  let cell = Math.floor((tailX + waveShift) / halfWave);
  let x0 = cell * halfWave - waveShift;
  let d = '';
  let started = false;

  while (x0 < headX) {
    const x2 = x0 + halfWave;
    // Bump direction alternates per cell; negative is up in the y-down SVG space.
    const sign = (((cell % 2) + 2) % 2 === 0 ? -1 : 1) * controlY;
    const cx = x0 + halfWave / 2;
    const cy = centerY + sign;

    // Clip this cell to the visible window via the linear x->parameter mapping.
    const t0 = Math.max(0, (tailX - x0) / halfWave);
    const t1 = Math.min(1, (headX - x0) / halfWave);

    // Quadratic with P0=(x0,centerY), P1=(cx,cy), P2=(x2,centerY). Endpoints come from the
    // curve at t0/t1; the sub-segment control point comes from the blossom of (t0, t1).
    const a0 = 1 - t0;
    const a1 = 1 - t1;
    const startX = a0 * a0 * x0 + 2 * a0 * t0 * cx + t0 * t0 * x2;
    const startY = a0 * a0 * centerY + 2 * a0 * t0 * cy + t0 * t0 * centerY;
    const endX = a1 * a1 * x0 + 2 * a1 * t1 * cx + t1 * t1 * x2;
    const endY = a1 * a1 * centerY + 2 * a1 * t1 * cy + t1 * t1 * centerY;
    const w0 = a0 * a1;
    const w1 = a0 * t1 + t0 * a1;
    const w2 = t0 * t1;
    const ctrlX = w0 * x0 + w1 * cx + w2 * x2;
    const ctrlY = w0 * centerY + w1 * cy + w2 * centerY;

    if (!started) {
      d += `M${round(startX)},${round(startY)}`;
      started = true;
    }
    d += `Q${round(ctrlX)},${round(ctrlY)} ${round(endX)},${round(endY)}`;

    cell += 1;
    x0 = x2;
  }

  return d;
}

const SAMPLES_PER_WAVE = 16;

/**
 * Wavy arc centered on `(cx, cy)`, running clockwise from `startAngleDeg` for `sweepDeg` degrees.
 * The wave is a closed polar sinusoid `r = radius + amplitude * sin(waveCount * theta + phase)`,
 * sampled as a polyline. `waveCount` must be an integer so the pattern joins seamlessly around the
 * full circle. Motion comes from advancing `phase`.
 *
 * `amplitude <= 0` returns a plain arc (track / wave switched off / reduce motion).
 */
export function buildArcWavePath(
  cx: number,
  cy: number,
  radius: number,
  startAngleDeg: number,
  sweepDeg: number,
  amplitude: number,
  waveCount: number,
  phase: number
): string {
  'worklet';
  if (sweepDeg <= 0) return NO_DRAW_PATH;
  // Stop just short of a full turn: a 360deg arc would close on itself (the open path's round caps
  // would snap to a seamless join, and a single SVG arc with coincident endpoints draws nothing).
  // The round caps cover the hairline gap, so the ring still reads as complete, with no jump.
  const sweep = Math.min(sweepDeg, 359.5);

  const toRad = Math.PI / 180;
  const startRad = startAngleDeg * toRad;
  const sweepRad = sweep * toRad;

  if (amplitude <= 0) {
    const x0 = cx + radius * Math.cos(startRad);
    const y0 = cy + radius * Math.sin(startRad);
    const r = round(radius);
    const endRad = startRad + sweepRad;
    const x1 = cx + radius * Math.cos(endRad);
    const y1 = cy + radius * Math.sin(endRad);
    const largeArc = sweep > 180 ? 1 : 0;
    return `M${round(x0)},${round(y0)}A${r},${r} 0 ${largeArc} 1 ${round(
      x1
    )},${round(y1)}`;
  }

  const steps = Math.max(
    2,
    Math.ceil((sweepRad / (2 * Math.PI)) * waveCount * SAMPLES_PER_WAVE)
  );
  const step = sweepRad / steps;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const theta = startRad + i * step;
    const r = radius + amplitude * Math.sin(waveCount * theta + phase);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    d += `${i === 0 ? 'M' : 'L'}${round(x)},${round(y)}`;
  }
  return d;
}
