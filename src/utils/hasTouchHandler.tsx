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

/**
 * Roles claiming the view can be activated. State bearing roles (`checkbox`,
 * `radio`, `switch`) are excluded: those still describe a read only view.
 */
export const ACTIVATABLE_ROLES: readonly string[] = [
  'button',
  'imagebutton',
  'link',
  'menuitem',
  'tab',
];
