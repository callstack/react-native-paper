import type {
  NativeEventSubscription,
  EmitterSubscription,
} from 'react-native';

type EventModule = {
  addEventListener: (
    ...args: any
  ) => NativeEventSubscription | EmitterSubscription | undefined;
} & { removeEventListener?: (...args: any) => void } & {
  remove?: (...args: any) => void;
};

// A missing module is a separate overload so a real module keeps its
// addEventListener overloads. Folding null into T widens every handler (#4373).
export function addEventListener(
  Module: null | undefined,
  eventName: string,
  handler: (...args: any[]) => void
): { remove: () => void };
export function addEventListener<T extends EventModule>(
  Module: T,
  ...rest: Parameters<typeof Module.addEventListener>
): NativeEventSubscription | EmitterSubscription | { remove: () => void };
export function addEventListener(
  Module: EventModule | null | undefined,
  ...rest: any[]
) {
  const [eventName, handler] = rest;

  let removed = false;

  // Jest presets often leave AccessibilityInfo (and similar RN modules)
  // undefined. PaperProvider subscribes on mount, so that must not throw (#4373).
  if (Module == null || typeof Module.addEventListener !== 'function') {
    return { remove() {} };
  }

  const subscription = Module.addEventListener(eventName, handler) ?? {
    remove: () => {
      if (removed) {
        return;
      }

      Module.removeEventListener?.(eventName, handler);
      Module.remove?.(eventName, handler);
      removed = true;
    },
  };

  return subscription;
}

export function addListener<
  T extends {
    addListener: (...args: any) => EmitterSubscription | undefined;
    removeEventListener: (...args: any) => void;
  },
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
