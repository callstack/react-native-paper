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

export type AdornmentConfig = {
  side: AdornmentSide;
  type: AdornmentType;
};
export type AdornmentStyleAdjustmentForNativeInput = {
  adornmentStyleAdjustmentForNativeInput: Array<
    { paddingRight?: number; paddingLeft?: number } | {}
  >;
};
