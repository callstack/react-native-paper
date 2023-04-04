import { renderHook } from '@testing-library/react-native';

import useIsTouchableEvent from '../useIsTouchableEvent';

describe('useIsTouchableEvent', () => {
  it.each([
    [{ onPress: jest.fn() }],
    [{ onLongPress: jest.fn() }],
    [{ onPressIn: jest.fn() }],
    [{ onPressOut: jest.fn() }],
  ])(
    'should return true if touchableEventObject contains touchable event %p',
    (touchableEventObject) => {
      const { result } = renderHook(() =>
        useIsTouchableEvent(touchableEventObject)
      );

      expect(result.current).toBe(true);
    }
  );

  it('should return false if touchableEventObject does not contain any touchable events', () => {
    const { result } = renderHook(() => useIsTouchableEvent({}));

    expect(result.current).toBe(false);
  });
});
