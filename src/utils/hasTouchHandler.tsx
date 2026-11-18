import { Platform } from 'react-native';
import type {
  AccessibilityRole,
  AccessibilityState,
  GestureResponderEvent,
  Role,
} from 'react-native';

const touchableEvents = [
  'onPress',
  'onLongPress',
  'onPressIn',
  'onPressOut',
] as const;

type TouchableEventObject = Partial<
  Record<
    (typeof touchableEvents)[number],
    ((event: GestureResponderEvent) => void) | null
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
 * Roles, and the legacy `accessibilityRole` values `imagebutton` and
 * `togglebutton`, that claim the view can be activated. With no touch handler
 * and no toggle state (see `carriesToggleState`) the role becomes `none`, since
 * nothing would answer to it. Every other role, such as `checkbox`, `radio` or
 * `switch`, always stays.
 */
const ACTIVATABLE_ROLES: readonly string[] = [
  'button',
  'imagebutton',
  'link',
  'menuitem',
  'tab',
  'togglebutton',
];

// Roles react-native-web makes a tab stop unless `focusable` is false: `button`
// renders a real <button>, the rest get tabIndex 0. See react-native-web 0.21
// dist/modules/createDOMProps/index.js:369-381.
const WEB_TABBABLE_ROLES: readonly string[] = [
  'button',
  'checkbox',
  'link',
  'radio',
  'textbox',
  'switch',
];

// Roles that can't carry a selection on web. `none` is what a dropped role
// becomes, and a display-only IconButton or icon-only FAB is an image there.
const WEB_ROLES_WITHOUT_SELECTION: readonly string[] = [
  'none',
  'presentation',
  'img',
  'image',
];

/** The flags only a toggle passes. `false` counts: it says "off", not "none". */
type ToggleState = {
  'aria-checked'?: boolean | 'mixed';
  'aria-pressed'?: boolean;
  accessibilityState?: { checked?: boolean | 'mixed' };
};

/**
 * Whether the element is a toggle, so it keeps its role without a handler.
 * A selection is not a toggle state, so it doesn't keep the role.
 */
export function carriesToggleState(props: ToggleState) {
  return (
    props['aria-checked'] !== undefined ||
    props['aria-pressed'] !== undefined ||
    props.accessibilityState?.checked !== undefined
  );
}

type NonControlA11ySourceProps = ToggleState & {
  accessible?: boolean;
  screenReaderFocusable?: boolean;
  focusable?: boolean;
  role?: Role;
  accessibilityRole?: AccessibilityRole;
  'aria-selected'?: boolean;
  accessibilityState?: AccessibilityState;
};

/** What `getNonControlA11yProps` hands back, to be spread after the rest props. */
type NonControlA11yProps = {
  accessible: boolean;
  screenReaderFocusable?: boolean;
  collapsable?: boolean;
  role: Role | undefined;
  accessibilityRole?: undefined;
  focusable: boolean | undefined;
  'aria-selected'?: undefined;
  accessibilityState?: Omit<AccessibilityState, 'selected'>;
};

/**
 * Accessibility props for the plain `View` a touchable renders when it has
 * nothing to press; spread them after the rest props. The element and its
 * label stay, only the claims that stop being true go: an activatable role
 * (see `ACTIVATABLE_ROLES`), and on web a selection the remaining role can't
 * carry. Other states, such as `aria-expanded`, pass through unchanged.
 */
export function getNonControlA11yProps(
  props: NonControlA11ySourceProps
): NonControlA11yProps {
  // `role` wins over `accessibilityRole` on every platform
  const effectiveRole = props.role ?? props.accessibilityRole;
  const dropsRole =
    effectiveRole !== undefined &&
    ACTIVATABLE_ROLES.includes(effectiveRole) &&
    !carriesToggleState(props);
  const keptRole = dropsRole ? 'none' : effectiveRole;

  // Pressable defaults `accessible` to true, which keeps the element one unit
  // for screen readers, with its role and state.
  const isScreenReaderUnit = props.accessible !== false;
  const screenReaderFocusable =
    props.screenReaderFocusable ?? isScreenReaderUnit;

  const a11yProps: NonControlA11yProps = {
    // On Android `accessible` also makes the view keyboard focusable, so a
    // hardware keyboard or D-pad would stop on something with nothing to
    // activate. `screenReaderFocusable` keeps it one unit for TalkBack
    // (Android 9+) while keys skip it; only a consumer's `accessible` makes it
    // a stop. Unlike `accessible`, it doesn't stop Fabric from flattening the
    // children into the parent, so `collapsable: false` keeps them inside.
    accessible:
      Platform.OS === 'android'
        ? props.accessible === true
        : isScreenReaderUnit,
    ...(Platform.OS === 'android' && {
      screenReaderFocusable,
      ...(screenReaderFocusable && { collapsable: false }),
    }),
    role: dropsRole ? 'none' : props.role,
    // nothing to activate, so on web only a consumer makes this a tab stop
    focusable:
      props.focusable ??
      (keptRole !== undefined && WEB_TABBABLE_ROLES.includes(keptRole)
        ? false
        : undefined),
  };

  if (dropsRole) {
    // iOS (React Native 0.88+) reads role 'none' as no role and falls back to
    // accessibilityRole, so the legacy prop has to go too.
    a11yProps.accessibilityRole = undefined;
  }

  // On web a selection on role="presentation" or role="img" is invalid ARIA and
  // is ignored, so it goes. iOS (the Selected trait) and Android
  // (AccessibilityNodeInfo.isSelected) report it whatever the role, so it stays.
  if (
    Platform.OS === 'web' &&
    keptRole !== undefined &&
    WEB_ROLES_WITHOUT_SELECTION.includes(keptRole)
  ) {
    a11yProps['aria-selected'] = undefined;

    if (props.accessibilityState !== undefined) {
      const { selected: _selected, ...stateWithoutSelection } =
        props.accessibilityState;
      a11yProps.accessibilityState = stateWithoutSelection;
    }
  }

  return a11yProps;
}
