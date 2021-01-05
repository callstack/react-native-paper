import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';

export default function useLayout() {
  const [layout, setLayout] = React.useState<{
    height: number;
    width: number;
    measured: boolean;
  }>({ height: 0, width: 0, measured: false });

  const onLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const { height, width } = e.nativeEvent.layout;

      if (height === layout.height && width === layout.width) {
        return;
      }

      setLayout({
        height,
        width,
        measured: true,
      });
    },
    [layout.height, layout.width]
  );

  return [layout, onLayout] as const;
}
