import * as React from 'react';
import { Keyboard, Platform } from 'react-native';
import type { NativeEventSubscription } from 'react-native';

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
      willShowSubscription?.remove();
      willHideSubscription?.remove();
      didShowSubscription?.remove();
      didHideSubscription?.remove();
    };
  }, [onHide, onShow]);
}
