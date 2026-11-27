import * as React from 'react';

/**
 * Returns `children` as an array in which every fragment is replaced by its
 * own children, so components that clone their children to pass props reach
 * the actual elements instead of the fragment, which only accepts `key` and
 * `children`. Keys of nested elements are prefixed with the fragment key to
 * keep them unique.
 */
export default function flattenChildren(
  children: React.ReactNode,
  keyPrefix = ''
): React.ReactNode[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return [child];
    }

    if (child.type === React.Fragment) {
      return flattenChildren(child.props.children, `${keyPrefix}${child.key}`);
    }

    return keyPrefix
      ? [React.cloneElement(child, { key: `${keyPrefix}${child.key}` })]
      : [child];
  });
}
