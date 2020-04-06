import React from 'react';
import TextInputIcon, { renderIcon } from './Icon';
import TextInputAffix, { renderAffix } from './Affix';
import {
  LayoutChangeEvent,
  TextStyle,
  StyleProp,
  Animated,
} from 'react-native';

export enum AdornmentType {
  Icon = 'icon',
  Affix = 'affix',
}
export enum AdornmentSide {
  Right = 'right',
  Left = 'left',
}
export enum InputMode {
  Outlined = 'outlined',
  Flat = 'flat',
}
export const ADORNMENT_SIZE = 24;
export const ADORNMENT_OFFSET = 12;

export type AdornmentConfig = {
  side: AdornmentSide;
  type: AdornmentType;
};

type AdornmentStyleAdjustmentForNativeInput = {
  adornmentStyleAdjustmentForNativeInput: Array<
    { paddingRight?: number; paddingLeft?: number } | {}
  >;
};

export function getAdornmentConfig({
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
}): Array<AdornmentConfig> {
  let adornmentConfig: any[] = [];
  console.log('left', left);
  console.log('right', right);
  console.log('Boolean(left||right)', Boolean(left || right));
  if (left || right) {
    [
      { side: AdornmentSide.Left, adornment: left },
      { side: AdornmentSide.Right, adornment: right },
    ].forEach(({ side, adornment }) => {
      console.log(
        'adornment && React.isValidElement(adornment)',
        adornment && React.isValidElement(adornment),
        adornment
      );
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

export interface InputAdornmentProps {
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

class InputAdornment extends React.Component<InputAdornmentProps> {
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
          return renderIcon({
            icon: adornmentInputComponent,
            side,
            iconTopPosition,
          });
        } else if (type === AdornmentType.Affix) {
          return renderAffix({
            affix: adornmentInputComponent,
            side,
            textStyle,
            affixTopPosition: affixTopPosition[side],
            onLayout: onAffixChange[side],
            visible,
          });
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
  }
}

export default InputAdornment;
