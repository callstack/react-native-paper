import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

import color from 'color';
import type { ThemeProp } from 'src/types';

import Text from './Text';
import { useInternalTheme } from '../../../core/theming';

type Props = React.ComponentProps<typeof Text> & {
  alpha?: number;
  family: 'regular' | 'medium' | 'light' | 'thin';
  style?: StyleProp<TextStyle>;
  theme?: ThemeProp;
};

const StyledText = ({
  alpha = 1,
  family,
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const textColor = color(
    theme.isV3 ? theme.colors.onSurface : theme.colors?.text
  )
    .alpha(alpha)
    .rgb()
    .string();

  return (
    <Text
      {...rest}
      style={[
        styles.text,
        {
          color: textColor,
          ...(!theme.isV3 && theme.fonts?.[family]),
          writingDirection: theme.direction,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default StyledText;
