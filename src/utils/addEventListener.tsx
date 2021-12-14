import type {
  NativeEventSubscription,
  EmitterSubscription,
} from 'react-native';

export function addEventListener<
  T extends {
    addEventListener: (
      ...args: any
    ) => NativeEventSubscription | EmitterSubscription;
    removeEventListener: (...args: any) => void;
  }
>(Module: T, ...rest: Parameters<typeof Module.addEventListener>) {
  const [eventName, handler] = rest;

  let removed = false;

  const subscription = Module.addEventListener(eventName, handler) ?? {
    remove: () => {
      if (removed) {
        return;
      }

      Module.removeEventListener(eventName, handler);
      removed = true;
    },
  };

  return subscription;
}

export function addListener<
  T extends {
    addListener: (...args: any) => EmitterSubscription;
    removeEventListener: (...args: any) => void;
  }
>(Module: T, ...rest: Parameters<typeof Module.addListener>) {
  const [eventName, handler] = rest;

  let removed = false;

  const subscription = Module.addListener(eventName, handler) ?? {
    remove: () => {
      if (removed) {
        return;
      }

      Module.removeEventListener(eventName, handler);
      removed = true;
    },
  };

  return subscription;
}
