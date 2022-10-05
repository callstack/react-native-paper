import { BackHandler, Keyboard } from 'react-native';

import { addEventListener, addListener } from '../addEventListener';

const mockModule = jest.fn();
const handler = jest.fn();

describe('addEventListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assigns subscription', () => {
    BackHandler.addEventListener = mockModule;
    addEventListener(BackHandler, 'hardwareBackPress', handler);
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      handler
    );
  });

  it('removes subscription', () => {
    const subscription = addEventListener(
      BackHandler,
      'hardwareBackPress',
      handler
    );
    BackHandler.removeEventListener = mockModule;
    subscription.remove();

    expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      handler
    );
  });
});

describe('addListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assigns subscription', () => {
    Keyboard.addListener = mockModule;
    addListener(Keyboard, 'keyboardWillShow', handler);
    expect(Keyboard.addListener).toHaveBeenCalledWith(
      'keyboardWillShow',
      handler
    );
  });

  it('removes subscription', () => {
    const subscription = addListener(Keyboard, 'keyboardWillShow', handler);
    Keyboard.removeEventListener = mockModule;
    subscription.remove();

    expect(Keyboard.removeEventListener).toHaveBeenCalledWith(
      'keyboardWillShow',
      handler
    );
  });
});
