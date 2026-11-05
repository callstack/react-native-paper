import RangeSliderComponent, {
  type Props as RangeSliderProps,
} from './RangeSlider';
import SliderComponent, { type Props as SliderProps } from './Slider';

const Slider = Object.assign(
  // @component ./Slider.tsx
  SliderComponent,
  {
    // @component ./RangeSlider.tsx
    Range: RangeSliderComponent,
  }
);

export default Slider;
export { default as RangeSlider } from './RangeSlider';
export type { SliderProps, RangeSliderProps };
