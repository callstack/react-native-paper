import * as React from 'react';

import { getSegmentedButtonStateLayerOpacity } from './utils';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

type InteractionProps = Pick<
  TouchableRippleProps,
  'onPressIn' | 'onPressOut' | 'onHoverIn' | 'onHoverOut' | 'onFocus' | 'onBlur'
>;

export const useSegmentedButtonInteraction = (disabled?: boolean) => {
  const [pressed, setPressed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const interactionProps: InteractionProps = {
    onPressIn: () => setPressed(true),
    onPressOut: () => setPressed(false),
    onHoverIn: () => setHovered(true),
    onHoverOut: () => setHovered(false),
    onFocus: (event) => {
      if (disabled || !isKeyboardFocusEvent(event)) {
        return;
      }

      setFocused(true);
    },
    onBlur: () => {
      setPressed(false);
      setFocused(false);
    },
  };

  return {
    interactionProps,
    stateLayerOpacity: getSegmentedButtonStateLayerOpacity({
      disabled,
      pressed,
      focused,
      hovered,
    }),
    showFocusRing: focused && !disabled,
  };
};
