import type { GestureResponderEvent } from 'react-native';

const touchableEvents = [
  'onPress',
  'onLongPress',
  'onPressIn',
  'onPressOut',
] as const;

type TouchableEventObject = Partial<
  Record<
    (typeof touchableEvents)[number],
    (event: GestureResponderEvent) => void
  >
>;

export default function hasTouchHandler(
  touchableEventObject: TouchableEventObject
) {
  return touchableEvents.some((event) => {
    return Boolean(touchableEventObject[event]);
  });
}
