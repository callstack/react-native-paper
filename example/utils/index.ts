type ReducerAction = {
  payload: string | boolean | IconsColor;
  type: string;
};

type IconsColor = {
  flatLeftIcon: string | undefined;
  flatRightIcon: string | undefined;
  outlineLeftIcon: string | undefined;
  outlineRightIcon: string | undefined;
  customIcon: string | undefined;
};

export type State = {
  text: string;
  customIconText: string;
  name: string;
  outlinedText: string;
  largeText: string;
  flatTextPassword: string;
  outlinedLargeText: string;
  outlinedTextPassword: string;
  nameNoPadding: string;
  flatDenseText: string;
  flatDense: string;
  outlinedDenseText: string;
  outlinedDense: string;
  flatMultiline: string;
  flatTextArea: string;
  outlinedMultiline: string;
  outlinedTextArea: string;
  maxLengthName: string;
  flatTextSecureEntry: boolean;
  outlineTextSecureEntry: boolean;
  iconsColor: IconsColor;
};

export function inputReducer(state: State, action: ReducerAction) {
  switch (action.type) {
    case action.type:
      //@ts-ignore
      state[action.type] = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
}
