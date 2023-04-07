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

  it('should return false if touchableEventObject does not contain any touchable events', () => {
    const result = hasTouchHandler({});

    expect(result).toBe(false);
  });
});
