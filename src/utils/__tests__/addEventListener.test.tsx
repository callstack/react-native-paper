import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { addEventListener, addListener } from '../addEventListener';

type LegacyEventModule = {
  addEventListener: (eventName: string, handler: () => void) => undefined;
  removeEventListener: (eventName: string, handler: () => void) => void;
};

type LegacyListenerModule = {
  addListener: (eventName: string, handler: () => void) => undefined;
  removeEventListener: (eventName: string, handler: () => void) => void;
};

const handler = jest.fn();

describe('addEventListener', () => {
  const module: LegacyEventModule = {
    addEventListener: jest.fn<LegacyEventModule['addEventListener']>(),
    removeEventListener: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assigns subscription', () => {
    addEventListener(module, 'hardwareBackPress', handler);

    expect(module.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      handler
    );
  });

  it('removes subscription', () => {
    const subscription = addEventListener(module, 'hardwareBackPress', handler);

    subscription.remove();

    expect(module.removeEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      handler
    );
  });
});

describe('addListener', () => {
  const module: LegacyListenerModule = {
    addListener: jest.fn<LegacyListenerModule['addListener']>(),
    removeEventListener: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assigns subscription', () => {
    addListener(module, 'keyboardWillShow', handler);

    expect(module.addListener).toHaveBeenCalledWith(
      'keyboardWillShow',
      handler
    );
  });

  it('removes subscription', () => {
    const subscription = addListener(module, 'keyboardWillShow', handler);

    subscription.remove();

    expect(module.removeEventListener).toHaveBeenCalledWith(
      'keyboardWillShow',
      handler
    );
  });
});
