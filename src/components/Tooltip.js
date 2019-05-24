/* @flow */

import * as React from 'react';
import { Dimensions, StyleSheet, UIManager, View } from 'react-native';
import * as Colors from '../styles/colors';
import { APPROX_STATUSBAR_HEIGHT } from '../constants';
import Text from './Typography/Text';
import Portal from './Portal/Portal';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {|
  /**
   * Tooltip title.
   */
  title: string,
  /**
   * Tooltip reference node.
   */
  children: React.node,
  /**
   * Delay in ms before onLongPress is called.
   */
  delayLongPress?: number,
  /**
   * Style that is passed to the children wrapper.
   */
  style?: ViewStyleProp,
|};

type State = {
  childrenDimensions: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  tooltipDimensions: {
    width: number,
    height: number,
  },
  tooltipVisible: boolean,
  tooltipOpacity: number,
};

class Tooltip extends React.Component<Props, State> {
  static defaultProps = { delayLongPress: 500 };

  state = {
    childrenDimensions: {
      x: null,
      y: null,
      width: null,
      height: null,
    },
    tooltipDimensions: {
      width: null,
      height: null,
    },
    tooltipVisible: false,
    tooltipOpacity: 0,
  };

  componentWillUnmount() {
    this.clearTimeouts();
  }

  onChildrenLayout = ({ nativeEvent: { target } }) => {
    setTimeout(() => {
      UIManager.measure(target, (_x, _y, width, height, pageX, pageY) => {
        this.setState({
          childrenDimensions: {
            x: pageX,
            y: pageY,
            width,
            height,
          },
        });
      });
    }, 500);
  };

  onTooltipLayout = () => {
    this.tooltip.measureInWindow((_x, _y, width, height) => {
      const {
        tooltipDimensions: { width: tooltipWidth, height: tooltipHeight },
      } = this.state;

      // Prevent rerender after getting tooltip dimensions
      if (!tooltipWidth && !tooltipHeight)
        this.setState({
          tooltipDimensions: {
            width,
            height,
          },
          tooltipOpacity: 0.9,
        });
    });
  };

  showTooltip = () => this.setState({ tooltipVisible: true });

  hideTooltip = () => this.setState({ tooltipVisible: false });

  clearTimeouts = () => clearTimeout(this.longPressTimeout);

  onTouchStart = () => {
    const { delayLongPress } = this.props;

    this.longPressTimeout = setTimeout(() => {
      this.showTooltip();
    }, delayLongPress);
  };

  onTouchEndCapture = () => {
    const { delayLongPress } = this.props;
    const { tooltipVisible } = this.state;

    this.clearTimeouts();
    this.longPressTimeout = setTimeout(() => {
      tooltipVisible && this.hideTooltip();
    }, delayLongPress);
  };

  onTouchCancel = () => {
    this.clearTimeouts();
    this.hideTooltip();
  };

  getTooltipXPosition = () => {
    const {
      childrenDimensions: { x, width },
      tooltipDimensions: { width: tooltipWidth },
    } = this.state;

    const centerDistanceFromChildren = x + (width - tooltipWidth) / 2;
    const { width: layoutWidth } = Dimensions.get('window');

    // Does it overflow to the right? If so, subtracts tooltipWidth
    if (centerDistanceFromChildren + tooltipWidth > layoutWidth) {
      return x + width - tooltipWidth;
    }
    // Does it overflow to the left? If so, starts from children start position
    else if (centerDistanceFromChildren < 0) {
      return x;
    }

    return centerDistanceFromChildren;
  };

  getTooltipYPosition = () => {
    const {
      childrenDimensions: { y, height },
      tooltipDimensions: { height: tooltipHeight },
    } = this.state;

    const { height: layoutHeight } = Dimensions.get('window');

    // Does it overflow to the bottom? If so, subtracts the tooltip height,
    // the marginTop applied to the tooltip and the status bar height.
    if (y + height + tooltipHeight + APPROX_STATUSBAR_HEIGHT > layoutHeight) {
      return (
        y - tooltipHeight - styles.tooltip.marginTop - APPROX_STATUSBAR_HEIGHT
      );
    }

    return y + tooltipHeight;
  };

  render() {
    const { children, title, style, ...rest } = this.props;
    const childElement = React.Children.only(children);
    const { tooltipVisible, tooltipOpacity } = this.state;

    return (
      <View style={style}>
        <Portal>
          {tooltipVisible && (
            <View
              ref={el => {
                this.tooltip = el;
              }}
              style={[
                styles.tooltip,
                {
                  opacity: tooltipOpacity,
                  left: this.getTooltipXPosition(),
                  top: this.getTooltipYPosition(),
                },
              ]}
              onLayout={this.onTooltipLayout}
            >
              <Text style={{ color: Colors.white }}>{title}</Text>
            </View>
          )}
        </Portal>
        <View
          onTouchStart={this.onTouchStart}
          onTouchEndCapture={this.onTouchEndCapture}
          onTouchCancel={this.onTouchCancel}
        >
          {React.cloneElement(childElement, {
            onLayout: this.onChildrenLayout,
            onLongPress: () => {}, // Prevent touchable to trigger onPress after onLongPress
            ...rest,
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tooltip: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.grey700,
    borderRadius: 4,
    marginTop: 24,
    maxWidth: 300,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default Tooltip;
