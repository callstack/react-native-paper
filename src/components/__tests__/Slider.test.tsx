import * as React from 'react';

import { render } from '../../test-utils';
import Slider from '../Slider';
import {
  activeSegment,
  fractionToValue,
  nearestHandle,
  positionToFraction,
  snapToStep,
  stopFractions,
  valueToFraction,
} from '../Slider/utils';

// ---- Utility unit tests ----

describe('snapToStep', () => {
  it('returns value clamped to [min, max] when step is 0', () => {
    expect(snapToStep(150, 0, 100, 0)).toBe(100);
    expect(snapToStep(-10, 0, 100, 0)).toBe(0);
    expect(snapToStep(42, 0, 100, 0)).toBe(42);
  });

  it('snaps to nearest step', () => {
    expect(snapToStep(23, 0, 100, 25)).toBe(25);
    expect(snapToStep(12, 0, 100, 25)).toBe(0);
    expect(snapToStep(38, 0, 100, 25)).toBe(50);
    expect(snapToStep(63, 0, 100, 25)).toBe(75);
  });

  it('clamps snapped value to bounds', () => {
    expect(snapToStep(99, 0, 100, 25)).toBe(100);
    expect(snapToStep(1, 0, 100, 25)).toBe(0);
  });
});

describe('valueToFraction', () => {
  it('maps min to 0 and max to 1', () => {
    expect(valueToFraction(0, 0, 100)).toBe(0);
    expect(valueToFraction(100, 0, 100)).toBe(1);
  });

  it('maps midpoint to 0.5', () => {
    expect(valueToFraction(50, 0, 100)).toBe(0.5);
  });

  it('returns 0 when min === max', () => {
    expect(valueToFraction(50, 50, 50)).toBe(0);
  });
});

describe('fractionToValue', () => {
  it('maps 0 to min and 1 to max', () => {
    expect(fractionToValue(0, 0, 100, 0)).toBe(0);
    expect(fractionToValue(1, 0, 100, 0)).toBe(100);
  });

  it('clamps out-of-range fractions', () => {
    expect(fractionToValue(-0.5, 0, 100, 0)).toBe(0);
    expect(fractionToValue(1.5, 0, 100, 0)).toBe(100);
  });
});

describe('positionToFraction', () => {
  it('maps 0 to 0 and trackLength to 1 in LTR horizontal', () => {
    expect(positionToFraction(0, 100, false, false)).toBe(0);
    expect(positionToFraction(100, 100, false, false)).toBe(1);
    expect(positionToFraction(50, 100, false, false)).toBe(0.5);
  });

  it('inverts for RTL', () => {
    expect(positionToFraction(0, 100, true, false)).toBe(1);
    expect(positionToFraction(100, 100, true, false)).toBe(0);
  });

  it('inverts for vertical (top=high, bottom=low)', () => {
    expect(positionToFraction(0, 100, false, true)).toBe(1);
    expect(positionToFraction(100, 100, false, true)).toBe(0);
    expect(positionToFraction(25, 100, false, true)).toBe(0.75);
  });

  it('returns 0 when trackLengthPx is 0', () => {
    expect(positionToFraction(50, 0, false, false)).toBe(0);
  });
});

describe('stopFractions', () => {
  it('returns empty array when step is 0', () => {
    expect(stopFractions(0, 100, 0)).toEqual([]);
  });

  it('returns correct fractions for step=25 on [0,100]', () => {
    const fracs = stopFractions(0, 100, 25);
    expect(fracs).toHaveLength(5);
    expect(fracs[0]).toBeCloseTo(0);
    expect(fracs[1]).toBeCloseTo(0.25);
    expect(fracs[2]).toBeCloseTo(0.5);
    expect(fracs[3]).toBeCloseTo(0.75);
    expect(fracs[4]).toBeCloseTo(1);
  });

  it('returns empty array when max <= min', () => {
    expect(stopFractions(100, 100, 25)).toEqual([]);
  });
});

describe('activeSegment', () => {
  it('standard: returns [0, valueFraction]', () => {
    expect(activeSegment('standard', 0.6, 0)).toEqual([0, 0.6]);
    expect(activeSegment('standard', 0, 0)).toEqual([0, 0]);
  });

  it('centered: returns segment between 0.5 and valueFraction', () => {
    expect(activeSegment('centered', 0.7, 0)).toEqual([0.5, 0.7]);
    expect(activeSegment('centered', 0.3, 0)).toEqual([0.3, 0.5]);
    expect(activeSegment('centered', 0.5, 0)).toEqual([0.5, 0.5]);
  });

  it('range: returns ordered [start, end]', () => {
    expect(activeSegment('range', 0.8, 0.2)).toEqual([0.2, 0.8]);
    expect(activeSegment('range', 0.2, 0.8)).toEqual([0.2, 0.8]);
  });
});

describe('nearestHandle', () => {
  it('returns start when closer to start', () => {
    expect(nearestHandle(0.2, 0.1, 0.9)).toBe('start');
  });

  it('returns end when closer to end', () => {
    expect(nearestHandle(0.8, 0.1, 0.9)).toBe('end');
  });

  it('tie-breaks to end', () => {
    expect(nearestHandle(0.5, 0.25, 0.75)).toBe('end');
  });
});

// ---- Component render tests ----

describe('Slider renders', () => {
  it('standard slider', () => {
    const tree = render(<Slider value={50} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('each size', () => {
    for (const size of ['xs', 's', 'm', 'l', 'xl'] as const) {
      const tree = render(<Slider value={50} size={size} />).toJSON();
      expect(tree).toMatchSnapshot();
    }
  });

  it('centered variant', () => {
    const tree = render(<Slider variant="centered" value={75} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('range variant', () => {
    const tree = render(<Slider variant="range" value={[20, 80]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('disabled standard', () => {
    const tree = render(<Slider value={50} disabled />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('with stop indicators', () => {
    const tree = render(<Slider value={50} step={25} showStops />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('with value indicator', () => {
    const tree = render(<Slider value={50} showValueIndicator />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('vertical orientation', () => {
    const tree = render(<Slider value={50} orientation="vertical" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Slider.Centered shorthand', () => {
    const tree = render(<Slider.Centered value={30} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Slider.Range shorthand', () => {
    const tree = render(<Slider.Range value={[10, 90]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Slider accessibility', () => {
  it('has adjustable role with correct value', () => {
    const { getByRole } = render(<Slider value={42} min={0} max={100} />);
    const slider = getByRole('adjustable');
    expect(slider.props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 42,
    });
  });
});
