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
} as const;
