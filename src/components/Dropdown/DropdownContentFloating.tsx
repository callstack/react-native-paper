import Surface from '../Surface';
import {
  Animated,
  Dimensions,
  Easing,
  LayoutRectangle,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useRef } from 'react';
import { DropdownContext } from './Dropdown';
import { withTheme } from '../../core/theming';
import { APPROX_STATUSBAR_HEIGHT } from '../../constants';
import type { $Omit } from '../../types';

type Props = {
  /**
   * Extra padding to add at the top of header to account for translucent status bar.
   * This is automatically handled on iOS >= 11 including iPhone X using `SafeAreaView`.
   * If you are using Expo, we assume translucent status bar and set a height for status bar automatically.
   * Pass `0` or a custom value to disable the default behaviour, and customize the height.
   */
  statusBarHeight?: number;
  children: React.ReactNode;
  visible: boolean;
  theme: ReactNativePaper.Theme;
};

type Layout = $Omit<$Omit<LayoutRectangle, 'x'>, 'y'>;

// From https://material.io/components/menus#usage
const DROPDOWN_SCREEN_INDENT = 48;
// From https://material.io/design/motion/speed.html#duration
const ANIMATION_DURATION = 250;
// From the 'Standard easing' section of https://material.io/design/motion/speed.html#easing
const EASING = Easing.bezier(0.4, 0, 0.2, 1);

const measureLayout = (view: View, statusBarHeight: number) => {
  // I don't know why but on Android measure function is wrong by 24
  const additionalVerticalValue = Platform.select({
    android: statusBarHeight,
    default: 0,
  });

  return new Promise<LayoutRectangle>((resolve) => {
    view.measureInWindow((x, y, width, height) =>
      resolve({
        x,
        y: y + additionalVerticalValue,
        width,
        height,
      })
    );
  });
};

const DropdownContentFloating = ({
  children,
  visible,
  theme,
  statusBarHeight = APPROX_STATUSBAR_HEIGHT,
}: Props) => {
  const context = React.useContext(DropdownContext);
  const { closeMenu, anchor } = context;
  const windowHeight = Dimensions.get('window').height;
  const menuRef = React.useRef<View>(null);
  const [menuLayout, setMenuLayout] = React.useState<Layout>({
    width: 0,
    height: 0,
  });

  const [rendered, setRendered] = React.useState(false);
  const [isAboveAnchor, setAboveAnchor] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState<{
    width: number;
    top?: number;
    left: number;
    bottom?: number;
    maxHeight?: number;
  }>({ width: 0, left: 0 });

  const { animation } = theme;
  const scaleAnimation = useRef(new Animated.Value(0)).current;

  const scrollTop =
    Platform.OS === 'web' ? document.documentElement.scrollTop : 0;

  React.useEffect(() => {
    const show = async () => {
      if (visible) {
        const [menuLayout, anchorLayout] = await Promise.all([
          menuRef.current
            ? measureLayout(menuRef.current, statusBarHeight)
            : undefined,
          anchor ? measureLayout(anchor, statusBarHeight) : undefined,
        ]);

        if (
          !anchorLayout?.width ||
          !anchorLayout.height ||
          !menuLayout?.height ||
          !menuLayout.width
        ) {
          requestAnimationFrame(show);
          return;
        }

        const spaceAbove = anchorLayout.y - DROPDOWN_SCREEN_INDENT;
        const spaceBelow =
          windowHeight - anchorLayout.y - DROPDOWN_SCREEN_INDENT;

        const aboveAnchor =
          menuLayout.height > spaceBelow && spaceAbove > spaceBelow;

        setAboveAnchor(aboveAnchor);
        setMenuLayout(menuLayout);
        setMenuPosition({
          left: anchorLayout.x,
          top: aboveAnchor
            ? anchorLayout.y -
              Math.min(menuLayout.height, spaceAbove - DROPDOWN_SCREEN_INDENT)
            : anchorLayout.y + anchorLayout.height,
          maxHeight: aboveAnchor
            ? Math.min(menuLayout.height, spaceAbove - DROPDOWN_SCREEN_INDENT)
            : windowHeight -
              (anchorLayout.y + anchorLayout.height) -
              DROPDOWN_SCREEN_INDENT,
          width: anchorLayout.width,
        });

        setRendered(true);
        requestAnimationFrame(() =>
          Animated.timing(scaleAnimation, {
            toValue: menuLayout.height,
            duration: ANIMATION_DURATION * animation.scale,
            easing: EASING,
            useNativeDriver: true,
          }).start()
        );
      } else {
        setRendered(false);
        scaleAnimation.setValue(0);
      }
    };

    show();
  }, [
    windowHeight,
    anchor,
    visible,
    statusBarHeight,
    scaleAnimation,
    animation.scale,
    scrollTop,
  ]);

  const animatedViewStyle = {
    transform: [
      {
        translateY: scaleAnimation.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [(isAboveAnchor ? 1 : -1) * (menuLayout.height / 2), 0],
        }),
      },
      {
        scaleY: scaleAnimation.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  let menuView = (
    <View
      ref={menuRef}
      style={[
        styles.menu,
        Platform.OS !== 'web' && styles.expand,
        rendered ? menuPosition : styles.invisible,
        !visible && styles.hidden,
      ]}
    >
      <Animated.View style={[styles.expand, animatedViewStyle]}>
        <Surface
          style={[
            styles.container,
            isAboveAnchor
              ? {
                  borderTopLeftRadius: theme.roundness,
                  borderTopRightRadius: theme.roundness,
                }
              : {
                  borderBottomRightRadius: theme.roundness,
                  borderBottomLeftRadius: theme.roundness,
                },
          ]}
        >
          <ScrollView style={styles.expand}>{children}</ScrollView>
        </Surface>
      </Animated.View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View
        style={[
          { transform: [{ translateY: scrollTop }] },
          visible ? StyleSheet.absoluteFill : styles.hidden,
        ]}
        collapsable={false}
      >
        {menuView}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 8,
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  invisible: {
    opacity: 0,
  },
  menu: {
    overflow: 'hidden',
  },
  expand: {
    flex: 1,
  },
});

export default withTheme(DropdownContentFloating);
