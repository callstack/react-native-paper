import type { Animated } from 'react-native';
import color from 'color';
import type { AdornmentConfig } from './Adornment/types';
import {
  ADORNMENT_SIZE,
  MD3_LABEL_PADDING_HORIZONTAL,
  MD2_LABEL_PADDING_HORIZONTAL,
  MD3_ADORNMENT_OFFSET,
  MD2_ADORNMENT_OFFSET,
  MD3_FLAT_INPUT_OFFSET,
  MD2_FLAT_INPUT_OFFSET,
  MD3_AFFIX_OFFSET,
  MD2_AFFIX_OFFSET,
  MD3_ICON_OFFSET,
  MD2_ICON_OFFSET,
  MD3_LABEL_PADDING_TOP,
  MD2_LABEL_PADDING_TOP,
  MD3_MIN_HEIGHT,
  MD2_MIN_HEIGHT,
  MD3_INPUT_PADDING_HORIZONTAL,
  MD2_INPUT_PADDING_HORIZONTAL,
  MD3_OUTLINED_INPUT_OFFSET,
  MD2_OUTLINED_INPUT_OFFSET,
} from './constants';
import { AdornmentType, AdornmentSide } from './Adornment/enums';
import type { TextInputLabelProp } from './types';
import MD3LightTheme from '../../styles/themes/v3/LightTheme';
import type { Theme } from '../../types';

type PaddingProps = {
  height: number | null;
  labelHalfHeight: number;
  multiline: boolean | null;
  dense: boolean | null;
  topPosition: number;
  fontSize: number;
  lineHeight?: number;
  label?: TextInputLabelProp | null;
  scale: number;
  offset: number;
  isAndroid: boolean;
  styles: { paddingTop: number; paddingBottom: number };
};

type AdjProps = PaddingProps & {
  pad: number;
};

export type Padding = { paddingTop: number; paddingBottom: number };

export const calculateLabelTopPosition = (
  labelHeight: number,
  height: number = 0,
  optionalPadding: number = 0
): number => {
  const customHeight = height > 0 ? height : 0;

  return Math.floor((customHeight - labelHeight) / 2 + optionalPadding);
};

export const calculateInputHeight = (
  labelHeight: number,
  height: any = 0,
  minHeight: number
): number => {
  const finalHeight = height > 0 ? height : labelHeight;

  if (height > 0) return height;
  return finalHeight < minHeight ? minHeight : finalHeight;
};

export const calculatePadding = (props: PaddingProps): number => {
  const { height, multiline = false } = props;

  let result = 0;

  if (multiline) {
    if (height && multiline) {
      result = calculateTextAreaPadding(props);
    } else {
      result = calculateInputPadding(props);
    }
  }

  return Math.max(0, result);
};

const calculateTextAreaPadding = (props: PaddingProps) => {
  const { dense } = props;

  return dense ? 10 : 20;
};

const calculateInputPadding = ({
  topPosition,
  fontSize,
  multiline,
  scale,
  dense,
  offset,
  isAndroid,
}: PaddingProps): number => {
  const refFontSize = scale * fontSize;
  let result = Math.floor(topPosition / 2);

  result =
    result +
    Math.floor((refFontSize - fontSize) / 2) -
    (scale < 1 ? offset / 2 : 0);

  if (multiline && isAndroid)
    result = Math.min(dense ? offset / 2 : offset, result);

  return result;
};

export const adjustPaddingOut = ({
  pad,
  multiline,
  label,
  scale,
  height,
  fontSize,
  lineHeight,
  dense,
  offset,
  isAndroid,
}: AdjProps): Padding => {
  const fontHeight = lineHeight ?? fontSize;
  const refFontHeight = scale * fontSize;
  let result = pad;

  if (height && !multiline) {
    return {
      paddingTop: Math.max(0, (height - fontHeight) / 2),
      paddingBottom: Math.max(0, (height - fontHeight) / 2),
    };
  }
  if (!isAndroid && multiline) {
    if (dense) {
      if (label) {
        result += scale < 1 ? Math.min(offset, (refFontHeight / 2) * scale) : 0;
      } else {
        result += 0;
      }
    }
    if (!dense) {
      if (label) {
        result +=
          scale < 1
            ? Math.min(offset, refFontHeight * scale)
            : Math.min(offset / 2, refFontHeight * scale);
      } else {
        result += scale < 1 ? Math.min(offset / 2, refFontHeight * scale) : 0;
      }
    }
    result = Math.floor(result);
  }
  return { paddingTop: result, paddingBottom: result };
};

export const adjustPaddingFlat = ({
  pad,
  scale,
  multiline,
  label,
  height,
  offset,
  dense,
  fontSize,
  isAndroid,
  styles,
}: AdjProps): Padding => {
  let result = pad;
  let topResult = result;
  let bottomResult = result;
  const { paddingTop, paddingBottom } = styles;
  const refFontSize = scale * fontSize;

  if (!multiline) {
    // do not modify padding if input is not multiline
    if (label) {
      // return const style for flat input with label
      return { paddingTop, paddingBottom };
    }
    // return pad for flat input without label
    return { paddingTop: result, paddingBottom: result };
  }

  if (label) {
    // add paddings passed from styles
    topResult = paddingTop;
    bottomResult = paddingBottom;

    // adjust top padding for iOS
    if (!isAndroid) {
      if (dense) {
        topResult +=
          scale < 1
            ? Math.min(result, refFontSize * scale) - result / 2
            : Math.min(result, refFontSize * scale) - result / 2;
      }
      if (!dense) {
        topResult +=
          scale < 1
            ? Math.min(offset / 2, refFontSize * scale)
            : Math.min(result, refFontSize * scale) - offset / 2;
      }
    }
    topResult = Math.floor(topResult);
  } else {
    if (height) {
      // center text when height is passed
      return {
        paddingTop: Math.max(0, (height - fontSize) / 2),
        paddingBottom: Math.max(0, (height - fontSize) / 2),
      };
    }
    // adjust paddings for iOS if no label
    if (!isAndroid) {
      if (dense) {
        result +=
          scale < 1
            ? Math.min(offset / 2, (fontSize / 2) * scale)
            : Math.min(offset / 2, scale);
      }
      if (!dense) {
        result +=
          scale < 1
            ? Math.min(offset, fontSize * scale)
            : Math.min(fontSize, (offset / 2) * scale);
      }

      result = Math.floor(result);
      topResult = result;
      bottomResult = result;
    }
  }

  return {
    paddingTop: Math.max(0, topResult),
    paddingBottom: Math.max(0, bottomResult),
  };
};

export const interpolatePlaceholder = (
  labeled: Animated.Value,
  hasActiveOutline: boolean | undefined
) =>
  labeled.interpolate({
    inputRange: [0, 1],
    outputRange: [hasActiveOutline ? 0 : 1, 1],
  });

export function calculateFlatAffixTopPosition({
  height,
  paddingTop,
  paddingBottom,
  affixHeight,
}: {
  height: number;
  paddingTop: number;
  paddingBottom: number;
  affixHeight: number;
}): number {
  const inputHeightWithoutPadding = height - paddingTop - paddingBottom;

  const halfOfTheInputHeightDecreasedByAffixHeight =
    (inputHeightWithoutPadding - affixHeight) / 2;

  return paddingTop + halfOfTheInputHeightDecreasedByAffixHeight;
}

export function calculateOutlinedIconAndAffixTopPosition({
  height,
  affixHeight,
  labelYOffset,
}: {
  height: number;
  affixHeight: number;
  labelYOffset: number;
}): number {
  return (height - affixHeight + labelYOffset) / 2;
}

export const calculateFlatInputHorizontalPadding = ({
  adornmentConfig,
  isV3,
}: {
  adornmentConfig: AdornmentConfig[];
  isV3?: boolean;
}) => {
  const { LABEL_PADDING_HORIZONTAL, ADORNMENT_OFFSET, FLAT_INPUT_OFFSET } =
    getConstants(isV3);

  let paddingLeft = LABEL_PADDING_HORIZONTAL;
  let paddingRight = LABEL_PADDING_HORIZONTAL;

  adornmentConfig.forEach(({ type, side }) => {
    if (type === AdornmentType.Icon && side === AdornmentSide.Left) {
      paddingLeft = ADORNMENT_SIZE + ADORNMENT_OFFSET + FLAT_INPUT_OFFSET;
    } else if (side === AdornmentSide.Right) {
      if (type === AdornmentType.Affix) {
        paddingRight = ADORNMENT_SIZE + ADORNMENT_OFFSET + FLAT_INPUT_OFFSET;
      } else if (type === AdornmentType.Icon) {
        paddingRight = ADORNMENT_SIZE + ADORNMENT_OFFSET + FLAT_INPUT_OFFSET;
      }
    }
  });

  return { paddingLeft, paddingRight };
};

export const getFlatInputColors = ({
  underlineColor,
  activeUnderlineColor,
  disabled,
  error,
  theme,
}: {
  underlineColor?: string;
  activeUnderlineColor?: string;
  disabled?: boolean;
  error?: boolean;
  theme: Theme;
}) => {
  let inputTextColor,
    activeColor,
    underlineColorCustom,
    placeholderColor,
    errorColor,
    backgroundColor;

  // The same for both themes
  activeColor = error
    ? theme.colors?.error
    : activeUnderlineColor || theme.colors?.primary;
  errorColor = theme.colors?.error;

  if (theme.isV3) {
    if (disabled) {
      inputTextColor =
        activeColor =
        placeholderColor =
        underlineColorCustom =
          theme.colors.onSurfaceDisabled;
      // @ts-ignore According to Figma for both themes the base color for disabled in `onSecondaryContainer`
      backgroundColor = color(MD3LightTheme.colors.onSecondaryContainer)
        .alpha(0.08)
        .rgb()
        .string();
    } else {
      inputTextColor = placeholderColor = theme.colors.onSurfaceVariant;
      underlineColorCustom = underlineColor || theme.colors.onSurface;
      backgroundColor = theme.colors.surfaceVariant;
    }
  } else {
    if (disabled) {
      inputTextColor = activeColor = color(theme.colors?.text)
        .alpha(0.54)
        .rgb()
        .string();
      placeholderColor = theme.colors.disabled;
      underlineColorCustom = 'transparent';
    } else {
      inputTextColor = theme.colors?.text;
      placeholderColor = theme.colors?.placeholder;
      underlineColorCustom = underlineColor || theme.colors.disabled;
      backgroundColor = theme.dark
        ? color(theme.colors?.background).lighten(0.24).rgb().string()
        : color(theme.colors?.background).darken(0.06).rgb().string();
    }
  }

  return {
    inputTextColor,
    activeColor,
    placeholderColor,
    underlineColorCustom,
    errorColor,
    backgroundColor,
  };
};

export const getOutlinedInputColors = ({
  activeOutlineColor,
  customOutlineColor,
  disabled,
  error,
  theme,
}: {
  activeOutlineColor?: string;
  customOutlineColor?: string;
  disabled?: boolean;
  error?: boolean;
  theme: Theme;
}) => {
  let inputTextColor, activeColor, outlineColor, placeholderColor, errorColor;

  const textColor = theme.isV3 ? theme.colors.onSurface : theme.colors.text;
  const isTransparent = color(customOutlineColor).alpha() === 0;

  // The same for both themes
  activeColor = error
    ? theme.colors?.error
    : activeOutlineColor || theme.colors?.primary;
  errorColor = theme.colors?.error;

  if (theme.isV3) {
    if (disabled) {
      inputTextColor = activeColor = theme.colors.onSurfaceDisabled;
      placeholderColor = theme.colors.onSurfaceDisabled;
      outlineColor = theme.dark ? 'transparent' : theme.colors.surfaceDisabled;
    } else {
      inputTextColor = textColor;
      placeholderColor = theme.colors.onSurfaceVariant;
      outlineColor = customOutlineColor || theme.colors.outline;
    }
  } else {
    if (disabled) {
      inputTextColor = color(textColor).alpha(0.54).rgb().string();
      placeholderColor = theme.colors?.disabled;
      outlineColor = isTransparent ? customOutlineColor : theme.colors.disabled;
    } else {
      inputTextColor = textColor;
      placeholderColor = theme.colors.placeholder;
      outlineColor = customOutlineColor || theme.colors.placeholder;
    }
  }

  return {
    inputTextColor,
    activeColor,
    outlineColor,
    placeholderColor,
    errorColor,
  };
};

export const getConstants = (isV3?: boolean) => {
  // Text input affix
  let AFFIX_OFFSET;
  // Text input icon
  let ICON_OFFSET;
  //Text input flat
  let LABEL_PADDING_TOP;
  let LABEL_PADDING_HORIZONTAL;
  let FLAT_INPUT_OFFSET;
  let MIN_HEIGHT;
  // Text input outlined;
  let INPUT_PADDING_HORIZONTAL;
  let ADORNMENT_OFFSET;
  let OUTLINED_INPUT_OFFSET;

  if (isV3) {
    AFFIX_OFFSET = MD3_AFFIX_OFFSET;
    ICON_OFFSET = MD3_ICON_OFFSET;
    LABEL_PADDING_TOP = MD3_LABEL_PADDING_TOP;
    LABEL_PADDING_HORIZONTAL = MD3_LABEL_PADDING_HORIZONTAL;
    FLAT_INPUT_OFFSET = MD3_FLAT_INPUT_OFFSET;
    MIN_HEIGHT = MD3_MIN_HEIGHT;
    INPUT_PADDING_HORIZONTAL = MD3_INPUT_PADDING_HORIZONTAL;
    ADORNMENT_OFFSET = MD3_ADORNMENT_OFFSET;
    OUTLINED_INPUT_OFFSET = MD3_OUTLINED_INPUT_OFFSET;
  } else {
    AFFIX_OFFSET = MD2_AFFIX_OFFSET;
    ICON_OFFSET = MD2_ICON_OFFSET;
    LABEL_PADDING_TOP = MD2_LABEL_PADDING_TOP;
    LABEL_PADDING_HORIZONTAL = MD2_LABEL_PADDING_HORIZONTAL;
    FLAT_INPUT_OFFSET = MD2_FLAT_INPUT_OFFSET;
    MIN_HEIGHT = MD2_MIN_HEIGHT;
    INPUT_PADDING_HORIZONTAL = MD2_INPUT_PADDING_HORIZONTAL;
    ADORNMENT_OFFSET = MD2_ADORNMENT_OFFSET;
    OUTLINED_INPUT_OFFSET = MD2_OUTLINED_INPUT_OFFSET;
  }

  return {
    AFFIX_OFFSET,
    ICON_OFFSET,
    LABEL_PADDING_TOP,
    LABEL_PADDING_HORIZONTAL,
    FLAT_INPUT_OFFSET,
    MIN_HEIGHT,
    INPUT_PADDING_HORIZONTAL,
    ADORNMENT_OFFSET,
    OUTLINED_INPUT_OFFSET,
  };
};
