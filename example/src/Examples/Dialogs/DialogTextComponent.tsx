import * as React from 'react';

import { Text as NativeText, Text } from 'react-native-paper';

import { useExampleTheme } from '../../hooks/useExampleTheme';

type Props = React.ComponentProps<typeof NativeText> & {
  isSubheading?: boolean;
};

export const TextComponent = ({ isSubheading = false, ...props }: Props) => {
  const theme = useExampleTheme();

  return (
    <Text
      variant={isSubheading ? 'bodyLarge' : 'bodyMedium'}
      style={{ color: theme.colors.onSurfaceVariant }}
      {...props}
    />
  );
};
