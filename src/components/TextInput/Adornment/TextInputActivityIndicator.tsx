import React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  ActivityIndicator as RNActivityIndicator,
} from 'react-native';

import { getIconColor } from './utils';
import { useInternalTheme } from '../../../core/theming';
import { $Omit, ThemeProp } from '../../../types';
import ActivityIndicator from '../../ActivityIndicator';
import { Props as ActivityIndicatorProps } from '../../ActivityIndicator';
import { ICON_SIZE } from '../constants';
import { getConstants } from '../helpers';

export type Props = $Omit<
  ActivityIndicatorProps,
  'size' | 'hidesWhenStopped'
> & {
  /**
   * When true, the loading indicator will be the React Native default ActivityIndicator.
   */
  useNativeActivityIndicator?: boolean;
};

type StyleContextType = {
  style: StyleProp<ViewStyle>;
  isTextInputFocused: boolean;
  testID: string;
  disabled?: boolean;
};

const StyleContext = React.createContext<StyleContextType>({
  style: {},
  isTextInputFocused: false,
  testID: '',
});

const ActivityIndicatorAdornment: React.FunctionComponent<
  {
    testID: string;
    indicator: React.ReactNode;
    topPosition: number;
    side: 'left' | 'right';
    theme?: ThemeProp;
    disabled?: boolean;
    useNativeActivityIndicator?: boolean;
  } & Omit<StyleContextType, 'style'>
> = ({
  indicator,
  topPosition,
  side,
  isTextInputFocused,
  testID,
  theme: themeOverrides,
  disabled,
}) => {
  const { isV3 } = useInternalTheme(themeOverrides);
  const { ICON_OFFSET } = getConstants(isV3);

  const style: StyleProp<ViewStyle> = {
    top: topPosition,
    [side]: ICON_OFFSET,
  };
  const contextState = {
    style,
    isTextInputFocused,
    side,
    testID,
    disabled,
  };

  return (
    <StyleContext.Provider value={contextState}>
      {indicator}
    </StyleContext.Provider>
  );
};

const TextInputActivityIndicator = ({
  useNativeActivityIndicator,
  color: customColor,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const { style, isTextInputFocused, testID, disabled } =
    React.useContext(StyleContext);

  const theme = useInternalTheme(themeOverrides);

  const indicatorColor = getIconColor({
    theme,
    disabled,
    isTextInputFocused,
    customColor,
  });

  return (
    <View style={[styles.container, style]}>
      {useNativeActivityIndicator ? (
        <RNActivityIndicator color={indicatorColor} testID={testID} {...rest} />
      ) : (
        <ActivityIndicator {...rest} color={indicatorColor} testID={testID} />
      )}
    </View>
  );
};

TextInputActivityIndicator.displayName = 'TextInput.ActivityIndicator';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextInputActivityIndicator;

// @component-docs ignore-next-line
export { ActivityIndicatorAdornment };
