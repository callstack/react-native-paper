import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  LayoutRectangle,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { $Omit, InternalTheme } from '../../types';
import Portal from '../Portal/Portal';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Whether the ToolTip is currently visible.
   */
  visible: boolean;
  /**
   * The anchor to open the ToolTip from. In most cases, it will be a button that opens the ToolTip.
   */
  anchor: React.ReactNode | { x: number; y: number };
  /**
   * Callback called when ToolTip is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => void;
  /**
   * @optional
   */
  theme: InternalTheme;
};

type Layout = $Omit<$Omit<LayoutRectangle, 'x'>, 'y'>;

const ToolTip = ({ visible, onDismiss, theme, anchor }: Props) => {
  const { current: opacity } = React.useRef<Animated.Value>(
    new Animated.Value(0.0)
  );

  const toolTipRef = useRef<View>(null);
  const anchorRef = useRef<View>(null);

  const [anchorLayout, setAnchorLayout] = React.useState<Layout>();
  const [toolTipLayout, setToolTipLayout] = React.useState<Layout>();
  const [topValue, setTopValue] = React.useState(0);
  const [xValue, setXValue] = React.useState(0);

  const hideTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const { scale } = theme.animation;

  const measureToolTipLayout = () => {
    return new Promise<LayoutRectangle>((resolve) => {
      if (toolTipRef?.current) {
        toolTipRef.current?.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });
  };

  const measureAnchorLayout = () => {
    return new Promise<LayoutRectangle>((resolve) => {
      if (anchorRef?.current) {
        anchorRef.current?.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });
  };

  React.useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const calculateLayout = async () => {
    const [_toolTipLayout, _anchorLayout] = await Promise.all([
      measureToolTipLayout(),
      measureAnchorLayout(),
    ]);

    setAnchorLayout({
      height: _anchorLayout.height,
      width: _anchorLayout.width,
    });
    /**
     * Move these two to anchorLayout
     */
    setTopValue(_anchorLayout.y);
    setXValue(_anchorLayout.x);

    setToolTipLayout({
      height: _toolTipLayout.height,
      width: _toolTipLayout.width,
    });
  };

  React.useLayoutEffect(() => {
    if (visible) {
      // show
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      calculateLayout();
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200 * scale,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
        delay: 50,
      }).start(({ finished }) => {
        if (finished) {
          hideTimeout.current = setTimeout(
            onDismiss,
            1500
          ) as unknown as NodeJS.Timeout;
        }
      });
    } else {
      // hide
      if (hideTimeout.current) clearTimeout(hideTimeout.current);

      Animated.timing(opacity, {
        toValue: 0,
        duration: 100 * scale,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, opacity, scale, onDismiss]);

  const calculateStyles = () => {
    if (!toolTipLayout || !anchorLayout) {
      return {};
    }
    let top = topValue;
    const windowLayout = Dimensions.get('window');

    const additionalVerticalValue = Platform.select({
      android: 24, //statusBarHeight,
      default: 0,
      ios: 0,
    });

    const contentHeight = Math.floor(
      topValue +
        additionalVerticalValue +
        anchorLayout.height +
        toolTipLayout.height
    );

    const isCloseToBottom = contentHeight >= Math.floor(windowLayout.height);

    const nearLeft =
      toolTipLayout.width / 2 - xValue > xValue &&
      Math.floor(anchorLayout.width) !== Math.floor(windowLayout.width);

    const nearRight =
      Math.floor(xValue + toolTipLayout.width) >=
      Math.floor(windowLayout.width);

    const commonStyles = {
      left: 0,
      right: 0,
    };

    if (toolTipLayout?.width && anchorLayout?.width) {
      if (nearRight) {
        commonStyles.left = windowLayout.width - toolTipLayout.width - 10;
      } else if (nearLeft) {
        commonStyles.left = xValue + 10;
      } else {
        commonStyles.left =
          xValue + (anchorLayout.width - toolTipLayout.width) / 2;
      }
    }

    const aboveAnchor = {
      top: top - additionalVerticalValue + 8,
      ...commonStyles,
    };

    const belowAnchor = {
      top: top + additionalVerticalValue + toolTipLayout?.height,
      marginTop: anchorLayout?.height
        ? parseFloat(String(anchorLayout?.height)) / 2
        : 0,
      ...commonStyles,
    };

    if (Platform.OS === 'web' && isCloseToBottom) {
      aboveAnchor.top = aboveAnchor.top - anchorLayout?.height - 8;
    }

    return isCloseToBottom ? aboveAnchor : belowAnchor;
  };

  return (
    <View ref={anchorRef} collapsable={false}>
      {anchor}
      <Portal>
        <Animated.View
          ref={toolTipRef}
          style={[
            {
              opacity: opacity,
              ...calculateStyles(),
            },
            styles.toolTip,
          ]}
        >
          <Text style={{ color: 'white' }}>Hello</Text>
        </Animated.View>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  toolTip: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', //TODO: change this with MD colors
    paddingHorizontal: 16,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    maxWidth: 100,
  },
});

export default withInternalTheme(ToolTip);
