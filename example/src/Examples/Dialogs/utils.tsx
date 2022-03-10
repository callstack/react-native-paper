import * as React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import {
  Paragraph,
  Text,
  Text as NativeText,
  useTheme,
  Subheading,
} from 'react-native-paper';
import type { MD3TypescaleKey } from '../../../../src/types';

type Props = React.ComponentProps<typeof NativeText> & {
  style?: StyleProp<TextStyle>;
  variant?: keyof typeof MD3TypescaleKey;
  children: React.ReactNode;
  isSubheading?: boolean;
};

export const TextComponent = ({ isSubheading = false, ...props }: Props) => {
  const theme = useTheme();

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
