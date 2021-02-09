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

const DropdownContentFloating = ({
  children,
  visible,
  theme,
  statusBarHeight = APPROX_STATUSBAR_HEIGHT,
}: Props) => {
  const { closeMenu, anchor } = React.useContext(DropdownContext);
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

  // I don't know why but on Android measure function is wrong by 24
  const additionalVerticalValue = Platform.select({
    android: statusBarHeight,
    default: 0,
  });

  const measureLayout = (view: View) => {
    return new Promise<LayoutRectangle>((resolve) => {
      view.measureInWindow((x, y, width, height) =>
        resolve({ x, y, width, height })
      );
    });
  };

  React.useEffect(() => {
    const show = async () => {
      if (visible) {
        const [menuLayout, anchorLayout] = await Promise.all([
          menuRef.current ? measureLayout(menuRef.current) : undefined,
          anchor ? measureLayout(anchor) : undefined,
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

        let anchorY = anchorLayout.y + additionalVerticalValue;
        const spaceAbove = anchorY - DROPDOWN_SCREEN_INDENT;
        const spaceBelow = windowHeight - anchorY - DROPDOWN_SCREEN_INDENT;

        const aboveAnchor =
          menuLayout.height > spaceBelow && spaceAbove > spaceBelow;

        setAboveAnchor(aboveAnchor);
        setMenuLayout(menuLayout);
        setMenuPosition({
          left: anchorLayout.x,
          top: aboveAnchor
            ? anchorY -
              Math.min(menuLayout.height, spaceAbove) +
              DROPDOWN_SCREEN_INDENT
            : anchorY + anchorLayout.height,
          maxHeight: aboveAnchor
            ? Math.min(menuLayout.height, spaceAbove) - DROPDOWN_SCREEN_INDENT
            : windowHeight -
              (anchorY + anchorLayout.height) -
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
    additionalVerticalValue,
    rendered,
    scaleAnimation,
    animation.scale,
  ]);

  const scaleTransforms = [
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
  ];

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={visible ? StyleSheet.absoluteFill : styles.hidden}>
        <View ref={menuRef} style={rendered ? menuPosition : styles.invisible}>
          <Animated.View
            style={{
              transform: scaleTransforms,
            }}
          >
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
              {rendered ? <ScrollView>{children}</ScrollView> : children}
            </Surface>
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 8,
  },
  hidden: {
    display: 'none',
  },
  invisible: {
    opacity: 0,
  },
});

export default withTheme(DropdownContentFloating);
