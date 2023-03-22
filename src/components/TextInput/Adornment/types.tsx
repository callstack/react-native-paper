import type { AdornmentSide, AdornmentType } from './enums';

export type AdornmentConfig = {
  side: AdornmentSide;
  type: AdornmentType;
};
export type AdornmentStyleAdjustmentForNativeInput = {
  adornmentStyleAdjustmentForNativeInput: Array<
    { paddingEnd: number; paddingStart: number } | {}
  >;
};
