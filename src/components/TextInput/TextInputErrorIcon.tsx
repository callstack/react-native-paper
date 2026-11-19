import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { ACCESSORY_SIZE } from './constants';
import { getIconColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import Icon from '../Icon';

interface TextInputErrorIconProps {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  theme?: ThemeProp;
}

const TextInputErrorIcon = ({
  style: wrapperStyle,
  disabled = false,
  theme: themeOverride,
}: TextInputErrorIconProps) => {
  const theme = useInternalTheme(themeOverride);

  return (
    <View style={wrapperStyle} aria-hidden>
      <Icon
        source="alert-circle"
        size={ACCESSORY_SIZE}
        color={getIconColor({ theme, hasError: true, isDisabled: disabled })}
      />
    </View>
  );
};

export default TextInputErrorIcon;
