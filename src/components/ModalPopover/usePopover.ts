import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  findNodeHandle,
  I18nManager,
  MeasureOnSuccessCallback,
  NativeModules,
  StatusBar,
} from 'react-native';
import { Rect } from './PopoverGeometry';

interface State {
  showPopover: boolean;
  popoverAnchor: Rect;
}

export interface UsePopoverHook {
  openPopover: () => void;
  closePopover: () => void;
  popoverVisible: boolean;
  touchableRef: React.MutableRefObject<any>;
  popoverAnchorRect: Rect;
}

export function usePopover(calculateStatusBar = false): UsePopoverHook {
  const touchableRef = useRef<any>(null);

  const [{ showPopover, popoverAnchor }, setState] = useState<State>({
    showPopover: false,
    popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
  });

  const result = useMemo(() => {
    const openPopover = () => {
      const handle = findNodeHandle(touchableRef.current);
      if (handle) {
        NativeModules.UIManager.measure(handle, onTouchableMeasured);
      }
    };

    const onTouchableMeasured: MeasureOnSuccessCallback = (
      _x0,
      _y0,
      width,
      height,
      x,
      y,
    ) => {
      const dimensions = Dimensions.get('window');
      setState({
        showPopover: true,
        popoverAnchor: {
          x: I18nManager.isRTL ? dimensions.width - x : x,
          y: y - (calculateStatusBar ? StatusBar.currentHeight ?? 0 : 0),
          width,
          height,
        },
      });
    };

    const closePopover = () => setState((s) => ({ ...s, showPopover: false }));

    return {
      openPopover,
      closePopover,
      touchableRef,
      popoverVisible: showPopover,
      popoverAnchorRect: popoverAnchor,
    };
  }, [calculateStatusBar, touchableRef, showPopover, popoverAnchor, setState]);

  const { openPopover } = result;

  useEffect(() => {
    const onOrientationChange = () => {
      if (showPopover) {
        // Need to measure touchable and setFrom rect on popover again
        requestAnimationFrame(openPopover);
      }
    };
    const listener = Dimensions.addEventListener('change', onOrientationChange);
    return () => {
      listener.remove();
    };
  }, [showPopover, openPopover]);

  return result;
}
