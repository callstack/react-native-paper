/* @flow */

import * as React from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Paper from '../Paper';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  /**
   * Resting elevation of the card which controls the drop shadow.
   */
  elevation?: number,
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
};

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
 * import {
 *   Button,
 *   Card,
 *   CardActions,
 *   CardContent,
 *   CardCover,
 *   Title,
 *   Paragraph
 * } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <CardContent>
 *       <Title>Card title</Title>
 *       <Paragraph>Card content</Paragraph>
 *     </CardContent>
 *     <CardCover source={{ uri: 'https://picsum.photos/700' }} />
 *     <CardActions>
 *       <Button>Cancel</Button>
 *       <Button>Ok</Button>
 *     </CardActions>
 *   </Card>
 * );
 * ```
 */
class Card extends React.Component<Props, State> {
  static defaultProps = {
    elevation: 2,
  };

  state = {
    /* $FlowFixMe: somehow default props are not respected */
    elevation: new Animated.Value(this.props.elevation),
  };

  _handlePressIn = () => {
    Animated.timing(this.state.elevation, {
      toValue: 8,
      duration: 200,
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
    const { children, onPress, style, theme } = this.props;
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
      <AnimatedPaper
        style={[styles.card, { borderRadius: roundness, elevation }, style]}
      >
        <TouchableWithoutFeedback
          delayPressIn={0}
          onPress={onPress}
          onPressIn={onPress ? this._handlePressIn : undefined}
          onPressOut={onPress ? this._handlePressOut : undefined}
          style={styles.container}
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
      </AnimatedPaper>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
  },
});

export default withTheme(Card);
