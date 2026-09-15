import * as React from 'react';

import { NavigationRailTokens } from './tokens';

/**
 * Expansion state of the enclosing rail. Items read `expanded` to switch
 * layouts, `expandedWidth` to size the row label once (so text is not
 * re-measured while the rail width animates) and `animated` to skip motion.
 */
export const NavigationRailContext = React.createContext<{
  expanded: boolean;
  expandedWidth: number;
  animated: boolean;
}>({
  expanded: false,
  expandedWidth: NavigationRailTokens.rail.expandedMinWidth,
  animated: true,
});
