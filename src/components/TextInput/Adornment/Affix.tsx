import React from 'react';
import color from 'color';
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  Animated,
} from 'react-native';

import { withTheme } from '../../../core/theming';
import { Theme } from '../../../types';

/** Probably those arbitrary MD-guidelines values Trens was talking about */
const AFFIX_OFFSET = 12;

type Props = {
  text: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  visible?: Animated.Value;
  /**
   * @optional
   */
  theme: Theme;
};

/** What does it do? - some cloning, but of what? */
export function renderAffix({
  affix,
  /** Side? */
  side,
  textStyle,
  affixTopPosition,
  onLayout,
  visible,
}: {
  /** Ok, so the affix is expected to be of type of React node */
  affix: React.ReactNode;
  side: 'left' | 'right';
  textStyle: StyleProp<TextStyle>;
  affixTopPosition: number | null;
  onLayout?: (event: LayoutChangeEvent) => void;
  visible?: Animated.Value;
}): React.ReactNode {
  /** So, in my API, I accept the affix as the React Element, then I proceed to clone it, but why? */
  /** It appears I accept some React Element to be displayed in my TextField, but then I must somehow impose my own styling over it, for it needs to be properly placed within the input */
  return React.cloneElement(
    //@ts-ignore
    affix,
    /** props */
    {
      style: {
        top: affixTopPosition,
        [side]: AFFIX_OFFSET,
      },
      textStyle,
      onLayout,
      visible,
    }
  );
}

const TextInputAffix = ({
  text,
  style,
  textStyle,
  onLayout,
  theme,
  visible,
}: Props) => {
  /** Handle theme settings */
  const textColor = color(theme.colors.text)
    .alpha(theme.dark ? 0.7 : 0.54)
    .rgb()
    .string();

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
