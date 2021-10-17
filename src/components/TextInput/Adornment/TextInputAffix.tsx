import React from 'react';
import color from 'color';
import {
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  LayoutChangeEvent,
  Animated,
  ViewStyle,
} from 'react-native';

import { withTheme } from '../../../core/theming';
import { AdornmentSide } from './enums';

const AFFIX_OFFSET = 12;

type Props = {
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
  theme: ReactNativePaper.Theme;
};

type ContextState = {
  topPosition: number | null;
  onLayout?: (event: LayoutChangeEvent) => void;
  visible?: Animated.Value;
  textStyle?: StyleProp<TextStyle>;
  side: AdornmentSide;
  paddingHorizontal?: number | string;
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
      }}
    >
      {affix}
    </AffixContext.Provider>
  );
};

/**
 * A component to render a leading / trailing text in the TextInput
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-outline.affix.png" />
 *   </figure>
 * </div>
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

const TextInputAffix = ({ text, textStyle: labelStyle, theme }: Props) => {
  const {
    textStyle,
    onLayout,
    topPosition,
    side,
    visible,
    paddingHorizontal,
  } = React.useContext(AffixContext);
  const textColor = color(theme.colors.text)
    .alpha(theme.dark ? 0.7 : 0.54)
    .rgb()
    .string();

  const offset =
    typeof paddingHorizontal === 'number' ? paddingHorizontal : AFFIX_OFFSET;

  const style = {
    top: topPosition,
    [side]: offset,
  } as ViewStyle;

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
      <Text style={[{ color: textColor }, textStyle, labelStyle]}>{text}</Text>
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
export { TextInputAffix, AffixAdornment };
