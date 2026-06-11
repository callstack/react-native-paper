/**
 * Worklet path builders for the wavy progress indicators. They run inside `useAnimatedProps`
 * on the UI thread, so they must stay self-contained (no outside captures beyond their args)
 * and return an SVG `d` string. Coordinates are rounded to 2dp to keep the string small.
 */

const round = (value: number) => {
  'worklet';
  return Math.round(value * 100) / 100;
};

/**
 * Straight horizontal segment from `x0` to `x1` at height `y`. Used for the track and as the
 * flat fallback when the wave amplitude is 0.
 */
export function buildStraightPath(x0: number, x1: number, y: number): string {
  'worklet';
  if (x1 <= x0) return '';
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
  if (headX <= tailX) return '';
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
