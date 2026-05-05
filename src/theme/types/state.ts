export type InteractionState =
  | 'hovered'
  | 'focused'
  | 'pressed'
  | 'dragged'
  | 'disabled'
  | 'enabled';

export type ThemeState = {
  opacity: Record<InteractionState, number>;
};
