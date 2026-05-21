import * as React from 'react';

import { Text, Text as NativeText, useTheme } from 'react-native-paper';
type Props = React.ComponentProps<typeof NativeText> & {
  isSubheading?: boolean;
};

export const TextComponent = ({ isSubheading = false, ...props }: Props) => {
  const theme = useTheme();

  return (
    <Text
      variant={isSubheading ? 'bodyLarge' : 'bodyMedium'}
      style={{ color: theme.colors.onSurfaceVariant }}
      {...props}
    />
  );
};
