import { Platform, View } from 'react-native';
import type { ViewProps } from 'react-native';

export type Props = ViewProps & {
  /**
   * Whether this layer sits below an overlay, and so should be unreachable by
   * a screen reader and by the focus order.
   */
  inert: boolean | undefined;
};

/**
 * `display: contents` so the extra node generates no box of its own. The
 * layer's `flex` / `absoluteFill` styles and the child rule that
 * `pointerEvents="box-none"` compiles to both keep working through it.
 */
const INERT_WRAPPER_STYLE = { display: 'contents' } as const;

export default function OverlayLayer({ inert, children, ...rest }: Props) {
  const layer = (
    <View aria-hidden={inert || undefined} {...rest}>
      {children}
    </View>
  );

  return Platform.OS === 'web' ? (
    <div inert={inert || undefined} style={INERT_WRAPPER_STYLE}>
      {layer}
    </div>
  ) : (
    layer
  );
}
