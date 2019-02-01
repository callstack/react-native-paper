/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from '../../core/theming';
import Caption from './../Typography/Caption';
import Title from './../Typography/Title';
import AvatarIcon from './../Avatar/AvatarIcon';
import AvatarImage from './../Avatar/AvatarImage';
import AvatarText from './../Avatar/AvatarText';
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
   * Avatar of the title.
   */
  avatar?:
    | React.Element<AvatarIcon>
    | React.Element<AvatarImage>
    | React.Element<AvatarText>,
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
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Card } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card.Title title="Card Title" subtitle="Card Subtitle" avatar={<Avatar.Icon icon="folder" />} />
 * );
 *
 * export default MyComponent;
 * ```
 */
class CardTitle extends React.Component<Props> {
  static displayName = 'Card.Title';

  render() {
    const {
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  avatar: {
    justifyContent: 'center',
    marginRight: 16,
    height: 40,
  },

  titles: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
  },

  subtitle: {
    marginVertical: 0,
  },
});

export default withTheme(CardTitle);
