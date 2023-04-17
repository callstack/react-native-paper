import hasTouchHandler from '../hasTouchHandler';

describe('hasTouchHandler', () => {
  it.each([
    [{ onPress: jest.fn() }],
    [{ onLongPress: jest.fn() }],
    [{ onPressIn: jest.fn() }],
    [{ onPressOut: jest.fn() }],
  ])(
    'should return true if touchableEventObject contains touchable event %p',
    (touchableEventObject) => {
      const result = hasTouchHandler(touchableEventObject);

      expect(result).toBe(true);
    }
  );

  it('should return true if two touchable events are passed, but one is undefined', () => {
    const result = hasTouchHandler({
      onPress: jest.fn(),
      onLongPress: undefined,
    });

    expect(result).toBe(true);
  });

  it('should return false if touchable events are undefined', () => {
    const result = hasTouchHandler({
      onPress: undefined,
      onLongPress: undefined,
      onPressIn: undefined,
      onPressOut: undefined,
    });

    expect(result).toBe(false);
  });
});
