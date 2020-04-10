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
}): Array<AdornmentStyleAdjustmentForNativeInput | {}> | [{}] {
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
        } else if (side === AdornmentSide.Right) {
          return {
            paddingRight:
              rightAffixWidth +
              ADORNMENT_OFFSET +
              (type === AdornmentType.Affix ? 0 : inputOffset),
          };
        } else {
          return {};
        }
      }
    );
    return adornmentStyleAdjustmentForNativeInput;
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

class TextInputAdornment extends React.Component<TextInputAdornmentProps> {
  render() {
    const {
      adornmentConfig,
      left,
      right,
      onAffixChange,
      textStyle,
      affixTopPosition,
      visible,
      iconTopPosition,
    } = this.props;

    if (adornmentConfig.length) {
      return adornmentConfig.map(({ type, side }: AdornmentConfig) => {
        let adornmentInputComponent;
        if (side === AdornmentSide.Left) {
          adornmentInputComponent = left;
        } else if (side === AdornmentSide.Right) {
          adornmentInputComponent = right;
        }

        if (type === AdornmentType.Icon) {
          return (
            // @ts-ignore
            <IconAdornment
              key={side}
              icon={adornmentInputComponent}
              side={side}
              iconTopPosition={iconTopPosition}
            />
          );
        } else if (type === AdornmentType.Affix) {
          return (
            // @ts-ignore
            <AffixAdornment
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
      });
    } else {
      return null;
    }
  }
}

export default TextInputAdornment;
