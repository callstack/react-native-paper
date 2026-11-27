import * as React from 'react';
import { Platform, View } from 'react-native';
import type { ViewProps } from 'react-native';

import { PortalInertContext } from './PortalInertContext';

export type Props = ViewProps & {
  inert: boolean;
};

export default function PortalLayer({ inert, children, ...rest }: Props) {
  // A `Portal.Host` nested in a layer behind a modal is behind it too.
  const isInsideInertLayer = React.useContext(PortalInertContext);

  return (
    <View
      aria-hidden={inert || undefined}
      // @ts-expect-error: `ViewProps` doesn't expose the web-specific `inert` prop.
      inert={Platform.OS === 'web' ? inert || undefined : undefined}
      {...rest}
    >
      <PortalInertContext.Provider value={isInsideInertLayer || inert}>
        {children}
      </PortalInertContext.Provider>
    </View>
  );
}
