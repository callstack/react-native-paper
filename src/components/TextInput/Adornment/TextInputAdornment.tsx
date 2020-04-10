import React from 'react';
import TextInputIcon, { IconAdornment } from './Icon';
import TextInputAffix, { AffixAdornment } from './Affix';
import { ADORNMENT_OFFSET } from '../constants';
import {
  LayoutChangeEvent,
  TextStyle,
  StyleProp,
  Animated,
} from 'react-native';
import {
  AdornmentConfig,
  AdornmentSide,
  AdornmentType,
  AdornmentStyleAdjustmentForNativeInput,
} from './types';

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
  inputOffset = 0,
}: {
  inputOffset?: number;
  adornmentConfig: AdornmentConfig[];
  leftAffixWidth: number;
  rightAffixWidth: number;
}): AdornmentStyleAdjustmentForNativeInput | {} {
  if (adornmentConfig.length) {
    const adornmentStyleAdjustmentForNativeInput = adornmentConfig.map(
      ({ type, side }: AdornmentConfig) => {
        if (side === AdornmentSide.Left) {
          return {
            paddingLeft:
              leftAffixWidth +
              ADORNMENT_OFFSET +
              (type === AdornmentType.Affix ? 0 : inputOffset),
          };
        } else {
          return {
            paddingRight:
              rightAffixWidth +
              ADORNMENT_OFFSET +
              (type === AdornmentType.Affix ? 0 : inputOffset),
          };
        }
      }
    );
    const allStyleAdjustmentsMerged = adornmentStyleAdjustmentForNativeInput.reduce(
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

export interface TextInputAdornmentProps {
  adornmentConfig: AdornmentConfig[];
  affixTopPosition: {
    [AdornmentSide.Left]: number | null;
    [AdornmentSide.Right]: number | null;
  };
  onAffixChange: {
    [AdornmentSide.Left]: (event: LayoutChangeEvent) => void;
    [AdornmentSide.Right]: (event: LayoutChangeEvent) => void;
  };
  iconTopPosition: number;
  left?: React.ReactNode;
  right?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  visible?: Animated.Value;
}

const TextInputAdornment: React.FunctionComponent<TextInputAdornmentProps> = ({
  adornmentConfig,
  left,
  right,
  onAffixChange,
  textStyle,
  affixTopPosition,
  visible,
  iconTopPosition,
}) => {
  if (adornmentConfig.length) {
    return (
      <>
        {adornmentConfig.map(({ type, side }: AdornmentConfig) => {
          let adornmentInputComponent;
          if (side === AdornmentSide.Left) {
            adornmentInputComponent = left;
          } else if (side === AdornmentSide.Right) {
            adornmentInputComponent = right;
          }

          if (type === AdornmentType.Icon) {
            return (
              <IconAdornment
                key={side}
                icon={adornmentInputComponent}
                side={side}
                iconTopPosition={iconTopPosition}
              />
            );
          } else if (type === AdornmentType.Affix) {
            console.log('visible, at affix', side, visible);
            return (
              <AffixAdornment
                key={side}
                affix={adornmentInputComponent}
                side={side}
                textStyle={textStyle}
                affixTopPosition={affixTopPosition[side]}
                onLayout={onAffixChange[side]}
                visible={visible}
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
