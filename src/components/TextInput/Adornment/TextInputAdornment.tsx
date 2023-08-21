import React from 'react';
import type {
  LayoutChangeEvent,
  TextStyle,
  StyleProp,
  Animated,
} from 'react-native';

import type { ThemeProp } from 'src/types';

import { AdornmentSide, AdornmentType, InputMode } from './enums';
import TextInputAffix, { AffixAdornment } from './TextInputAffix';
import TextInputIcon, { IconAdornment } from './TextInputIcon';
import type {
  AdornmentConfig,
  AdornmentStyleAdjustmentForNativeInput,
} from './types';
import { getConstants } from '../helpers';

export function getAdornmentConfig({
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
}): Array<AdornmentConfig> {
  let adornmentConfig: any[] = [];
  if (left || right) {
    [
      { side: AdornmentSide.Left, adornment: left },
      { side: AdornmentSide.Right, adornment: right },
    ].forEach(({ side, adornment }) => {
      if (adornment && React.isValidElement(adornment)) {
        let type;
        if (adornment.type === TextInputAffix) {
          type = AdornmentType.Affix;
        } else if (adornment.type === TextInputIcon) {
          type = AdornmentType.Icon;
        }
        adornmentConfig.push({
          side,
          type,
        });
      }
    });
  }

  return adornmentConfig;
}

export function getAdornmentStyleAdjustmentForNativeInput({
  adornmentConfig,
  leftAffixWidth,
  rightAffixWidth,
  paddingHorizontal,
  inputOffset = 0,
  mode,
  isV3,
}: {
  inputOffset?: number;
  adornmentConfig: AdornmentConfig[];
  leftAffixWidth: number;
  rightAffixWidth: number;
  mode?: 'outlined' | 'flat';
  paddingHorizontal?: number | string;
  isV3?: boolean;
}): AdornmentStyleAdjustmentForNativeInput | {} {
  const { OUTLINED_INPUT_OFFSET, ADORNMENT_OFFSET } = getConstants(isV3);

  if (adornmentConfig.length) {
    const adornmentStyleAdjustmentForNativeInput = adornmentConfig.map(
      ({ type, side }: AdornmentConfig) => {
        const isLeftSide = side === AdornmentSide.Left;
        const inputModeAdornemntOffset =
          mode === InputMode.Outlined
            ? ADORNMENT_OFFSET + OUTLINED_INPUT_OFFSET
            : ADORNMENT_OFFSET;
        const paddingKey = `padding${captalize(side)}`;
        const affixWidth = isLeftSide ? leftAffixWidth : rightAffixWidth;
        const padding =
          typeof paddingHorizontal === 'number'
            ? paddingHorizontal
            : inputModeAdornemntOffset;
        const offset = affixWidth + padding;

        const isAffix = type === AdornmentType.Affix;
        const marginKey = `margin${captalize(side)}`;

        return {
          [marginKey]: isAffix ? 0 : offset,
          [paddingKey]: isAffix ? offset : inputOffset,
        };
      }
    );
    const allStyleAdjustmentsMerged =
      adornmentStyleAdjustmentForNativeInput.reduce(
        (mergedStyles, currentStyle) => {
          return {
            ...mergedStyles,
            ...currentStyle,
          };
        },
        {}
      );
    return allStyleAdjustmentsMerged;
  } else {
    return [{}];
  }
}

const captalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export interface TextInputAdornmentProps {
  forceFocus: () => void;
  adornmentConfig: AdornmentConfig[];
  topPosition: {
    [AdornmentType.Affix]: {
      [AdornmentSide.Left]: number | null;
      [AdornmentSide.Right]: number | null;
    };
    [AdornmentType.Icon]: number;
  };
  onAffixChange: {
    [AdornmentSide.Left]: (event: LayoutChangeEvent) => void;
    [AdornmentSide.Right]: (event: LayoutChangeEvent) => void;
  };
  left?: React.ReactNode;
  right?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  visible?: Animated.Value;
  isTextInputFocused: boolean;
  paddingHorizontal?: number | string;
  maxFontSizeMultiplier?: number | undefined | null;
  theme?: ThemeProp;
  disabled?: boolean;
}

const TextInputAdornment: React.FunctionComponent<TextInputAdornmentProps> = ({
  adornmentConfig,
  left,
  right,
  onAffixChange,
  textStyle,
  visible,
  topPosition,
  isTextInputFocused,
  forceFocus,
  paddingHorizontal,
  maxFontSizeMultiplier,
  theme,
  disabled,
}) => {
  if (adornmentConfig.length) {
    return (
      <>
        {adornmentConfig.map(({ type, side }: AdornmentConfig) => {
          let inputAdornmentComponent;
          if (side === AdornmentSide.Left) {
            inputAdornmentComponent = left;
          } else if (side === AdornmentSide.Right) {
            inputAdornmentComponent = right;
          }

          const commonProps = {
            side: side,
            testID: `${side}-${type}-adornment`,
            isTextInputFocused,
            paddingHorizontal,
            disabled,
          };
          if (type === AdornmentType.Icon) {
            return (
              <IconAdornment
                {...commonProps}
                theme={theme}
                key={side}
                icon={inputAdornmentComponent}
                topPosition={topPosition[AdornmentType.Icon]}
                forceFocus={forceFocus}
              />
            );
          } else if (type === AdornmentType.Affix) {
            return (
              <AffixAdornment
                {...commonProps}
                key={side}
                topPosition={topPosition[AdornmentType.Affix][side]}
                affix={inputAdornmentComponent}
                textStyle={textStyle}
                onLayout={onAffixChange[side]}
                visible={visible}
                maxFontSizeMultiplier={maxFontSizeMultiplier}
              />
            );
          } else {
            return null;
          }
        })}
      </>
    );
  } else {
    return null;
  }
};

export default TextInputAdornment;
