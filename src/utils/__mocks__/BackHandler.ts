const _backPressSubscriptions = new Set<() => boolean>();

const BackHandler = {
  exitApp: jest.fn(),

  addEventListener: function (
    eventName: 'hardwareBackPress',
    handler: () => boolean
  ): { remove: () => void } {
    if (eventName === 'hardwareBackPress') {
      _backPressSubscriptions.add(handler);
    }
    return {
      remove: () => {
        _backPressSubscriptions.delete(handler);
      },
    };
  },

  removeEventListener: jest.fn(),

  mockPressBack: function () {
    const subscriptions = Array.from(_backPressSubscriptions).reverse();
    for (const handler of subscriptions) {
      const result = handler();
      if (result === true) {
        return true;
      }
    }
    return false;
  },
};

export default BackHandler;
