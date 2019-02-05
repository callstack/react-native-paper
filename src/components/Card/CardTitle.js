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
   * Avatar that will be displayed close to the title.
   */
  avatar?: React.Element<*>,
  /**
   * Content that will be used to trigger an action (e.g., expand or overflow menu).
   */
  action?: React.Element<*>,
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
 *     avatar={<Avatar.Icon icon="folder" />}
 *     action={<IconButton icon="more-vert" onPress={() => {}} />}
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
      action,
      avatar,
      subtitle,
      subtitleStyle,
      style,
      title,
      titleStyle,
    } = this.props;

    return (
      <View style={[styles.container, { height: subtitle ? 72 : 50 }, style]}>
        {avatar ? (
          <View style={[styles.avatar]}>
            {React.cloneElement(avatar, {
              size: 40,
            })}
          </View>
        ) : null}

        <View style={[styles.titles]}>
          {title ? (
            <Title style={[{ marginBottom: subtitle ? 0 : 2 }, titleStyle]}>
              {title}
            </Title>
          ) : null}

          {subtitle ? (
            <Caption style={[styles.subtitle, subtitleStyle]}>
              {subtitle}
            </Caption>
          ) : null}
        </View>

        <View>{action}</View>
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

  avatar: {
    justifyContent: 'center',
    marginRight: 16,
    height: 40,
  },

  titles: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
  },

  subtitle: {
    marginVertical: 0,
  },
});

export default withTheme(CardTitle);
