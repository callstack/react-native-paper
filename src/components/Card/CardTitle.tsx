import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { MD3TypescaleKey, ThemeProp } from '../../types';
import Text from '../Typography/Text';
import Caption from '../Typography/v2/Caption';
import Title from '../Typography/v2/Title';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Text for the title. Note that this will only accept a string or `<Text>`-based node.
   */
  title: React.ReactNode;
  /**
   * Style for the title.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Number of lines for the title.
   */
  titleNumberOfLines?: number;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Title text variant defines appropriate text styles for type role and its size.
   * Available variants:
   *
   *  Display: `displayLarge`, `displayMedium`, `displaySmall`
   *
   *  Headline: `headlineLarge`, `headlineMedium`, `headlineSmall`
   *
   *  Title: `titleLarge`, `titleMedium`, `titleSmall`
   *
   *  Label:  `labelLarge`, `labelMedium`, `labelSmall`
   *
   *  Body: `bodyLarge`, `bodyMedium`, `bodySmall`
   */
  titleVariant?: keyof typeof MD3TypescaleKey;
  /**
   * Text for the subtitle. Note that this will only accept a string or `<Text>`-based node.
   */
  subtitle?: React.ReactNode;
  /**
   * Style for the subtitle.
   */
  subtitleStyle?: StyleProp<TextStyle>;
  /**
   * Number of lines for the subtitle.
   */
  subtitleNumberOfLines?: number;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Subtitle text variant defines appropriate text styles for type role and its size.
   * Available variants:
   *
   *  Display: `displayLarge`, `displayMedium`, `displaySmall`
   *
   *  Headline: `headlineLarge`, `headlineMedium`, `headlineSmall`
   *
   *  Title: `titleLarge`, `titleMedium`, `titleSmall`
   *
   *  Label:  `labelLarge`, `labelMedium`, `labelSmall`
   *
   *  Body: `bodyLarge`, `bodyMedium`, `bodySmall`
   */
  subtitleVariant?: keyof typeof MD3TypescaleKey;
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: { size: number }) => React.ReactNode;
  /**
   * Style for the left element wrapper.
   */
  leftStyle?: StyleProp<ViewStyle>;
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: { size: number }) => React.ReactNode;
  /**
   * Style for the right element wrapper.
   */
  rightStyle?: StyleProp<ViewStyle>;
  /**
   * @internal
   */
  index?: number;
  /**
   * @internal
   */
  total?: number;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * Specifies the largest possible scale a subtitle font can reach.
   */
  subtitleMaxFontSizeMultiplier?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

const LEFT_SIZE = 40;

/**
 * A component to show a title, subtitle and an avatar inside a Card.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar, Card, IconButton } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card.Title
 *     title="Card Title"
 *     subtitle="Card Subtitle"
 *     left={(props) => <Avatar.Icon {...props} icon="folder" />}
 *     right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */
const CardTitle = ({
  title,
  titleStyle,
  titleNumberOfLines = 1,
  titleVariant = 'bodyLarge',
  titleMaxFontSizeMultiplier,
  subtitle,
  subtitleStyle,
  subtitleNumberOfLines = 1,
  subtitleVariant = 'bodyMedium',
  subtitleMaxFontSizeMultiplier,
  left,
  leftStyle,
  right,
  rightStyle,
  style,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const TitleComponent = theme.isV3 ? Text : Title;
  const SubtitleComponent = theme.isV3 ? Text : Caption;

  const minHeight = subtitle || left || right ? 72 : 50;
  const marginBottom = subtitle ? 0 : 2;

  return (
    <View style={[styles.container, { minHeight }, style]}>
      {left ? (
        <View style={[styles.left, leftStyle]}>
          {left({
            size: LEFT_SIZE,
          })}
        </View>
      ) : null}

      <View style={[styles.titles]}>
        {title && (
          <TitleComponent
            style={[styles.title, { marginBottom }, titleStyle]}
            numberOfLines={titleNumberOfLines}
            variant={titleVariant}
            maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
          >
            {title}
          </TitleComponent>
        )}
        {subtitle && (
          <SubtitleComponent
            style={[styles.subtitle, subtitleStyle]}
            numberOfLines={subtitleNumberOfLines}
            variant={subtitleVariant}
            maxFontSizeMultiplier={subtitleMaxFontSizeMultiplier}
          >
            {subtitle}
          </SubtitleComponent>
        )}
      </View>
      <View style={rightStyle}>{right ? right({ size: 24 }) : null}</View>
    </View>
  );
};

CardTitle.displayName = 'Card.Title';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
  },

  left: {
    justifyContent: 'center',
    marginRight: 16,
    height: LEFT_SIZE,
    width: LEFT_SIZE,
  },

  titles: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  title: {
    minHeight: 30,
    paddingRight: 16,
  },

  subtitle: {
    minHeight: 20,
    marginVertical: 0,
    paddingRight: 16,
  },
});

export default CardTitle;

// @component-docs ignore-next-line
export { CardTitle };
