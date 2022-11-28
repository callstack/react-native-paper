import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { InternalTheme, MD3TypescaleKey } from '../../types';
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
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
};

const LEFT_SIZE = 40;

/**
 * A component to show a title, subtitle and an avatar inside a Card.
 *
 * <div class="screenshots">
 *   <img class="small" src="screenshots/card-title-1.png" />
 * </div>
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
 *     right={(props) => <IconButton {...props} icon="more-vert" onPress={() => {}} />}
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
  subtitle,
  subtitleStyle,
  subtitleNumberOfLines = 1,
  subtitleVariant = 'bodyMedium',
  left,
  leftStyle,
  right,
  rightStyle,
  style,
  theme,
}: Props) => {
  const titleComponent = (props: any) =>
    theme.isV3 ? <Text {...props} /> : <Title {...props} />;

  const subtitleComponent = (props: any) =>
    theme.isV3 ? <Text {...props} /> : <Caption {...props} />;

  const TextComponent = React.memo(({ component, ...rest }: any) =>
    React.createElement(component, rest)
  );
  return (
    <View
      style={[
        styles.container,
        { minHeight: subtitle || left || right ? 72 : 50 },
        style,
      ]}
    >
      {left ? (
        <View style={[styles.left, leftStyle]}>
          {left({
            size: LEFT_SIZE,
          })}
        </View>
      ) : null}

      <View style={[styles.titles]}>
        {title && (
          <TextComponent
            component={titleComponent}
            style={[
              styles.title,
              { marginBottom: subtitle ? 0 : 2 },
              titleStyle,
            ]}
            numberOfLines={titleNumberOfLines}
            variant={titleVariant}
          >
            {title}
          </TextComponent>
        )}
        {subtitle && (
          <TextComponent
            component={subtitleComponent}
            style={[styles.subtitle, subtitleStyle]}
            numberOfLines={subtitleNumberOfLines}
            variant={subtitleVariant}
          >
            {subtitle}
          </TextComponent>
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

export default withInternalTheme(CardTitle);

// @component-docs ignore-next-line
export { CardTitle };
