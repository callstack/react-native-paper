import { describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render, screen } from '../../test-utils';
import Slider from '../Slider';
import {
  activeSegment,
  fractionToValue,
  nearestHandle,
  positionToFraction,
  rangeHandleForTouch,
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

  // Deliberately not inverted: the rendering is not mirrored for RTL, so
  // inverting here made dragging right move the handle right and lower the
  // value. Flip this back alongside mirrored rendering.
  it('does not invert for RTL while the rendering is unmirrored', () => {
    expect(positionToFraction(0, 100, true, false)).toBe(0);
    expect(positionToFraction(100, 100, true, false)).toBe(1);
  });

  it('inverts for vertical (top=high, bottom=low)', () => {
    expect(positionToFraction(0, 100, false, true)).toBe(1);
    expect(positionToFraction(100, 100, false, true)).toBe(0);
    expect(positionToFraction(25, 100, false, true)).toBe(0.75);
  });

  it('returns 0 when trackLengthPx is 0', () => {
    expect(positionToFraction(50, 0, false, false)).toBe(0);
  });

  // Handles are drawn across an inset range, so touches must map onto the same
  // range or the handle trails behind the finger.
  it('maps onto the inset range, clamping outside it', () => {
    // 300px track inset 12 either end: the usable span is 276, from 12 to 288.
    expect(positionToFraction(12, 300, false, false, 12, 12)).toBe(0);
    expect(positionToFraction(150, 300, false, false, 12, 12)).toBe(0.5);
    expect(positionToFraction(288, 300, false, false, 12, 12)).toBe(1);
    expect(positionToFraction(0, 300, false, false, 12, 12)).toBe(0);
    expect(positionToFraction(300, 300, false, false, 12, 12)).toBe(1);
  });

  it('keeps the two insets independent when vertical', () => {
    // Vertical runs bottom-to-top, so fraction 0 sits `insetStart` up from the
    // bottom (y = 280) and fraction 1 sits `insetEnd` down from the top (y = 10).
    expect(positionToFraction(280, 300, false, true, 20, 10)).toBe(0);
    expect(positionToFraction(10, 300, false, true, 20, 10)).toBe(1);
  });

  it('returns 0 when the insets swallow the whole track', () => {
    expect(positionToFraction(10, 20, false, false, 12, 12)).toBe(0);
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

describe('rangeHandleForTouch', () => {
  it('picks the nearest handle while they are apart', () => {
    expect(rangeHandleForTouch(0.2, 0.1, 0.9)).toBe('start');
    expect(rangeHandleForTouch(0.8, 0.1, 0.9)).toBe('end');
  });

  // Overlapping handles make every touch equidistant, so nearest-handle would
  // always answer 'end', and at max that handle is the one that cannot move.
  it('defers to the drag direction when the handles overlap', () => {
    expect(rangeHandleForTouch(0.5, 1, 1)).toBe('pending');
    expect(rangeHandleForTouch(0, 0, 0)).toBe('pending');
    expect(rangeHandleForTouch(0.5, 0.5, 0.5)).toBe('pending');
  });
});

// ---- Component render tests ----

describe('Slider renders', () => {
  it('standard slider', async () => {
    const tree = (await render(<Slider value={50} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('each size', async () => {
    for (const size of ['xs', 's', 'm', 'l', 'xl'] as const) {
      const tree = (await render(<Slider value={50} size={size} />)).toJSON();
      expect(tree).toMatchSnapshot();
    }
  });

  it('centered variant', async () => {
    const tree = (
      await render(<Slider variant="centered" value={75} />)
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('range variant', async () => {
    const tree = (
      await render(<Slider variant="range" value={[20, 80]} />)
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('disabled standard', async () => {
    const tree = (await render(<Slider value={50} disabled />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('with stop indicators', async () => {
    const tree = (
      await render(<Slider value={50} step={25} showStops />)
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('with value indicator', async () => {
    const tree = (
      await render(<Slider value={50} showValueIndicator />)
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('vertical orientation', async () => {
    const tree = (
      await render(<Slider value={50} orientation="vertical" />)
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Slider.Centered shorthand', async () => {
    const tree = (await render(<Slider.Centered value={30} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Slider.Range shorthand', async () => {
    const tree = (await render(<Slider.Range value={[10, 90]} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Slider accessibility', () => {
  it('has adjustable role with correct value', async () => {
    await render(<Slider value={42} min={0} max={100} />);

    expect(screen.getByRole('adjustable')).toHaveAccessibilityValue({
      min: 0,
      max: 100,
      now: 42,
    });
  });
});

// Synthetic touches, shaped the way PanResponder's internals expect: it reads
// the centroid out of `touchHistory.touchBank`, and derives dx from the gap
// between a touch's previous and current position, for touches whose timestamp
// is newer than the last move it accounted for.
const touchEvent = (fromX: number, toX: number) => {
  const moved = toX !== fromX;
  return {
    nativeEvent: {
      locationX: fromX,
      locationY: 0,
      identifier: 0,
      pageX: fromX,
      pageY: 0,
      timestamp: 0,
      target: 1,
      touches: [],
      changedTouches: [],
    },
    touchHistory: {
      touchBank: [
        {
          touchActive: true,
          startPageX: fromX,
          startPageY: 0,
          startTimeStamp: 0,
          currentPageX: toX,
          currentPageY: 0,
          currentTimeStamp: moved ? 1 : 0,
          previousPageX: fromX,
          previousPageY: 0,
          previousTimeStamp: 0,
        },
      ],
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: moved ? 1 : 0,
    },
  };
};

const grantEvent = (x: number) => touchEvent(x, x);

const TRACK_WIDTH = 300;

// Nothing lays out in the test renderer, so the track measures 0 and every
// touch maps to fraction 0. Fire the layout the component is waiting for.
// Needs the slider rendered with `testID="slider"`.
const layoutTrack = async () => {
  await fireEvent(screen.getByTestId('slider-track'), 'layout', {
    nativeEvent: { layout: { width: TRACK_WIDTH, height: 44 } },
  });
};

// Each `fireEvent` has to be awaited: it settles its own `act()`, and the grant
// has to finish before the move arrives or the drag direction is never seen.
//
// `fireEvent` also refuses to deliver to a view whose `onStartShouldSetResponder`
// returns false, so a disabled slider drops these on the floor by itself.
const drag = async (fromX: number, toX: number) => {
  const slider = screen.getByRole('adjustable');
  await fireEvent(slider, 'responderGrant', grantEvent(fromX));
  await fireEvent(slider, 'responderMove', touchEvent(fromX, toX));
};

// The PanResponder is built once and never rebuilt, so `disabled` has to be
// read through a ref. These assert it is, in both directions, by checking
// whether a drag still reaches the value.
describe('Slider disabled', () => {
  it('stops accepting gestures when disabled is toggled on after mount', async () => {
    const onValueChange = jest.fn();
    const view = await render(
      <Slider value={50} testID="slider" onValueChange={onValueChange} />
    );
    await layoutTrack();

    await drag(150, 79);
    expect(onValueChange).toHaveBeenCalledWith(25);

    onValueChange.mockClear();
    await view.rerender(
      <Slider
        value={50}
        disabled
        testID="slider"
        onValueChange={onValueChange}
      />
    );

    await drag(150, 79);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('accepts gestures again when disabled is toggled back off', async () => {
    const onValueChange = jest.fn();
    const view = await render(
      <Slider
        value={50}
        disabled
        testID="slider"
        onValueChange={onValueChange}
      />
    );
    await layoutTrack();

    await drag(150, 79);
    expect(onValueChange).not.toHaveBeenCalled();

    await view.rerender(
      <Slider value={50} testID="slider" onValueChange={onValueChange} />
    );

    await drag(150, 79);
    expect(onValueChange).toHaveBeenCalledWith(25);
  });
});

describe('Slider range gestures', () => {
  const setup = async (value: [number, number]) => {
    const onValueChange = jest.fn();
    await render(
      <Slider.Range
        value={value}
        min={0}
        max={100}
        testID="slider"
        onValueChange={onValueChange}
      />
    );
    await layoutTrack();
    return { onValueChange };
  };

  // Handles travel an inset range, so on a 300px track at size `s` (8dp insets)
  // the usable span is 284: fraction 0.25 is at pixel 79, 0.5 at 150, 0.75 at 221.
  it('frees the start handle when both are pinned at max', async () => {
    const { onValueChange } = await setup([100, 100]);
    await drag(150, 79);
    expect(onValueChange).toHaveBeenCalledWith([25, 100]);
  });

  it('frees the end handle when both are pinned at min', async () => {
    const { onValueChange } = await setup([0, 0]);
    await drag(150, 221);
    expect(onValueChange).toHaveBeenCalledWith([0, 75]);
  });

  it('still drags the nearest handle when they are apart', async () => {
    const { onValueChange } = await setup([20, 80]);
    await drag(221, 150);
    expect(onValueChange).toHaveBeenCalledWith([20, 50]);
  });
});

describe('Slider gesture callbacks', () => {
  it('calls the callback from the latest render, not the first', async () => {
    const first = jest.fn();
    const second = jest.fn();

    const view = await render(<Slider value={50} onSlidingStart={first} />);
    await fireEvent(
      screen.getByRole('adjustable'),
      'responderGrant',
      grantEvent(10)
    );
    expect(first).toHaveBeenCalledTimes(1);

    await view.rerender(<Slider value={50} onSlidingStart={second} />);
    await fireEvent(
      screen.getByRole('adjustable'),
      'responderGrant',
      grantEvent(10)
    );

    expect(second).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledTimes(1);
  });
});
