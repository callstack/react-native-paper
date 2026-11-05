import * as React from 'react';

import useLatestCallback from 'use-latest-callback';

import { addEventListener } from './addEventListener';
import { BackHandler } from './BackHandler/BackHandler';

/**
 * Handles the hardware back button (Android) while `enabled`. The handler
 * returns `true` when the press was handled, which stops the default behavior.
 */
export const useHardwareBackPress = (
  enabled: boolean,
  handler: () => boolean
) => {
  const handlerCallback = useLatestCallback(handler);

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const subscription = addEventListener(
      BackHandler,
      'hardwareBackPress',
      handlerCallback
    );

    return () => subscription.remove();
  }, [enabled, handlerCallback]);
};
