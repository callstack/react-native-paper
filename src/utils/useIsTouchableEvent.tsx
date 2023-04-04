import { useEffect, useMemo, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';

type TouchableEventObject = {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  onPressIn?: ((event: GestureResponderEvent) => void) | undefined;
  onPressOut?: ((event: GestureResponderEvent) => void) | undefined;
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
};

const useIsTouchableEvent = (
  touchableEventObject: TouchableEventObject
): boolean => {
  const [isTouchable, setIsTouchable] = useState(false);

  const isAnyTouchableEventPresent = useMemo(() => {
    const touchableEvents: Array<keyof TouchableEventObject> = [
      'onPress',
      'onLongPress',
      'onPressIn',
      'onPressOut',
    ];

    return touchableEvents.some((event) => {
      return touchableEventObject[event] !== undefined;
    });
  }, [touchableEventObject]);

  useEffect(() => {
    setIsTouchable(isAnyTouchableEventPresent);
  }, [isAnyTouchableEventPresent]);

  return isTouchable;
};

export default useIsTouchableEvent;
