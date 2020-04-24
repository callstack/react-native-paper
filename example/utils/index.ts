type ReducerAction = {
  payload: string;
  type: string;
};

export function inputReducer(state: any, action: ReducerAction) {
  switch (action.type) {
    case action.type:
      state[action.type] = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
}
