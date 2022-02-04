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
  const { isV3, md } = useTheme();

  if (isV3) {
    return (
      <Text
        variant={isSubheading ? 'body-large' : 'body-medium'}
        style={{ color: md('md.sys.color.on-surface-variant') as string }}
        {...props}
      />
    );
  } else if (isSubheading) {
    return <Subheading {...props} />;
  }
  return <Paragraph {...props} />;
};
