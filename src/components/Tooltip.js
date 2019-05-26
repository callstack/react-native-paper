/* @flow */

import * as React from 'react';
import {
  Dimensions,
  findNodeHandle,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import * as Colors from '../styles/colors';
import { APPROX_STATUSBAR_HEIGHT } from '../constants';
import Text from './Typography/Text';
import Portal from './Portal/Portal';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';

type Props = {|
  /**
   * Tooltip title.
   */
  title: string,
  /**
   * Tooltip reference node.
   */
  children: React.Node,
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
  childrenLayout: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  tooltipLayout: {
    width: number,
    height: number,
  },
  tooltipVisible: boolean,
  tooltipOpacity: number,
  tooltipMeasured: boolean,
};

/**
 * Tooltips display informative text when users tap an element.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/tooltip.jpeg" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Tooltip, Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Tooltip title="Search">
 *     <Appbar.Action icon="search" onPress={() => {}} />
 *   </Tooltip>
 * );
 *
 * export default MyComponent;
 * ```
 */
class Tooltip extends React.Component<Props, State> {
  _longPressTimeout: TimeoutID;
  _children: React.Node;

  static defaultProps = { delayLongPress: 500 };

  state = {
    childrenLayout: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    tooltipLayout: {
      width: 0,
      height: 0,
    },
    tooltipVisible: false,
    tooltipOpacity: 0,
    tooltipMeasured: false,
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this._getChildrenPosition.bind(this));

    this._getChildrenPosition();
  }

  componentWillUnmount() {
    Dimensions.removeEventListener(
      'change',
      this._getChildrenPosition.bind(this)
    );
    this._clearTimeouts();
  }

  _getChildrenPosition() {
    if (!this._children) return;

    const target = findNodeHandle(this._children);

    setTimeout(() => {
      UIManager.measure(target, (_x, _y, width, height, pageX, pageY) => {
        this.setState({
          childrenLayout: {
            x: pageX,
            y: pageY,
            width,
            height,
          },
        });
      });
    }, 500);
  }

  _handleTooltipLayout = ({ nativeEvent: { layout } }: LayoutEvent) => {
    const { tooltipMeasured } = this.state;

    if (!tooltipMeasured)
      this.setState({
        tooltipLayout: {
          width: layout.width,
          height: layout.height,
        },
        tooltipOpacity: 0.9,
        tooltipMeasured: true,
      });
  };

  _showTooltip = () => this.setState({ tooltipVisible: true });

  _hideTooltip = () => this.setState({ tooltipVisible: false });

  _clearTimeouts = () => clearTimeout(this._longPressTimeout);

  _handleTouchStart = () => {
    const { delayLongPress } = this.props;

    this._longPressTimeout = setTimeout(() => {
      this._showTooltip();
    }, delayLongPress);
  };

  _handleTouchEndCapture = () => {
    const { delayLongPress } = this.props;
    const { tooltipVisible } = this.state;

    this._clearTimeouts();
    this._longPressTimeout = setTimeout(() => {
      tooltipVisible && this._hideTooltip();
    }, delayLongPress);
  };

  _handleTouchCancel = () => {
    this._clearTimeouts();
    this._hideTooltip();
  };

  _getTooltipXPosition = () => {
    const {
      childrenLayout: { x, width },
      tooltipLayout: { width: tooltipWidth },
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

  _getTooltipYPosition = () => {
    const {
      childrenLayout: { y, height },
      tooltipLayout: { height: tooltipHeight },
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
              style={[
                styles.tooltip,
                {
                  opacity: tooltipOpacity,
                  left: this._getTooltipXPosition(),
                  top: this._getTooltipYPosition(),
                },
              ]}
              onLayout={this._handleTooltipLayout}
            >
              <Text style={{ color: Colors.white }}>{title}</Text>
            </View>
          )}
        </Portal>
        <View
          onTouchStart={this._handleTouchStart}
          onTouchEndCapture={this._handleTouchEndCapture}
          onTouchCancel={this._handleTouchCancel}
        >
          {React.cloneElement(childElement, {
            onLongPress: () => {}, // Prevent touchable to trigger onPress after onLongPress
            ref: el => {
              this._children = el;
            },
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
