/* @flow */

import color from 'color';
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
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

/* Rounds progress to match value between 0 and 1. */
const roundProgress = (progress: ?number): number => Math.min(Math.max((progress || 0), 0), 1);
const indeterminateWidth = 0.4;

type Props = {
  color: string;
  indeterminate: boolean;
  progress: number;
  visible: boolean;
  style?: any;
  theme: Theme;
}

type State = {
  indeterminateAnimationValue: Animated.Value;
  progressAnimationValue: Animated.Value;
  visibleAnimationValue: Animated.Value;
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
     * Used for visualizing an unspecified wait time.
     */
    indeterminate: PropTypes.bool,
    /**
     * Progress of loaded content. Rounded to match 0-1 range.
     */
    progress: PropTypes.number,
    /**
     * Determines if component is visible.
     */
    visible: PropTypes.bool,
    style: View.propTypes.style,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    indeterminate: false,
    progress: 0,
    visible: true,
  };

  constructor(props: Props) {
    super(props);
    const progress: number = roundProgress(props.progress);
    const defaultBarXPosition = indeterminateWidth / (1 + indeterminateWidth);

    this.state = {
      progressAnimationValue: new Animated.Value(props.indeterminate ? indeterminateWidth : progress),
      indeterminateAnimationValue: new Animated.Value(defaultBarXPosition),
      visibleAnimationValue: new Animated.Value(0),
      defaultBarXPosition,
      width: 0,
      height: 0,
    };
  }

  state: State;

  componentDidMount() {
    if (this.props.indeterminate) {
      this._startIndeterminateAnimation();
    }

    if (this.props.visible) {
      Animated.spring(this.state.visibleAnimationValue, {
        toValue: 1,
      }).start();
    }
  }

  componentWillReceiveProps(props: Props) {
    const hasIndeterminateChanged = props.indeterminate !== this.props.indeterminate;
    const hasProgressChanged = props.progress !== this.props.progress;
    const hasVisiblityChanged = props.visible !== this.props.visible;

    if (hasVisiblityChanged) {
      Animated.spring(this.state.visibleAnimationValue, {
        toValue: props.visible ? 1 : 0,
        bounciness: 0,
      }).start();
    }

    if (hasIndeterminateChanged) {
      if (props.indeterminate) {
        this._startIndeterminateAnimation();
      } else {
        Animated.spring(this.state.indeterminateAnimationValue, {
          toValue: this.state.defaultBarXPosition,
        }).start();
      }
    }

    if (hasIndeterminateChanged || hasProgressChanged) {
      const progress = roundProgress(props.indeterminate ? indeterminateWidth : props.progress);

      Animated.spring(this.state.progressAnimationValue, {
        toValue: progress,
        bounciness: 0,
      }).start();
    }
  }

  _startIndeterminateAnimation = () => {
    this.state.indeterminateAnimationValue.setValue(0);

    Animated.timing(this.state.indeterminateAnimationValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.linear,
      isInteraction: false,
    }).start((animationState) => {
      if (animationState.finished) {
        this._startIndeterminateAnimation();
      }
    });
  }

  _setDimensions = (event) => {
    const { width, height } = event.nativeEvent.layout;
    this.setState({ width, height });
  }

  render() {
    const {
      style,
      theme,
      ...otherProps
    } = this.props;
    const { width, height } = this.state;

    const progressColor = this.props.color || theme.colors.accent;
    const progressContainer = {
      backgroundColor: color(progressColor).alpha(0.5).rgbaString(),
      transform: [ { scaleY: this.state.visibleAnimationValue } ],
    };
    const progressBar = {
      backgroundColor: progressColor,
      height,
      width: this.state.progressAnimationValue.interpolate({
        inputRange: [ 0, 1 ],
        outputRange: [ 0, width ],
      }),
      transform: [
        {
          translateX: this.state.indeterminateAnimationValue.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ width * -roundProgress(indeterminateWidth), width ],
          }),
        },
      ],
    };

    return (
      <Animated.View
        onLayout={this._setDimensions}
        style={[
          styles.container,
          progressContainer,
          style,
        ]}
        {...otherProps}
      >
        <Animated.View style={progressBar} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default withTheme(Linear);
