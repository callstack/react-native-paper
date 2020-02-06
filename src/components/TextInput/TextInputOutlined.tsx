import * as React from 'react';
import {
  View,
  TextInput as NativeTextInput,
  StyleSheet,
  I18nManager,
  Platform,
  TextStyle,
  LayoutChangeEvent,
  StyleProp,
} from 'react-native';
import color from 'color';

import InputLabel from './Label/InputLabel';
import LabelBackground from './Label/LabelBackground';
import TextInputAffix from './Affix';
import TextInputIcon from './Icon';
import { RenderProps, ChildTextInputProps } from './types';
import { Theme } from '../../types';

import {
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
  LABEL_WIGGLE_X_OFFSET,
} from './constants';

import {
  calculateLabelTopPosition,
  calculateInputHeight,
  calculatePadding,
  adjustPaddingOut,
  Padding,
  interpolatePlaceholder,
} from './helpers';

const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -6;
const LABEL_PADDING_TOP = 8;
const MIN_HEIGHT = 64;
const MIN_DENSE_HEIGHT = 48;
const INPUT_PADDING_HORIZONTAL = 14;

const ADORNMENT_SIZE = 24;
const ADORNMENT_OFFSET = 12;

type State = {
  leftWidth: number | null;
  leftHeight: number | null;
  rightWidth: number | null;
  rightHeight: number | null;
};

type AdornmentType = 'icon' | 'affix' | null;

class TextInputOutlined extends React.Component<ChildTextInputProps, State> {
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
        style: { top: affixTopPosition, left: ADORNMENT_OFFSET },
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
      backgroundColor = colors.background,
      ...viewStyle
    } = (StyleSheet.flatten(style) || {}) as TextStyle;
    const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

    let inputTextColor,
      activeColor,
      outlineColor,
      placeholderColor,
      errorColor,
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
      errorColor = colors.error;
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

    let labelTranslationXOffset = 0;

    if (
      leftAdornment &&
      React.isValidElement(leftAdornment) &&
      leftAdornment.type === TextInputIcon
    ) {
      labelTranslationXOffset =
        (I18nManager.isRTL ? -1 : 1) * (ADORNMENT_SIZE + ADORNMENT_OFFSET - 8);
    }

    let leftType: AdornmentType = null;
    let rightType: AdornmentType = null;

    if (leftAdornment && React.isValidElement(leftAdornment)) {
      if (leftAdornment.type === TextInputAffix) {
        leftType = 'affix';
      } else if (leftAdornment.type === TextInputIcon) {
        leftType = 'icon';
      }
    }

    if (rightAdornment && React.isValidElement(rightAdornment)) {
      if (rightAdornment.type === TextInputAffix) {
        rightType = 'affix';
      } else if (rightAdornment.type === TextInputIcon) {
        rightType = 'icon';
      }
    }

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
      height: height ? +height : null,
      labelHalfHeight,
      offset: LABEL_PADDING_TOP,
      multiline: multiline ? multiline : null,
      dense: dense ? dense : null,
      topPosition,
      fontSize,
      label,
      scale: fontScale,
      isAndroid: Platform.OS === 'android',
      styles: StyleSheet.flatten(
        dense ? styles.inputOutlinedDense : styles.inputOutlined
      ) as Padding,
    };

    const pad = calculatePadding(paddingSettings);

    const paddingOut = adjustPaddingOut({ ...paddingSettings, pad });

    const baseLabelTranslateY =
      -labelHalfHeight - (topPosition + OUTLINE_MINIMIZED_LABEL_Y_OFFSET);

    const placeholderOpacity = interpolatePlaceholder(
      parentState.labeled,
      hasActiveOutline
    );

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
      hasActiveOutline,
      activeColor,
      placeholderColor,
      backgroundColor,
      errorColor,
      labelTranslationXOffset,
    };

    const minHeight = (height ||
      (dense ? MIN_DENSE_HEIGHT : MIN_HEIGHT)) as number;

    const iconTopPosition =
      (minHeight + LABEL_PADDING_TOP - ADORNMENT_SIZE) / 2;

    const affixTopPosition =
      (minHeight +
        LABEL_PADDING_TOP -
        (this.state.leftHeight || this.state.rightHeight || 0)) /
      2;

    const rightAffixWidth = rightAdornment
      ? this.state.rightWidth || ADORNMENT_SIZE
      : ADORNMENT_SIZE;

    const leftAffixWidth = leftAdornment
      ? this.state.leftWidth || ADORNMENT_SIZE
      : ADORNMENT_SIZE;

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
            backgroundColor={backgroundColor}
          />
          <View
            style={{
              paddingTop: LABEL_PADDING_TOP,
              paddingBottom: 0,
              minHeight,
            }}
          >
            <InputLabel
              parentState={parentState}
              labelProps={labelProps}
              labelBackground={LabelBackground}
            />

            {render?.({
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
                  ...font,
                  fontSize,
                  fontWeight,
                  color: inputTextColor,
                  textAlignVertical: multiline ? 'top' : 'center',
                },
                rightType
                  ? {
                      marginRight: rightAffixWidth + ADORNMENT_OFFSET,
                      paddingRight: rightType === 'affix' ? 0 : 8,
                    }
                  : {},
                leftType
                  ? {
                      marginLeft: leftAffixWidth + ADORNMENT_OFFSET,
                      paddingLeft: leftType === 'affix' ? 0 : 8,
                    }
                  : {},
              ],
            } as RenderProps)}
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
      </View>
    );
  }
}

export default TextInputOutlined;

type OutlineType = {
  activeColor: string;
  hasActiveOutline: boolean | undefined;
  outlineColor: string | undefined;
  backgroundColor: string | undefined;
  theme: Theme;
};

const Outline = ({
  theme,
  hasActiveOutline,
  activeColor,
  outlineColor,
  backgroundColor,
}: OutlineType) => (
  <View
    pointerEvents="none"
    style={[
      styles.outline,
      // eslint-disable-next-line react-native/no-inline-styles
      {
        backgroundColor,
        borderRadius: theme.roundness,
        borderWidth: hasActiveOutline ? 2 : 1,
        borderColor: hasActiveOutline ? activeColor : outlineColor,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
  },
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
  },
  input: {
    flexGrow: 1,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
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
