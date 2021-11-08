import * as React from 'react';
import { View, ViewStyle, StyleProp, Animated } from 'react-native';
import Surface from './Surface';
import { Button } from './Button';
import { IconSource } from './Icon';
import type { $RemoveChildren } from '../types';
declare type Props = $RemoveChildren<typeof Surface> & {
    /**
     * Whether banner is currently visible.
     */
    visible: boolean;
    /**
     * Content that will be displayed inside banner.
     */
    children: string;
    /**
     * Icon to display for the `Banner`. Can be an image.
     */
    icon?: IconSource;
    /**
     * Action items to shown in the banner.
     * An action item should contain the following properties:
     *
     * - `label`: label of the action button (required)
     * - `onPress`: callback that is called when button is pressed (required)
     *
     * To customize button you can pass other props that button component takes.
     */
    actions: Array<{
        label: string;
        onPress: () => void;
    } & Omit<React.ComponentProps<typeof Button>, 'children'>>;
    /**
     * Style of banner's inner content.
     * Use this prop to apply custom width for wide layouts.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    ref?: React.RefObject<View>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * @optional
     * Optional callback that will be called after the opening animation finished running normally
     */
    onShowAnimationFinished?: Animated.EndCallback;
    /**
     * @optional
     * Optional callback that will be called after the closing animation finished running normally
     */
    onHideAnimationFinished?: Animated.EndCallback;
};
declare const _default: (React.ComponentClass<Pick<Props, "ref" | "style" | "children" | "pointerEvents" | "onLayout" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "icon" | "key" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "visible" | "contentStyle" | "actions" | "onShowAnimationFinished" | "onHideAnimationFinished"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}, any> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & (({ visible, icon, children, actions, contentStyle, style, theme, onShowAnimationFinished, onHideAnimationFinished, ...rest }: Props) => JSX.Element)) | (React.FunctionComponent<Props> & (({ visible, icon, children, actions, contentStyle, style, theme, onShowAnimationFinished, onHideAnimationFinished, ...rest }: Props) => JSX.Element)), {}>) | (React.FunctionComponent<Pick<Props, "ref" | "style" | "children" | "pointerEvents" | "onLayout" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "icon" | "key" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "visible" | "contentStyle" | "actions" | "onShowAnimationFinished" | "onHideAnimationFinished"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & (({ visible, icon, children, actions, contentStyle, style, theme, onShowAnimationFinished, onHideAnimationFinished, ...rest }: Props) => JSX.Element)) | (React.FunctionComponent<Props> & (({ visible, icon, children, actions, contentStyle, style, theme, onShowAnimationFinished, onHideAnimationFinished, ...rest }: Props) => JSX.Element)), {}>);
export default _default;
