/**
 * md.sys.state.* — interaction-state system tokens.
 * @see https://m3.material.io/foundations/interaction/states/state-layers
 */
export const state = {
  opacity: {
    dragged: 0.16,
    pressed: 0.1,
    focused: 0.1,
    hovered: 0.08,
    disabled: 0.38,
    enabled: 1.0,
  },
  focusIndicator: {
    thickness: 3,
    outerOffset: 2,
  },
  /**
   * Minimum size of an interactive target. Applied by expanding outside the
   * component's bounds, so it is separate from the 40dp state layer that
   * Checkbox and Switch render.
   * @see https://m3.material.io/foundations/designing/structure
   */
  minInteractiveSize: 48,
} as const;
