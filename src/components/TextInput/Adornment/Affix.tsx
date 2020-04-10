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
import { Theme } from '../../../types';
import { AdornmentSide } from './types';

const AFFIX_OFFSET = 12;

type Props = {
  text: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  /**
   * @optional
   */
  theme: Theme;
};

type ContextState = {
  affixTopPosition: number | null;
  onLayout?: (event: LayoutChangeEvent) => void;
  visible?: Animated.Value;
  textStyle?: StyleProp<TextStyle>;
  side: AdornmentSide;
};

const AffixContext = React.createContext<ContextState>({
  textStyle: { fontFamily: '', color: '' },
  affixTopPosition: null,
  side: AdornmentSide.Left,
});

export const AffixAdornment: React.FunctionComponent<{
  affix: React.ReactNode;
} & ContextState> = ({
  affix,
  side,
  textStyle,
  affixTopPosition,
  onLayout,
  visible,
}) => {
  return (
    <AffixContext.Provider
      value={{
        side,
        textStyle,
        affixTopPosition,
        onLayout,
        visible,
      }}
    >
      {affix}
    </AffixContext.Provider>
  );
};

const TextInputAffix = ({ text, theme }: Props) => {
  const {
    textStyle,
    onLayout,
    affixTopPosition,
    side,
    visible,
  } = React.useContext(AffixContext);
  const textColor = color(theme.colors.text)
    .alpha(theme.dark ? 0.7 : 0.54)
    .rgb()
    .string();

  const style = {
    top: affixTopPosition,
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
