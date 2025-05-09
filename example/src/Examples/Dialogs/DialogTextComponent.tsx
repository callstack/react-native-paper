import * as React from 'react';

import { Text as NativeText, Text, useTheme } from 'react-native-paper';

type Props = React.ComponentProps<typeof NativeText> & {
  isSubheading?: boolean;
};

export const TextComponent = ({ isSubheading = false, ...props }: Props) => {
  const { colors } = useTheme();

  return (
    <Text
      variant={isSubheading ? 'bodyLarge' : 'bodyMedium'}
      style={{ color: colors.onSurfaceVariant }}
      {...props}
    />
  );
};
