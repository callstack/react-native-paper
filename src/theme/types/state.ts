export type InteractionState = 'hovered' | 'focused' | 'pressed' | 'dragged';

export type ThemeState = {
  opacity: Record<InteractionState, number>;
};
