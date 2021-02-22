import color from 'color';
import * as React from 'react';
import { I18nManager, StyleProp, TextStyle, StyleSheet } from 'react-native';

import Text from './Text';
import { withTheme } from '../../core/theming';

type Props = React.ComponentProps<typeof Text> & {
  alpha: number;
  family: 'regular' | 'medium' | 'light' | 'thin';
  style?: StyleProp<TextStyle>;
  theme: ReactNativePaper.Theme;
};

const StyledText = ({ theme, alpha, family, style, ...rest }: Props) => {
  const textColor = color(theme.colors.text).alpha(alpha).rgb().string();
  const font = theme.fonts[family];
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  return (
    <Text
      {...rest}
      style={[
        styles.text,
        { color: textColor, ...font, writingDirection },
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

export default withTheme(StyledText);
