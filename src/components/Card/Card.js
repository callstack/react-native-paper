/* @flow */

import * as React from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import CardContent from './CardContent';
import CardActions from './CardActions';
import CardCover from './CardCover';
import Surface from '../Surface';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof Surface> & {|
  /**
   * Resting elevation of the card which controls the drop shadow.
   */
  elevation?: number,
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => mixed,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Content of the `Card`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

type State = {
  elevation: Animated.Value,
};

/**
 * A card is a sheet of material that serves as an entry point to more detailed information.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/card-1.png" />
 *   <img class="medium" src="screenshots/card-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button, Card, Title, Paragraph } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Content>
 *       <Title>Card title</Title>
 *       <Paragraph>Card content</Paragraph>
 *     </Card.Content>
 *     <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
 *     <Card.Actions>
 *       <Button>Cancel</Button>
 *       <Button>Ok</Button>
 *     </Card.Actions>
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 */
class Card extends React.Component<Props, State> {
  // @component ./CardContent.js
  static Content = CardContent;
  // @component ./CardActions.js
  static Actions = CardActions;
  // @component ./CardCover.js
  static Cover = CardCover;

  static defaultProps = {
    elevation: 1,
  };

  state = {
    /* $FlowFixMe: somehow default props are not respected */
    elevation: new Animated.Value(this.props.elevation),
  };

  _handlePressIn = () => {
    Animated.timing(this.state.elevation, {
      toValue: 8,
      duration: 150,
    }).start();
  };

  _handlePressOut = () => {
    Animated.timing(this.state.elevation, {
      /* $FlowFixMe: somehow default props are not respected */
      toValue: this.props.elevation,
      duration: 150,
    }).start();
  };

  render() {
    const {
      children,
      elevation: cardElevation,
      onLongPress,
      onPress,
      style,
      theme,
      ...rest
    } = this.props;
    const { elevation } = this.state;
    const { roundness } = theme;
    const total = React.Children.count(children);
    const siblings = React.Children.map(
      children,
      child =>
        React.isValidElement(child) && child.type
          ? child.type.displayName
          : null
    );
    return (
      <Surface
        style={[{ borderRadius: roundness, elevation }, style]}
        {...rest}
      >
        <TouchableWithoutFeedback
          delayPressIn={0}
          disabled={!(onPress || onLongPress)}
          onLongPress={onLongPress}
          onPress={onPress}
          onPressIn={onPress ? this._handlePressIn : undefined}
          onPressOut={onPress ? this._handlePressOut : undefined}
        >
          <View style={styles.innerContainer}>
            {React.Children.map(
              children,
              (child, index) =>
                React.isValidElement(child)
                  ? React.cloneElement(child, {
                      index,
                      total,
                      siblings,
                    })
                  : child
            )}
          </View>
        </TouchableWithoutFeedback>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  innerContainer: {
    flexGrow: 1,
  },
});

export default withTheme(Card);
