import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { withTheme } from '../../core/theming';
import Caption from './../Typography/Caption';
import Title from './../Typography/Title';

type Props = React.ComponentPropsWithRef<typeof View> & {
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
  theme: ReactNativePaper.Theme;
};

const LEFT_SIZE = 40;

/**
 * A component to show a title, subtitle and an avatar inside a Card.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/card-title-1.png" />
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
  subtitle,
  subtitleStyle,
  subtitleNumberOfLines = 1,
  left,
  leftStyle,
  right,
  rightStyle,
  style,
}: Props) => {
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
        {title ? (
          <Title
            style={[
              styles.title,
              { marginBottom: subtitle ? 0 : 2 },
              titleStyle,
            ]}
            numberOfLines={titleNumberOfLines}
          >
            {title}
          </Title>
        ) : null}

        {subtitle ? (
          <Caption
            style={[styles.subtitle, subtitleStyle]}
            numberOfLines={subtitleNumberOfLines}
          >
            {subtitle}
          </Caption>
        ) : null}
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
  },

  subtitle: {
    minHeight: 20,
    marginVertical: 0,
  },
});

export default withTheme(CardTitle);

// @component-docs ignore-next-line
export { CardTitle };
