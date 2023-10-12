import React from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { AdornmentSide } from './enums';
import { getTextColor } from './utils';
import { useInternalTheme } from '../../../core/theming';
import type { ThemeProp } from '../../../types';
import { getConstants } from '../helpers';

export type Props = {
  /**
   * Text to show.
   */
  text: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  /**
   * Style that is passed to the Text element.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

type ContextState = {
  topPosition: number | null;
  onLayout?: (event: LayoutChangeEvent) => void;
  visible?: Animated.Value;
  textStyle?: StyleProp<TextStyle>;
  side: AdornmentSide;
  paddingHorizontal?: number | string;
  maxFontSizeMultiplier?: number | undefined | null;
  testID?: string;
  disabled?: boolean;
};

const AffixContext = React.createContext<ContextState>({
  textStyle: { fontFamily: '', color: '' },
  topPosition: null,
  side: AdornmentSide.Left,
});

const AffixAdornment: React.FunctionComponent<
  {
    affix: React.ReactNode;
    testID: string;
  } & ContextState
> = ({
  affix,
  side,
  textStyle,
  topPosition,
  onLayout,
  visible,
  paddingHorizontal,
  maxFontSizeMultiplier,
  testID,
  disabled,
}) => {
  return (
    <AffixContext.Provider
      value={{
        side,
        textStyle,
        topPosition,
        onLayout,
        visible,
        paddingHorizontal,
        maxFontSizeMultiplier,
        testID,
        disabled,
      }}
    >
      {affix}
    </AffixContext.Provider>
  );
};

/**
 * A component to render a leading / trailing text in the TextInput
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   return (
 *     <TextInput
 *       mode="outlined"
 *       label="Outlined input"
 *       placeholder="Type something"
 *       right={<TextInput.Affix text="/100" />}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */

const TextInputAffix = ({
  text,
  textStyle: labelStyle,
  theme: themeOverrides,
  onLayout: onTextLayout,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { AFFIX_OFFSET } = getConstants(theme.isV3);

  const {
    textStyle,
    onLayout,
    topPosition,
    side,
    visible,
    paddingHorizontal,
    maxFontSizeMultiplier,
    testID,
    disabled,
  } = React.useContext(AffixContext);

  const offset =
    typeof paddingHorizontal === 'number' ? paddingHorizontal : AFFIX_OFFSET;

  const style = {
    top: topPosition,
    [side]: offset,
  } as ViewStyle;

  const textColor = getTextColor({ theme, disabled });

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
      testID={testID}
    >
      <Text
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        style={[{ color: textColor }, textStyle, labelStyle]}
        onLayout={onTextLayout}
        testID={`${testID}-text`}
      >
        {text}
      </Text>
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

export default TextInputAffix;

// @component-docs ignore-next-line
export { TextInputAffix, AffixAdornment };
