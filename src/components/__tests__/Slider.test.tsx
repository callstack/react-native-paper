import { Platform } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { fireEvent, render, screen } from '../../test-utils';
import RangeSlider from '../Slider/RangeSlider';
import Slider from '../Slider/Slider';
import {
  clamp,
  getRatioFromValue,
  getTickMarks,
  getValueFromRatio,
  snapToStep,
} from '../Slider/utils';

describe('Slider utilities', () => {
  it('clamps values within min and max', () => {
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp(-50, 0, 100)).toBe(0);
    expect(clamp(45, 0, 100)).toBe(45);
  });

  it('snaps values to nearest step', () => {
    expect(snapToStep(23, 0, 100, 10)).toBe(20);
    expect(snapToStep(27, 0, 100, 10)).toBe(30);
    expect(snapToStep(0.24, 0, 1, 0.1)).toBe(0.2);
    expect(snapToStep(0.26, 0, 1, 0.1)).toBe(0.3);
  });

  it('computes ratio and value accurately', () => {
    expect(getRatioFromValue(50, 0, 100)).toBe(0.5);
    expect(getRatioFromValue(0, -50, 50)).toBe(0.5);
    expect(getValueFromRatio(0.5, 0, 100, 5)).toBe(50);
  });

  it('generates normalized tick marks', () => {
    const ticks = getTickMarks(0, 100, 25);
    expect(ticks).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });
});

describe('Slider render', () => {
  it('renders standard continuous slider', async () => {
    const { toJSON } = await render(<Slider value={50} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders discrete slider with tick marks', async () => {
    const { toJSON } = await render(
      <Slider value={40} min={0} max={100} step={20} showTickMarks />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders centered slider', async () => {
    const { toJSON } = await render(
      <Slider value={10} min={-50} max={50} centered origin={0} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders disabled slider', async () => {
    const { toJSON } = await render(<Slider value={30} disabled />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with start and end icons', async () => {
    const { toJSON } = await render(
      <Slider value={60} startIcon="volume-low" endIcon="volume-high" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with value indicator visible', async () => {
    const { toJSON } = await render(
      <Slider
        value={75}
        labelBehavior="visible"
        formatValueIndicator={(v) => `${v}%`}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('Slider accessibility', () => {
  it('has adjustable role and exposes accessibility value attributes', async () => {
    await render(
      <Slider
        value={42}
        min={0}
        max={100}
        accessibilityLabel="Volume"
        formatValueIndicator={(v) => `${v}%`}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeOnTheScreen();
    expect(slider).toHaveProp('aria-valuenow', 42);
    expect(slider).toHaveProp('aria-valuemin', 0);
    expect(slider).toHaveProp('aria-valuemax', 100);
    expect(slider).toHaveProp('aria-valuetext', '42%');
    expect(slider).toHaveProp('aria-label', 'Volume');
    expect(slider).toBeEnabled();
  });

  it('sets aria-disabled when disabled', async () => {
    await render(<Slider value={20} disabled />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
    expect(slider).toHaveProp('aria-disabled', true);
  });
});

describe('RangeSlider render & accessibility', () => {
  it('renders range slider', async () => {
    const { toJSON } = await render(
      <RangeSlider values={[20, 80]} min={0} max={100} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders disabled range slider', async () => {
    const { toJSON } = await render(<RangeSlider values={[20, 80]} disabled />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('has two accessible slider handles for range', async () => {
    await render(
      <RangeSlider
        values={[25, 75]}
        min={0}
        max={100}
        startAccessibilityLabel="Price minimum"
        endAccessibilityLabel="Price maximum"
      />
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);

    expect(sliders[0]).toHaveProp('aria-label', 'Price minimum');
    expect(sliders[0]).toHaveProp('aria-valuenow', 25);

    expect(sliders[1]).toHaveProp('aria-label', 'Price maximum');
    expect(sliders[1]).toHaveProp('aria-valuenow', 75);
  });
});

describe('Slider interaction (web keyboard navigation)', () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = 'web';
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('navigates with ArrowRight and ArrowLeft', async () => {
    const onValueChange = jest.fn();
    const onSlidingComplete = jest.fn();

    await render(
      <Slider
        defaultValue={50}
        min={0}
        max={100}
        step={5}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
      />
    );

    const slider = screen.getByRole('slider');
    await fireEvent(slider, 'keyDown', {
      key: 'ArrowRight',
      preventDefault: jest.fn(),
    });
    expect(onValueChange).toHaveBeenCalledWith(55);
    expect(onSlidingComplete).toHaveBeenCalledWith(55);

    await fireEvent(slider, 'keyDown', {
      key: 'ArrowLeft',
      preventDefault: jest.fn(),
    });
    expect(onValueChange).toHaveBeenCalledWith(50);
  });

  it('navigates with Home and End', async () => {
    const onValueChange = jest.fn();

    await render(
      <Slider
        defaultValue={50}
        min={0}
        max={100}
        step={5}
        onValueChange={onValueChange}
      />
    );

    const slider = screen.getByRole('slider');
    await fireEvent(slider, 'keyDown', {
      key: 'Home',
      preventDefault: jest.fn(),
    });
    expect(onValueChange).toHaveBeenCalledWith(0);

    await fireEvent(slider, 'keyDown', {
      key: 'End',
      preventDefault: jest.fn(),
    });
    expect(onValueChange).toHaveBeenCalledWith(100);
  });

  it('does not respond to keyboard navigation when disabled', async () => {
    const onValueChange = jest.fn();

    await render(
      <Slider
        defaultValue={50}
        min={0}
        max={100}
        disabled
        onValueChange={onValueChange}
      />
    );

    const slider = screen.getByRole('slider');
    await fireEvent(slider, 'keyDown', {
      key: 'ArrowRight',
      preventDefault: jest.fn(),
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('Slider accessibility actions (screen reader VoiceOver/TalkBack)', () => {
  it('increments and decrements value on accessibilityAction', async () => {
    const onValueChange = jest.fn();
    const onSlidingComplete = jest.fn();

    await render(
      <Slider
        defaultValue={50}
        min={0}
        max={100}
        step={10}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
      />
    );

    const slider = screen.getByRole('slider');

    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onValueChange).toHaveBeenCalledWith(60);
    expect(onSlidingComplete).toHaveBeenCalledWith(60);

    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(onValueChange).toHaveBeenCalledWith(50);
  });
});

describe('RangeSlider interaction (keyboard navigation & accessibility actions)', () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = 'web';
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('navigates start and end thumbs with ArrowRight / ArrowLeft respecting minSeparation', async () => {
    const onValueChange = jest.fn();
    const onSlidingComplete = jest.fn();

    await render(
      <RangeSlider
        defaultValues={[30, 70]}
        min={0}
        max={100}
        step={5}
        minSeparation={10}
        startAccessibilityLabel="Min"
        endAccessibilityLabel="Max"
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
      />
    );

    const startThumb = screen.getByLabelText('Min');
    const endThumb = screen.getByLabelText('Max');

    // Move start thumb right
    await fireEvent(startThumb, 'keyDown', {
      key: 'ArrowRight',
      preventDefault: jest.fn(),
    });
    expect(onValueChange).toHaveBeenCalledWith([35, 70]);
    expect(onSlidingComplete).toHaveBeenCalledWith([35, 70]);

    // Move end thumb left
    await fireEvent(endThumb, 'keyDown', {
      key: 'ArrowLeft',
      preventDefault: jest.fn(),
    });
    expect(onValueChange).toHaveBeenCalledWith([35, 65]);

    // Move start thumb to End (should clamp to endThumb - minSeparation = 65 - 10 = 55)
    await fireEvent(startThumb, 'keyDown', {
      key: 'End',
      preventDefault: jest.fn(),
    });
    expect(onValueChange).toHaveBeenCalledWith([55, 65]);
  });

  it('adjusts start and end thumbs via accessibilityAction', async () => {
    const onValueChange = jest.fn();

    await render(
      <RangeSlider
        defaultValues={[20, 80]}
        min={0}
        max={100}
        step={10}
        minSeparation={10}
        startAccessibilityLabel="Min"
        endAccessibilityLabel="Max"
        onValueChange={onValueChange}
      />
    );

    const startThumb = screen.getByLabelText('Min');
    const endThumb = screen.getByLabelText('Max');

    await fireEvent(startThumb, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onValueChange).toHaveBeenCalledWith([30, 80]);

    await fireEvent(endThumb, 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(onValueChange).toHaveBeenCalledWith([30, 70]);
  });
});
