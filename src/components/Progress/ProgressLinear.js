/* @flow */

import color from 'color';
import React, {
  PureComponent,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  color: string;
  indeterminate: boolean;
  progress: number;
  visible: boolean;
  style?: any;
  theme: Theme;
}

type State = {
  progress: Animated.Value;
  visibility: Animated.Value;
  indeterminate: Animated.Value;
  width: number;
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

  state: State = {
    progress: new Animated.Value(0),
    visibility: new Animated.Value(0),
    indeterminate: new Animated.Value(0),
    width: 0,
  };

  componentDidMount() {
    if (this.props.visible) {
      this._updateVisibility(true);
    }
    if (this.props.indeterminate) {
      this._updateIndeterminate(true);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const hasIndeterminateChanged = prevProps.indeterminate !== this.props.indeterminate;
    const hasProgressChanged = prevProps.progress !== this.props.progress;
    const hasVisiblityChanged = prevProps.visible !== this.props.visible;

    if (hasVisiblityChanged) {
      this._updateVisibility(this.props.visible);
    }

    if (hasIndeterminateChanged) {
      this._updateIndeterminate(this.props.indeterminate);
    }

    if (hasProgressChanged) {
      this._updateProgress(this.props.progress);
    }
  }

  _updateIndeterminate = (indeterminate: boolean) => {
    if (indeterminate) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.state.progress, {
            toValue: 0.8,
            duration: 600,
            isInteraction: false,
          }),
          Animated.timing(this.state.progress, {
            toValue: 0.2,
            duration: 600,
            isInteraction: false,
          }),
        ]),
        Animated.timing(this.state.indeterminate, {
          toValue: 1,
          duration: 1200,
          isInteraction: false,
        }),
      ]).start(animationState => {
        if (animationState.finished) {
          this.state.indeterminate.setValue(-1);
          this._updateIndeterminate(true);
        }
      });
    } else {
      Animated.timing(this.state.indeterminate, {
        toValue: 0,
        duration: 600,
        isInteraction: false,
      }).start();
    }
  };

  _updateProgress = (progress: number) => {
    Animated.spring(this.state.progress, {
      toValue: progress,
      bounciness: 0,
      isInteraction: false,
    }).start();
  };

  _updateVisibility = (visible: boolean) => {
    Animated.timing(this.state.visibility, {
      toValue: visible ? 1 : 0,
      isInteraction: false,
    }).start();
  };

  _handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    this.setState({ width });
  }

  render() {
    const {
      style,
      theme,
      ...restProps
    } = this.props;
    const { width } = this.state;

    const progressColor = this.props.color || theme.colors.accent;
    const backgroundColor = color(progressColor).alpha(0.32).rgbaString();
    const scaleX = Animated.diffClamp(this.state.progress, 0, 1);
    const opacity = this.state.visibility.interpolate({
      inputRange: [ 0, 0.1, 1 ],
      outputRange: [ 0, 1, 1 ],
    });
    const translateX = Animated.add(
      Animated.multiply(this.state.indeterminate, width),
      scaleX.interpolate({
        inputRange: [ 0, 1 ],
        outputRange: [ -width / 2, 0 ],
      })
    );
    const barStyle = {
      backgroundColor,
      opacity,
      transform: [ { scaleY: this.state.visibility } ],
    };
    const filleStyle = {
      backgroundColor: progressColor,
      transform: [
        { translateX },
        { scaleX },
      ],
    };

    return (
      <Animated.View
        {...restProps}
        onLayout={this._handleLayout}
        style={[
          styles.container,
          barStyle,
          style,
        ]}
      >
        <Animated.View style={[ styles.fill, filleStyle ]} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: 4,
  },

  fill: {
    flex: 1,
  },
});

export default withTheme(Linear);
