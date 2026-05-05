import type { ThemeState } from '../../types';
import { tokens } from '../index';

const { stateOpacity } = tokens.md.ref;

export const defaultState: ThemeState = {
  opacity: {
    hovered: stateOpacity.hovered,
    focused: stateOpacity.focused,
    pressed: stateOpacity.pressed,
    dragged: stateOpacity.dragged,
    disabled: stateOpacity.disabled,
    enabled: stateOpacity.enabled,
  },
};
