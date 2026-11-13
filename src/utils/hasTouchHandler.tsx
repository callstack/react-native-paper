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
 * Roles that claim the view can be activated. With no touch handler and no
 * toggle state (see `carriesToggleState`) such a role becomes `none`, since
 * nothing would answer to it. `checkbox`, `radio` and `switch` always keep it.
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

/** The flags only a toggle passes. `false` counts: it says "off", not "none". */
type ToggleState = {
  'aria-checked'?: boolean | 'mixed';
  'aria-pressed'?: boolean;
  accessibilityState?: { checked?: boolean | 'mixed' };
};

/**
 * Whether the element is a toggle, so it keeps its role without a handler.
 * A selection is not a toggle state: `aria-selected` and
 * `accessibilityState.selected` go with a dropped role, as a selection on a
 * presentational element is invalid ARIA and is not announced.
 */
function carriesToggleState(props: ToggleState) {
  return (
    props['aria-checked'] !== undefined ||
    props['aria-pressed'] !== undefined ||
    props.accessibilityState?.checked !== undefined
  );
}

type NonControlA11ySourceProps = ToggleState & {
  accessible?: boolean;
  focusable?: boolean;
  role?: Role;
  accessibilityRole?: AccessibilityRole;
  'aria-selected'?: boolean;
  accessibilityState?: AccessibilityState;
};

/** What `getNonControlA11yProps` hands back, to be spread after the rest props. */
type NonControlA11yProps = {
  accessible: boolean;
  role: Role | undefined;
  focusable: boolean | undefined;
  'aria-selected'?: undefined;
  accessibilityState?: Omit<AccessibilityState, 'selected'>;
};

/**
 * Accessibility props for the plain `View` a touchable renders when it has
 * nothing to press; spread them after the rest props. The element and its
 * label stay, only the claims that stop being true go.
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

  const a11yProps: NonControlA11yProps = {
    // Pressable defaults this to true; keep it so the role and state stay
    accessible: props.accessible !== false,
    role: dropsRole ? 'none' : props.role,
    // nothing to activate, so only a consumer makes this a tab stop
    focusable:
      props.focusable ??
      (keptRole !== undefined && WEB_TABBABLE_ROLES.includes(keptRole)
        ? false
        : undefined),
  };

  if (dropsRole) {
    a11yProps['aria-selected'] = undefined;

    if (props.accessibilityState !== undefined) {
      const { selected: _selected, ...stateWithoutSelection } =
        props.accessibilityState;
      a11yProps.accessibilityState = stateWithoutSelection;
    }
  }

  return a11yProps;
}
