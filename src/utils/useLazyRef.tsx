import * as React from 'react';

export default function useLazyRef<T>(callback: () => T) {
  const lazyRef = React.useRef<T | undefined>(undefined);

  if (lazyRef.current === undefined) {
    lazyRef.current = callback();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return lazyRef as React.MutableRefObject<T>;
}
