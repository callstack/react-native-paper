function emptyFunction() {}

export const BackHandler = {
  exitApp: emptyFunction,
  addEventListener(): { remove: () => void } {
    return {
      remove: emptyFunction,
    };
  },
  removeEventListener: emptyFunction,
};
