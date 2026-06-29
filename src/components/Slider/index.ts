import * as React from 'react';

import SliderComponent, { type Props } from './Slider';

type CenteredProps = Omit<Extract<Props, { variant: 'centered' }>, 'variant'>;
type RangeProps = Omit<Extract<Props, { variant: 'range' }>, 'variant'>;

const Slider = Object.assign(
  // @component ./Slider.tsx
  SliderComponent,
  {
    // @component ./Slider.tsx (variant="centered")
    Centered: (props: CenteredProps) =>
      React.createElement(SliderComponent, { ...props, variant: 'centered' }),
    // @component ./Slider.tsx (variant="range")
    Range: (props: RangeProps) =>
      React.createElement(SliderComponent, { ...props, variant: 'range' }),
  }
);

export default Slider;
export type { Props as SliderProps } from './Slider';
