import * as React from 'react';
import { Platform } from 'react-native';
import type { NativeSyntheticEvent } from 'react-native';

import { useTimeout } from './hooks';
import type { TooltipHostElement } from './hooks';
import { getActiveElement } from './utils';
import { useOverlayDismiss } from '../../utils/useOverlayDismiss';
import { focusIntoContainer } from '../../utils/useOverlayFocus';

type Options = {
  visible: boolean;
  hasActions: boolean;
  tooltipRef: React.RefObject<TooltipHostElement | null>;
  triggerRef: React.RefObject<TooltipHostElement | null>;
  show: () => void;
  hide: () => void;
  scheduleHide: () => void;
  consumeTouchFocus: () => boolean;
};

/**
 * Web only: keyboard and focus handling of `Tooltip.Rich`.
 */
export const useRichTooltipFocus = ({
  visible,
  hasActions,
  tooltipRef,
  triggerRef,
  show,
  hide,
  scheduleHide,
  consumeTouchFocus,
}: Options) => {
  // the trigger's keyboard focus opened the tooltip
  const focusOpenedRef = React.useRef(false);
  // set while dismiss is returning focus to the trigger
  const refocusAfterDismissRef = React.useRef(false);
  const focusTimer = useTimeout();

  React.useEffect(() => {
    if (!visible) {
      focusOpenedRef.current = false;
    }
  }, [visible]);

  // Focus inside the tooltip would be lost on unmount, so it goes back to the
  // trigger; focus elsewhere stays put
  const hideAndRestoreFocus = () => {
    const focused = Platform.OS === 'web' ? getActiveElement() : null;
    const hadFocus =
      focused != null &&
      (tooltipRef.current?.contains?.(focused) ||
        triggerRef.current?.contains?.(focused));

    hide();
    // set before focusing, as the trigger's focus event would reopen the
    // tooltip; cleared if the browser refused the focus
    refocusAfterDismissRef.current = Boolean(hadFocus);
    if (hadFocus && !focusIntoContainer(triggerRef.current)) {
      refocusAfterDismissRef.current = false;
    }
  };

  // Ignores the focus that dismissing causes, and the focus a tap gives the
  // trigger, as the press that follows toggles the tooltip
  const onFocus = () => {
    const isTouchFocus = consumeTouchFocus();
    if (refocusAfterDismissRef.current || isTouchFocus) {
      refocusAfterDismissRef.current = false;
      return;
    }
    focusOpenedRef.current = true;
    show();
  };

  const onBlur = () => {
    refocusAfterDismissRef.current = false;
    focusOpenedRef.current = false;
    scheduleHide();
  };

  // The portal puts the tooltip at the end of the document, out of `Tab`
  // order, so `ArrowDown` moves focus into the actions once it has mounted
  const onKeyDown = (event: NativeSyntheticEvent<{ key: string }>) => {
    if (hasActions && event.nativeEvent.key === 'ArrowDown') {
      // keeps the page from scrolling before focus moves
      event.preventDefault();
      show();
      focusTimer.schedule(() => focusIntoContainer(tooltipRef.current), 0);
    }
  };

  // The backdrop lets pointer events through, so a press outside closes the
  // tooltip here; blur misses triggers a tap doesn't focus, as in Safari
  React.useEffect(() => {
    if (Platform.OS !== 'web' || !visible || !('document' in global)) {
      return;
    }

    const handlePointerDown = ({ target }: { target: EventTarget | null }) => {
      if (
        tooltipRef.current?.contains?.(target) ||
        triggerRef.current?.contains?.(target)
      ) {
        return;
      }
      hide();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [visible, hide, tooltipRef, triggerRef]);

  // The back button is left to the screen, as the tooltip isn't modal
  useOverlayDismiss({
    enabled: visible && Platform.OS === 'web',
    dismissable: true,
    onDismiss: hideAndRestoreFocus,
  });

  return {
    triggerProps: { onFocus, onBlur, onKeyDown },
    hideAndRestoreFocus,
    isOpenedByFocus: () => focusOpenedRef.current,
  };
};
