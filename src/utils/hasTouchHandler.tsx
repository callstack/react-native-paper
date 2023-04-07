import type { GestureResponderEvent } from 'react-native';

type TouchableEventObject = {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  onPressIn?: ((event: GestureResponderEvent) => void) | undefined;
  onPressOut?: ((event: GestureResponderEvent) => void) | undefined;
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
};

const hasTouchHandler = (
  touchableEventObject: TouchableEventObject
): boolean => {
  const touchableEvents: Array<keyof TouchableEventObject> = [
    'onPress',
    'onLongPress',
    'onPressIn',
    'onPressOut',
  ];

  return touchableEvents.some((event) => {
    return touchableEventObject[event] !== undefined;
  });
};

export default hasTouchHandler;
