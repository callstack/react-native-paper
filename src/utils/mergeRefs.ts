import type * as React from 'react';

/** Feeds a node to every ref, so an internal ref doesn't drop the consumer's. */
export const mergeRefs =
  <T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> =>
  (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
