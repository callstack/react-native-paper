import { Platform } from 'react-native';

/**
 * How a drawer destination exposes that it is the active one.
 *
 * Destinations are buttons, not tabs: a drawer has no `tablist` around them,
 * and its sections don't behave like one (no arrow-key navigation). On iOS
 * and Android a selected button is announced as selected. On web
 * `aria-selected` isn't allowed on a button, so the active destination is
 * marked as the current page instead, as in a navigation menu.
 */
export const getDestinationA11yProps = (active: boolean | undefined) =>
  Platform.OS === 'web'
    ? { 'aria-current': active ? ('page' as const) : undefined }
    : { 'aria-selected': active };
