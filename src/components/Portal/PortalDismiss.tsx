import * as React from 'react';
import { Platform } from 'react-native';

import useLatestCallback from 'use-latest-callback';

import type { PortalOptions } from './PortalManager';
import { addEventListener } from '../../utils/addEventListener';
import { BackHandler } from '../../utils/BackHandler/BackHandler';

export type Props = Pick<PortalOptions, 'onDismiss' | 'dismissable'> & {
  enabled: boolean;
};

export default function PortalDismiss({
  enabled,
  dismissable,
  onDismiss,
}: Props) {
  const handleBackPress = useLatestCallback(() => {
    if (!enabled) {
      return false;
    }

    if (dismissable) {
      onDismiss?.();
    }

    return true;
  });

  const handleKeyDown = useLatestCallback((event: KeyboardEvent) => {
    if (
      !enabled ||
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      event.isComposing
    ) {
      return;
    }

    event.preventDefault();

    if (dismissable) {
      onDismiss?.();
    }
  });

  React.useEffect(() => {
    const backSubscription = addEventListener(
      BackHandler,
      'hardwareBackPress',
      handleBackPress
    );

    const listensForKeys = Platform.OS === 'web' && 'document' in global;

    if (listensForKeys) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      backSubscription.remove();

      if (listensForKeys) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleBackPress, handleKeyDown]);

  return null;
}
