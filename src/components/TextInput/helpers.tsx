import type { Animated } from 'react-native';
import type { AdornmentConfig } from './Adornment/types';
import {
  LABEL_PADDING_HORIZONTAL,
  ADORNMENT_OFFSET,
  ADORNMENT_SIZE,
  FLAT_INPUT_OFFSET,
} from './constants';
import { AdornmentType, AdornmentSide } from './Adornment/enums';
import type { TextInputLabelProp } from './types';

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
}: {
  adornmentConfig: AdornmentConfig[];
}) => {
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
