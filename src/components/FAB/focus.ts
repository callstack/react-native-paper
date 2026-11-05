import { AccessibilityInfo, findNodeHandle, Platform } from 'react-native';
import type { View } from 'react-native';

import { focusFirstDOMNode } from '../../utils/focusFirstDOMNode';

/**
 * Moves keyboard focus (web) or screen reader focus (native) to the node.
 */
export const focusNode = (
  node: View | null | undefined,
  options?: FocusOptions
) => {
  if (!node) {
    return;
  }

  if (Platform.OS === 'web') {
    focusFirstDOMNode(node, options);
    return;
  }

  const handle = findNodeHandle(node);

  if (handle != null) {
    AccessibilityInfo.setAccessibilityFocus(handle);
  }
};
