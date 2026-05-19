import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { ACCESSORY_SIZE } from './constants';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Icon from '../Icon';

interface TextFieldErrorIconProps {
  style?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
}

const TextFieldErrorIcon = ({
  style: wrapperStyle,
  theme: themeOverride,
}: TextFieldErrorIconProps) => {
  const theme = useInternalTheme(themeOverride);

  return (
    <View style={wrapperStyle} aria-hidden>
      <Icon
        source="alert-circle"
        size={ACCESSORY_SIZE}
        color={theme.colors.error}
      />
    </View>
  );
};

export default TextFieldErrorIcon;
