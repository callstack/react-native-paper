import * as React from 'react';

import {
  Paragraph,
  Subheading,
  Text as NativeText,
  Text,
} from 'react-native-paper';

import { useExampleTheme } from '../..';

type Props = React.ComponentProps<typeof NativeText> & {
  isSubheading?: boolean;
};

export const TextComponent = ({ isSubheading = false, ...props }: Props) => {
  const theme = useExampleTheme();

  if (theme.isV3) {
    return (
      <Text
        variant={isSubheading ? 'bodyLarge' : 'bodyMedium'}
        style={{ color: theme.colors.onSurfaceVariant }}
        {...props}
      />
    );
  } else if (isSubheading) {
    return <Subheading {...props} />;
  }
  return <Paragraph {...props} />;
};
