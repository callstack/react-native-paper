/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from '../../core/theming';
import Caption from './../Typography/Caption';
import Title from './../Typography/Title';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof View> & {|
  /**
   * Text for the title.
   */
  title: React.Node,
  /**
   * Style for the title.
   */
  titleStyle?: any,
  /**
   * Text for the subtitle.
   */
  subtitle?: React.Node,
  /**
   * Style for the subtitle.
   */
  subtitleStyle?: any,
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: { size: number }) => React.Node,
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: { size: number }) => React.Node,
  /**
   * @internal
   */
  index?: number,
  /**
   * @internal
   */
  total?: number,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

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
class CardTitle extends React.Component<Props> {
  static displayName = 'Card.Title';

  render() {
    const {
      left,
      right,
      subtitle,
      subtitleStyle,
      style,
      title,
      titleStyle,
    } = this.props;

    return (
      <View
        style={[
          styles.container,
          { height: subtitle || left || right ? 72 : 50 },
          style,
        ]}
      >
        {left ? (
          <View style={[styles.left]}>
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
              numberOfLines={1}
            >
              {title}
            </Title>
          ) : null}

          {subtitle ? (
            <Caption style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
              {subtitle}
            </Caption>
          ) : null}
        </View>

        <View>{right ? right({ size: 24 }) : null}</View>
      </View>
    );
  }
}

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
    height: 50,
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
