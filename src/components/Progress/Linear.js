/* @flow */

import React, {
  PureComponent,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  View,
} from 'react-native';

import { blueA200, blue100 } from '../../styles/colors';

const roundProgress = (progress: ?number): number => Math.min(Math.max((progress || 0), 0), 1);

type Props = {
  color: string;
  emptyColor: string;
  indeterminate: boolean;
  indeterminateWidth: number;
  progress: number;
  style?: any;
}

type State = {
  animationValue: Animated.Value;
  progressAnimationValue: Animated.Value;
  defaultBarXPosition: number;
  width: number;
  height: number;
}

/**
 * Progress is visual indication of loading content.
 *
 * **Usage:**
 * ```
 * const MyComponent = () => (
 *  <Progress.Linear progress={0.2} />
 * );
 * ```
 */
class Linear extends PureComponent<any, Props, State> {
  static propTypes = {
    /**
     * Color of complete bar.
     */
    color: PropTypes.string,
    /**
     * Color of incomplete bar.
     */
    emptyColor: PropTypes.string,
    /**
     * Used for visualizing an unspecified wait time.
     */
    indeterminate: PropTypes.bool,
    /**
     * Width of indeterminate active bar. Rounded to match 0-1 range.
     */
    indeterminateWidth: PropTypes.number,
    /**
     * Progress of loaded content. Rounded to match 0-1 range.
     */
    progress: PropTypes.number,
    style: View.propTypes.style,
  };

  static defaultProps: Props = {
    color: blueA200,
    emptyColor: blue100,
    indeterminate: false,
    indeterminateWidth: 0.3,
    progress: 0,
  };

  constructor(props: Props) {
    super(props);

    const progress: number = roundProgress(props.progress);
    const indeterminateWidth: number = roundProgress(props.indeterminateWidth);
    /* $FlowFixMe */
    const defaultBarXPosition = indeterminateWidth / (1 + indeterminateWidth);

    this.state = {
      progressAnimationValue: new Animated.Value(props.indeterminate ? indeterminateWidth : progress),
      animationValue: new Animated.Value(defaultBarXPosition),
      defaultBarXPosition,
      width: 0,
      height: 0,
    };
  }

  state: State;

  componentDidMount() {
    if (this.props.indeterminate) {
      this._startAnimation();
    }
  }

  componentWillReceiveProps(props: Props) {
    const hasIndeterminateChanged = props.indeterminate !== this.props.indeterminate;
    const hasProgressChanged = props.progress !== this.props.progress;

    if (hasIndeterminateChanged) {
      if (props.indeterminate) {
        this._startAnimation();
      } else {
        Animated.spring(this.state.animationValue, {
          toValue: this.state.defaultBarXPosition,
        }).start();
      }
    }

    if (hasIndeterminateChanged || hasProgressChanged) {
      const progress = roundProgress(props.indeterminate ? props.indeterminateWidth : props.progress);

      Animated.spring(this.state.progressAnimationValue, {
        toValue: progress,
        bounciness: 0,
      }).start();
    }
  }

  _startAnimation = () => {
    this.state.animationValue.setValue(0);

    Animated.timing(this.state.animationValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.linear,
      isInteraction: false,
    }).start((animationState) => {
      if (animationState.finished) {
        this._startAnimation();
      }
    });
  }

  _setDimensions = (event) => {
    const { width, height } = event.nativeEvent.layout;
    this.setState({ width, height });
  }

  render() {
    const {
      color,
      style,
      emptyColor,
      indeterminateWidth,
      ...otherProps
    } = this.props;

    const { width, height } = this.state;

    const progressBar = {
      backgroundColor: color,
      height,
      width: this.state.progressAnimationValue.interpolate({
        inputRange: [ 0, 1 ],
        outputRange: [ 0, width ],
      }),
      transform: [
        {
          translateX: this.state.animationValue.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ width * -roundProgress(indeterminateWidth), width ],
          }),
        },
      ],
    };

    return (
      <View
        onLayout={this._setDimensions}
        style={[ styles.container, { backgroundColor: emptyColor }, style ]}
        {...otherProps}
      >
        <Animated.View style={progressBar} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Linear;
