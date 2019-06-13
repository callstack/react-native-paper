import * as React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
  I18nManager,
  Platform,
} from 'react-native';
import color from 'color';
import AnimatedText from '../Typography/AnimatedText';
import InputLabel from './InputLabel';
import { RenderProps, ChildTextInputProps } from './types';
import { Theme, Font } from '../../types';

import {
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
  LABEL_WIGGLE_X_OFFSET,
  LABEL_PADDING_HORIZONTAL,
} from './constants';

import {
  calculateLabelTopPosition,
  calculateInputHeight,
  calculatePadding,
  adjustPaddingOut,
} from './helpers';

const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -6;
const LABEL_PADDING_TOP = 8;
const MIN_HEIGHT = 64;
const MIN_DENSE_HEIGHT = 48;

class TextInputOutlined extends React.Component<ChildTextInputProps, {}> {
  static defaultProps = {
    disabled: false,
    error: false,
    multiline: false,
    editable: true,
    render: (props: RenderProps) => <NativeTextInput {...props} />,
  };

  render() {
    const {
      disabled,
      editable,
      label,
      error,
      selectionColor,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      underlineColor,
      dense,
      style,
      theme,
      render,
      multiline,
      parentState,
      innerRef,
      onFocus,
      onBlur,
      onChangeText,
      onLayoutAnimatedText,
      ...rest
    } = this.props;

    const { colors, fonts } = theme;
    const font = fonts.regular;
    const hasActiveOutline = parentState.focused || error;
    const { backgroundColor = colors.background } =
      StyleSheet.flatten(style) || {};

    const {
      fontSize: fontSizeStyle,
      height,
      ...viewStyle
    } = StyleSheet.flatten(style);
    const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

    let inputTextColor,
      activeColor,
      outlineColor,
      placeholderColor,
      containerStyle;

    if (disabled) {
      inputTextColor = activeColor = color(colors.text)
        .alpha(0.54)
        .rgb()
        .string();
      placeholderColor = outlineColor = colors.disabled;
    } else {
      inputTextColor = colors.text;
      activeColor = error ? colors.error : colors.primary;
      placeholderColor = outlineColor = colors.placeholder;
    }

    const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
    const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

    const labelWidth = parentState.labelLayout.width;
    const labelHeight = parentState.labelLayout.height;
    const labelHalfWidth = labelWidth / 2;
    const labelHalfHeight = labelHeight / 2;

    const baseLabelTranslateX =
      (I18nManager.isRTL ? 1 : -1) *
      (labelHalfWidth -
        (labelScale * labelWidth) / 2 -
        (fontSize - MINIMIZED_LABEL_FONT_SIZE) * labelScale);

    const minInputHeight =
      (dense ? MIN_DENSE_HEIGHT : MIN_HEIGHT) - LABEL_PADDING_TOP;

    const inputHeight = calculateInputHeight(
      labelHeight,
      height,
      minInputHeight
    );

    const topPosition = calculateLabelTopPosition(
      labelHeight,
      inputHeight,
      LABEL_PADDING_TOP
    );

    if (height && typeof height !== 'number')
      // eslint-disable-next-line
      console.warn('Currently we support only numbers in height prop');

    const paddingSettings = {
      height: +height,
      labelHalfHeight,
      offset: LABEL_PADDING_TOP,
      multiline: multiline ? multiline : null,
      dense: dense ? dense : null,
      topPosition,
      fontSize,
      label,
      scale: fontScale,
      isAndroid: Platform.OS === 'android',
      styles: dense ? styles.inputOutlinedDense : styles.inputOutlined,
    };

    const pad = calculatePadding(paddingSettings);

    const paddingOut = adjustPaddingOut({ ...paddingSettings, pad });

    const baseLabelTranslateY =
      -labelHalfHeight - (topPosition + OUTLINE_MINIMIZED_LABEL_Y_OFFSET);

    const placeholderOpacity = hasActiveOutline ? parentState.labeled : 1;

    const labelProps = {
      label,
      onLayoutAnimatedText,
      placeholderOpacity,
      error,
      placeholderStyle: styles.placeholder,
      baseLabelTranslateY,
      baseLabelTranslateX,
      font,
      fontSize,
      labelScale,
      wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
      topPosition,
      hasActiveOutline,
      activeColor,
      placeholderColor,
    };

    const minHeight = height || (dense ? MIN_DENSE_HEIGHT : MIN_HEIGHT);

    return (
      <View style={[containerStyle, viewStyle]}>
        {/* 
          Render the outline separately from the container
          This is so that the label can overlap the outline
          Otherwise the border will cut off the label on Android 
          */}
        <View>
          <Outline
            theme={theme}
            hasActiveOutline={hasActiveOutline}
            activeColor={activeColor}
            outlineColor={outlineColor}
          />
          <View
            style={{
              paddingTop: LABEL_PADDING_TOP,
              paddingBottom: 0,
              minHeight,
            }}
          >
            <OutlinedLabel
              parentState={parentState}
              label={label}
              backgroundColor={backgroundColor}
              font={font}
            />

            <InputLabel parentState={parentState} labelProps={labelProps} />

            {render &&
              render({
                ...rest,
                ref: innerRef,
                onChangeText,
                placeholder: label
                  ? parentState.placeholder
                  : this.props.placeholder,
                placeholderTextColor: placeholderColor,
                editable: !disabled && editable,
                selectionColor:
                  typeof selectionColor === 'undefined'
                    ? activeColor
                    : selectionColor,
                onFocus,
                onBlur,
                underlineColorAndroid: 'transparent',
                multiline,
                style: [
                  styles.input,
                  !multiline || (multiline && height)
                    ? { height: inputHeight }
                    : {},
                  paddingOut,
                  {
                    fontSize,
                    color: inputTextColor,
                    ...font,
                    textAlignVertical: multiline && height ? 'top' : 'center',
                  },
                ],
              } as RenderProps)}
          </View>
        </View>
      </View>
    );
  }
}

export default TextInputOutlined;

type OutlineType = {
  activeColor: string;
  hasActiveOutline: boolean | undefined;
  outlineColor: string | undefined;
  theme: Theme;
};

const Outline = ({
  theme,
  hasActiveOutline,
  activeColor,
  outlineColor,
}: OutlineType) => (
  <View
    pointerEvents="none"
    style={[
      styles.outline,
      // eslint-disable-next-line react-native/no-inline-styles
      {
        borderRadius: theme.roundness,
        borderWidth: hasActiveOutline ? 2 : 1,
        borderColor: hasActiveOutline ? activeColor : outlineColor,
      },
    ]}
  />
);

type OutlinedLabel = {
  backgroundColor: string;
  font: Font;
  label?: string;
  parentState: {
    labeled: Animated.Value;
  };
};

const OutlinedLabel = ({
  parentState,
  label,
  backgroundColor,
  font,
}: OutlinedLabel) =>
  label ? (
    // The input label stays on top of the outline
    // The background of the label covers the outline so it looks cut off
    // To achieve the effect, we position the actual label with a background on top of it
    // We set the color of the text to transparent so only the background is visible
    <AnimatedText
      pointerEvents="none"
      style={[
        styles.outlinedLabelBackground,
        {
          backgroundColor,
          ...font,
          fontSize: MINIMIZED_LABEL_FONT_SIZE,
          // Hide the background when scale will be 0
          // There's a bug in RN which makes scale: 0 act weird
          opacity: parentState.labeled.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [1, 1, 0],
          }),
          transform: [
            {
              // Animate the scale when label is moved up
              scaleX: parentState.labeled.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ],
        },
      ]}
      numberOfLines={1}
    >
      {label}
    </AnimatedText>
  ) : null;

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: LABEL_PADDING_HORIZONTAL,
  },
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
  },
  outlinedLabelBackground: {
    position: 'absolute',
    top: 0,
    left: 8,
    paddingHorizontal: 4,
    color: 'transparent',
  },
  input: {
    flexGrow: 1,
    paddingHorizontal: 12,
    margin: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    zIndex: 1,
  },
  inputOutlined: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputOutlinedDense: {
    paddingTop: 4,
    paddingBottom: 4,
  },
});
