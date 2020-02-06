import * as React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
  I18nManager,
  Platform,
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
} from 'react-native';
import color from 'color';
import InputLabel from './Label/InputLabel';
import TextInputAffix from './Affix';
import TextInputIcon from './Icon';
import { RenderProps, ChildTextInputProps } from './types';

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
  adjustPaddingFlat,
  Padding,
  interpolatePlaceholder,
} from './helpers';

const MINIMIZED_LABEL_Y_OFFSET = -18;

const LABEL_PADDING_TOP = 30;
const LABEL_PADDING_TOP_DENSE = 24;
const MIN_HEIGHT = 64;
const MIN_DENSE_HEIGHT_WL = 52;
const MIN_DENSE_HEIGHT = 40;

const INPUT_OFFSET = 8;

const ADORNMENT_SIZE = 24;
const ADORNMENT_OFFSET = 12;

type State = {
  leftWidth: number | null;
  leftHeight: number | null;
  rightWidth: number | null;
  rightHeight: number | null;
};

type AdornmentType = 'icon' | 'affix' | null;

class TextInputFlat extends React.Component<ChildTextInputProps, State> {
  static defaultProps = {
    disabled: false,
    error: false,
    multiline: false,
    editable: true,
    render: (props: RenderProps) => <NativeTextInput {...props} />,
  };

  state = {
    leftHeight: null,
    leftWidth: null,
    rightHeight: null,
    rightWidth: null,
  };

  handleAdornmentLayoutChange = (side: 'left' | 'right') => (
    event: LayoutChangeEvent
  ) => {
    if (side === 'left') {
      this.setState({
        leftWidth: event.nativeEvent.layout.width,
        leftHeight: event.nativeEvent.layout.height,
      });
    } else {
      this.setState({
        rightWidth: event.nativeEvent.layout.width,
        rightHeight: event.nativeEvent.layout.height,
      });
    }
  };

  renderIcon = ({
    side,
    iconTopPosition,
  }: {
    iconTopPosition: number;
    side: 'left' | 'right';
  }) => {
    if (side == 'left') {
      // @ts-ignore
      return React.cloneElement(this.props.leftAdornment, {
        style: { top: iconTopPosition, left: ADORNMENT_OFFSET },
      });
    } else if (side == 'right') {
      // @ts-ignore
      return React.cloneElement(this.props.rightAdornment, {
        style: { top: iconTopPosition, right: ADORNMENT_OFFSET },
      });
    }
  };

  renderAffix = ({
    side,
    textStyle,
    affixTopPosition,
  }: {
    side: 'left' | 'right';
    textStyle: StyleProp<TextStyle>;
    affixTopPosition: number;
  }) => {
    if (side == 'left') {
      // @ts-ignore
      return React.cloneElement(this.props.leftAdornment, {
        style: { bottom: 7, left: ADORNMENT_OFFSET },
        textStyle,
        onLayout: this.handleAdornmentLayoutChange(side),
        visible: this.props.parentState.labeled,
      });
    } else if (side == 'right') {
      // @ts-ignore
      return React.cloneElement(this.props.rightAdornment, {
        style: { top: affixTopPosition, right: ADORNMENT_OFFSET },
        textStyle,
        onLayout: this.handleAdornmentLayoutChange(side),
      });
    }
  };

  render() {
    const {
      disabled,
      editable,
      label,
      error,
      selectionColor,
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
      leftAdornment,
      rightAdornment,
      ...rest
    } = this.props;

    const { colors, fonts } = theme;
    const font = fonts.regular;
    const hasActiveOutline = parentState.focused || error;

    const {
      fontSize: fontSizeStyle,
      fontWeight,
      height,
      paddingHorizontal,
      ...viewStyle
    } = (StyleSheet.flatten(style) || {}) as TextStyle;
    const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

    let paddingLeft = LABEL_PADDING_HORIZONTAL;
    let paddingRight = LABEL_PADDING_HORIZONTAL;

    let leftType: AdornmentType = null;
    let rightType: AdornmentType = null;

    const isPaddingHorizontalPassed =
      paddingHorizontal !== undefined && typeof paddingHorizontal === 'number';

    if (leftAdornment && React.isValidElement(leftAdornment)) {
      if (leftAdornment.type === TextInputAffix) {
        leftType = 'affix';
      } else if (leftAdornment.type === TextInputIcon) {
        leftType = 'icon';
        paddingLeft = ADORNMENT_SIZE + ADORNMENT_OFFSET + INPUT_OFFSET;
      }
    }

    if (rightAdornment && React.isValidElement(rightAdornment)) {
      if (rightAdornment.type === TextInputAffix) {
        rightType = 'affix';
        paddingRight = ADORNMENT_SIZE + ADORNMENT_OFFSET + INPUT_OFFSET;
      } else if (rightAdornment.type === TextInputIcon) {
        rightType = 'icon';
        paddingRight = ADORNMENT_SIZE + ADORNMENT_OFFSET + INPUT_OFFSET;
      }
    }

    if (isPaddingHorizontalPassed) {
      paddingLeft = paddingHorizontal as number;
      paddingRight = paddingHorizontal as number;
    }

    let inputTextColor,
      activeColor,
      underlineColorCustom,
      placeholderColor,
      errorColor;

    if (disabled) {
      inputTextColor = activeColor = color(colors.text)
        .alpha(0.54)
        .rgb()
        .string();
      placeholderColor = colors.disabled;
      underlineColorCustom = 'transparent';
    } else {
      inputTextColor = colors.text;
      activeColor = error ? colors.error : colors.primary;
      placeholderColor = colors.placeholder;
      errorColor = colors.error;
      underlineColorCustom = underlineColor || colors.disabled;
    }

    const containerStyle = {
      backgroundColor: theme.dark
        ? color(colors.background)
            .lighten(0.24)
            .rgb()
            .string()
        : color(colors.background)
            .darken(0.06)
            .rgb()
            .string(),
      borderTopLeftRadius: theme.roundness,
      borderTopRightRadius: theme.roundness,
    };

    const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
    const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

    const labelWidth = parentState.labelLayout.width;
    const labelHeight = parentState.labelLayout.height;
    const labelHalfWidth = labelWidth / 2;
    const labelHalfHeight = labelHeight / 2;

    const baseLabelTranslateX =
      (I18nManager.isRTL ? 1 : -1) *
        (labelHalfWidth - (labelScale * labelWidth) / 2) +
      (1 - labelScale) * (I18nManager.isRTL ? -1 : 1) * paddingLeft;

    const minInputHeight = dense
      ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) -
        LABEL_PADDING_TOP_DENSE
      : MIN_HEIGHT - LABEL_PADDING_TOP;

    const inputHeight = calculateInputHeight(
      labelHeight,
      height,
      minInputHeight
    );

    const topPosition = calculateLabelTopPosition(
      labelHeight,
      inputHeight,
      multiline && height ? 0 : !height ? minInputHeight / 2 : 0
    );

    if (height && typeof height !== 'number')
      // eslint-disable-next-line
      console.warn('Currently we support only numbers in height prop');

    const paddingSettings = {
      height: height ? +height : null,
      labelHalfHeight,
      offset: INPUT_OFFSET,
      multiline: multiline ? multiline : null,
      dense: dense ? dense : null,
      topPosition,
      fontSize,
      label,
      scale: fontScale,
      isAndroid: Platform.OS === 'android',
      styles: StyleSheet.flatten(
        dense ? styles.inputFlatDense : styles.inputFlat
      ) as Padding,
    };

    const pad = calculatePadding(paddingSettings);

    const paddingFlat = adjustPaddingFlat({
      ...paddingSettings,
      pad,
    });

    const baseLabelTranslateY =
      -labelHalfHeight - (topPosition + MINIMIZED_LABEL_Y_OFFSET);

    const placeholderOpacity = hasActiveOutline
      ? interpolatePlaceholder(parentState.labeled, hasActiveOutline)
      : parentState.labelLayout.measured
      ? 1
      : 0;

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
      fontWeight,
      labelScale,
      wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
      topPosition,
      paddingOffset: { paddingLeft, paddingRight },
      hasActiveOutline,
      activeColor,
      placeholderColor,
      errorColor,
    };

    const minHeight =
      height ||
      (dense ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) : MIN_HEIGHT);

    const flatHeight =
      inputHeight +
      (!height ? (dense ? LABEL_PADDING_TOP_DENSE : LABEL_PADDING_TOP) : 0);

    const iconTopPosition = (flatHeight - ADORNMENT_SIZE) / 2;
    const affixTopPosition = (flatHeight - (this.state.leftHeight || 0)) / 2;

    const rightAffixWidth = rightAdornment
      ? this.state.rightWidth || ADORNMENT_SIZE
      : ADORNMENT_SIZE;

    const leftAffixWidth = leftAdornment
      ? this.state.leftWidth || ADORNMENT_SIZE
      : ADORNMENT_SIZE;

    return (
      <View style={[styles.container, containerStyle, viewStyle]}>
        <Underline
          parentState={parentState}
          underlineColorCustom={underlineColorCustom}
          error={error}
          colors={colors}
          activeColor={activeColor}
        />
        <View
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            minHeight,
          }}
        >
          <InputLabel parentState={parentState} labelProps={labelProps} />
          {render?.({
            ...rest,
            ref: innerRef,
            onChangeText,
            // @ts-ignore
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
              { paddingLeft, paddingRight },
              !multiline || (multiline && height) ? { height: flatHeight } : {},
              paddingFlat,
              // { backgroundColor: 'red' },
              {
                ...font,
                fontSize,
                fontWeight,
                color: inputTextColor,
                textAlignVertical: multiline ? 'top' : 'center',
              },
              leftType
                ? {
                    marginLeft: leftAffixWidth + ADORNMENT_OFFSET,
                    paddingLeft: leftType === 'affix' ? 0 : INPUT_OFFSET,
                  }
                : {},
              rightType
                ? {
                    marginRight: rightAffixWidth + ADORNMENT_OFFSET,
                    paddingRight: rightType === 'affix' ? 0 : INPUT_OFFSET,
                  }
                : {},
            ],
          })}
        </View>

        {leftType && leftType === 'icon'
          ? this.renderIcon({ side: 'left', iconTopPosition })
          : leftType && leftType === 'affix'
          ? this.renderAffix({
              side: 'left',
              textStyle: { ...font, fontSize, fontWeight },
              affixTopPosition,
            })
          : null}

        {rightType && rightType === 'icon'
          ? this.renderIcon({ side: 'right', iconTopPosition })
          : rightType && rightType === 'affix'
          ? this.renderAffix({
              side: 'right',
              textStyle: { ...font, fontSize, fontWeight },
              affixTopPosition,
            })
          : null}
      </View>
    );
  }
}

export default TextInputFlat;

type UnderlineProps = {
  parentState: {
    focused: boolean;
  };
  error?: boolean;
  colors: {
    error: string;
  };
  activeColor: string;
  underlineColorCustom?: string;
};

const Underline = ({
  parentState,
  error,
  colors,
  activeColor,
  underlineColorCustom,
}: UnderlineProps) => {
  let backgroundColor = parentState.focused
    ? activeColor
    : underlineColorCustom;
  if (error) backgroundColor = colors.error;
  return (
    <Animated.View
      style={[
        styles.underline,
        {
          backgroundColor,
          // Underlines is thinner when input is not focused
          transform: [{ scaleY: parentState.focused ? 1 : 0.5 }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  placeholder: {
    position: 'absolute',
    left: 0,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
  },
  input: {
    flexGrow: 1,
    margin: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    zIndex: 1,
  },
  inputFlat: {
    paddingTop: 24,
    paddingBottom: 4,
  },
  inputFlatDense: {
    paddingTop: 22,
    paddingBottom: 2,
  },
});
