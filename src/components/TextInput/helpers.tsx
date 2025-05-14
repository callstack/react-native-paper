import { Platform } from 'react-native';

import color from 'color';

import { AdornmentSide, AdornmentType } from './Adornment/enums';
import type { AdornmentConfig } from './Adornment/types';
import {
  MIN_WIDTH,
  ADORNMENT_SIZE,
  MD3_ADORNMENT_OFFSET,
  MD3_AFFIX_OFFSET,
  MD3_FLAT_INPUT_OFFSET,
  MD3_ICON_OFFSET,
  MD3_INPUT_PADDING_HORIZONTAL,
  MD3_LABEL_PADDING_HORIZONTAL,
  MD3_LABEL_PADDING_TOP,
  MD3_MIN_HEIGHT,
  MD3_OUTLINED_INPUT_OFFSET,
} from './constants';
import type { TextInputLabelProp } from './types';
import type { InternalTheme } from '../../types';

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

  if (!isAndroid && height && !multiline) {
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
}: {
  adornmentConfig: AdornmentConfig[];
}) => {
  const { LABEL_PADDING_HORIZONTAL, ADORNMENT_OFFSET, FLAT_INPUT_OFFSET } =
    getConstants();

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

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

type Mode = 'flat' | 'outlined';

const getInputTextColor = ({
  theme,
  textColor,
  disabled,
}: BaseProps & { textColor?: string }) => {
  const {
    colors: { onSurfaceDisabled, onSurface },
  } = theme;

  if (textColor) {
    return textColor;
  }

  if (disabled) {
    return onSurfaceDisabled;
  }

  return onSurface;
};

const getActiveColor = ({
  theme,
  disabled,
  error,
  activeUnderlineColor,
  activeOutlineColor,
  mode,
}: BaseProps & {
  error?: boolean;
  activeUnderlineColor?: string;
  activeOutlineColor?: string;
  mode?: Mode;
}) => {
  const {
    colors: { error: errorColor, onSurfaceDisabled, primary },
  } = theme;

  const isFlat = mode === 'flat';
  const modeColor = isFlat ? activeUnderlineColor : activeOutlineColor;

  if (error) {
    return errorColor;
  }

  if (modeColor) {
    return modeColor;
  }

  if (disabled) {
    return onSurfaceDisabled;
  }

  return primary;
};

const getPlaceholderColor = ({ theme, disabled }: BaseProps) => {
  const {
    colors: { onSurfaceDisabled, onSurfaceVariant },
  } = theme;

  if (disabled) {
    return onSurfaceDisabled;
  }

  return onSurfaceVariant;
};

const getSelectionColor = ({
  activeColor,
  customSelectionColor,
}: {
  activeColor: string;
  customSelectionColor?: string;
}) => {
  if (typeof customSelectionColor !== 'undefined') {
    return customSelectionColor;
  }

  if (Platform.OS === 'android') {
    return color(activeColor).alpha(0.54).rgb().string();
  }

  return activeColor;
};

const getFlatBackgroundColor = ({ theme, disabled }: BaseProps) => {
  const {
    colors: { onSurface, surfaceVariant },
  } = theme;

  if (disabled) {
    return color(onSurface).alpha(0.04).rgb().string();
  } else {
    return surfaceVariant;
  }
};

const getFlatUnderlineColor = ({
  theme,
  disabled,
  underlineColor,
}: BaseProps & { underlineColor?: string }) => {
  const {
    colors: { onSurfaceDisabled, onSurfaceVariant },
  } = theme;

  if (!disabled && underlineColor) {
    return underlineColor;
  }

  if (disabled) {
    return onSurfaceDisabled;
  }

  return onSurfaceVariant;
};

const getOutlinedOutlineInputColor = ({
  theme,
  disabled,
  customOutlineColor,
}: BaseProps & { customOutlineColor?: string }) => {
  const {
    dark,
    colors: { surfaceDisabled, outline },
  } = theme;

  if (!disabled && customOutlineColor) {
    return customOutlineColor;
  }

  if (disabled) {
    if (dark) {
      return 'transparent';
    }
    return surfaceDisabled;
  }

  return outline;
};

export const getFlatInputColors = ({
  underlineColor,
  activeUnderlineColor,
  customSelectionColor,
  textColor,
  disabled,
  error,
  theme,
}: {
  underlineColor?: string;
  activeUnderlineColor?: string;
  customSelectionColor?: string;
  textColor?: string;
  disabled?: boolean;
  error?: boolean;
  theme: InternalTheme;
}) => {
  const {
    colors: { error: errorColor },
  } = theme;

  const baseFlatColorProps = { theme, disabled };
  const activeColor = getActiveColor({
    ...baseFlatColorProps,
    error,
    activeUnderlineColor,
    mode: 'flat',
  });

  return {
    inputTextColor: getInputTextColor({
      ...baseFlatColorProps,
      textColor,
    }),
    activeColor,
    underlineColorCustom: getFlatUnderlineColor({
      ...baseFlatColorProps,
      underlineColor,
    }),
    placeholderColor: getPlaceholderColor(baseFlatColorProps),
    selectionColor: getSelectionColor({ activeColor, customSelectionColor }),
    errorColor,
    backgroundColor: getFlatBackgroundColor(baseFlatColorProps),
  };
};

export const getOutlinedInputColors = ({
  activeOutlineColor,
  customOutlineColor,
  customSelectionColor,
  textColor,
  disabled,
  error,
  theme,
}: {
  activeOutlineColor?: string;
  customOutlineColor?: string;
  customSelectionColor?: string;
  textColor?: string;
  disabled?: boolean;
  error?: boolean;
  theme: InternalTheme;
}) => {
  const {
    colors: { error: errorColor },
  } = theme;

  const baseOutlinedColorProps = { theme, disabled };
  const activeColor = getActiveColor({
    ...baseOutlinedColorProps,
    error,
    activeOutlineColor,
    mode: 'outlined',
  });

  return {
    inputTextColor: getInputTextColor({
      ...baseOutlinedColorProps,
      textColor,
    }),
    activeColor,
    outlineColor: getOutlinedOutlineInputColor({
      ...baseOutlinedColorProps,
      customOutlineColor,
    }),
    placeholderColor: getPlaceholderColor(baseOutlinedColorProps),
    selectionColor: getSelectionColor({ activeColor, customSelectionColor }),
    errorColor,
  };
};

export const getConstants = () => {
  return {
    MIN_WIDTH,
    // Text input affix
    AFFIX_OFFSET: MD3_AFFIX_OFFSET,
    // Text input icon
    ICON_OFFSET: MD3_ICON_OFFSET,
    //Text input flat
    LABEL_PADDING_TOP: MD3_LABEL_PADDING_TOP,
    LABEL_PADDING_HORIZONTAL: MD3_LABEL_PADDING_HORIZONTAL,
    FLAT_INPUT_OFFSET: MD3_FLAT_INPUT_OFFSET,
    MIN_HEIGHT: MD3_MIN_HEIGHT,
    // Text input outlined;
    INPUT_PADDING_HORIZONTAL: MD3_INPUT_PADDING_HORIZONTAL,
    ADORNMENT_OFFSET: MD3_ADORNMENT_OFFSET,
    OUTLINED_INPUT_OFFSET: MD3_OUTLINED_INPUT_OFFSET,
  };
};
