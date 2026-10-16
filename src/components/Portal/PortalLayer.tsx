import { Platform, View } from 'react-native';
import type { ViewProps } from 'react-native';

export type Props = ViewProps & {
  inert: boolean;
};

export default function PortalLayer({ inert, children, ...rest }: Props) {
  return (
    <View
      aria-hidden={inert || undefined}
      // @ts-expect-error: `ViewProps` doesn't expose the web-specific `inert` prop.
      inert={Platform.OS === 'web' ? inert || undefined : undefined}
      {...rest}
    >
      {children}
    </View>
  );
}
