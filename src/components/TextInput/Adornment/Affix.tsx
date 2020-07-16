import React from 'react';
import color from 'color';
import {
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  LayoutChangeEvent,
  Animated,
} from 'react-native';

import { withTheme } from '../../../core/theming';
import { AdornmentSide } from './enums';

const AFFIX_OFFSET = 12;

type Props = {
  text: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

type ContextState = {
  topPosition: number | null;
  onLayout?: (event: LayoutChangeEvent) => void;
  visible?: Animated.Value;
  textStyle?: StyleProp<TextStyle>;
  side: AdornmentSide;
};

const AffixContext = React.createContext<ContextState>({
  textStyle: { fontFamily: '', color: '' },
  topPosition: null,
  side: AdornmentSide.Left,
});

export const AffixAdornment: React.FunctionComponent<
  {
    affix: React.ReactNode;
    testID: string;
  } & ContextState
> = ({ affix, side, textStyle, topPosition, onLayout, visible }) => {
  return (
    <AffixContext.Provider
      value={{
        side,
        textStyle,
        topPosition,
        onLayout,
        visible,
      }}
    >
      {affix}
    </AffixContext.Provider>
  );
};

const TextInputAffix = ({ text, theme }: Props) => {
  const { textStyle, onLayout, topPosition, side, visible } = React.useContext(
    AffixContext
  );
  const textColor = color(theme.colors.text)
    .alpha(theme.dark ? 0.7 : 0.54)
    .rgb()
    .string();

  const style = {
    top: topPosition,
    [side]: AFFIX_OFFSET,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity:
            visible?.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }) || 1,
        },
      ]}
      onLayout={onLayout}
    >
      <Text style={[{ color: textColor }, textStyle]}>{text}</Text>
    </Animated.View>
  );
};
TextInputAffix.displayName = 'TextInput.Affix';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(TextInputAffix);

// @component-docs ignore-next-line
export { TextInputAffix };
