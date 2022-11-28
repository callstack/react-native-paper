import * as React from 'react';
import { Keyboard, NativeEventSubscription, Platform } from 'react-native';

type Props = {
  onShow: () => void;
  onHide: () => void;
};
export default function useIsKeyboardShown({ onShow, onHide }: Props) {
  React.useEffect(() => {
    let willShowSubscription: NativeEventSubscription | undefined;
    let willHideSubscription: NativeEventSubscription | undefined;
    let didShowSubscription: NativeEventSubscription | undefined;
    let didHideSubscription: NativeEventSubscription | undefined;

    if (Platform.OS === 'ios') {
      willShowSubscription = Keyboard.addListener('keyboardWillShow', onShow);
      willHideSubscription = Keyboard.addListener('keyboardWillHide', onHide);
    } else {
      didShowSubscription = Keyboard.addListener('keyboardDidShow', onShow);
      didHideSubscription = Keyboard.addListener('keyboardDidHide', onHide);
    }

    return () => {
      if (Platform.OS === 'ios') {
        if (willShowSubscription?.remove) {
          willShowSubscription.remove();
        } else {
          // @ts-expect-error: We keep deprecated listener remove method for backwards compat with old RN versions
          Keyboard.removeListener('keyboardWillShow', onShow);
        }

        if (willHideSubscription?.remove) {
          willHideSubscription.remove();
        } else {
          // @ts-expect-error: We keep deprecated listener remove method for backwards compat with old RN versions
          Keyboard.removeListener('keyboardWillHide', onHide);
        }
      } else {
        if (didShowSubscription?.remove) {
          didShowSubscription.remove();
        } else {
          // @ts-expect-error: We keep deprecated listener remove method for backwards compat with old RN versions
          Keyboard.removeListener('keyboardDidShow', onShow);
        }

        if (didHideSubscription?.remove) {
          didHideSubscription.remove();
        } else {
          // @ts-expect-error: We keep deprecated listener remove method for backwards compat with old RN versions
          Keyboard.removeListener('keyboardDidHide', onHide);
        }
      }
    };
  }, [onHide, onShow]);
}
