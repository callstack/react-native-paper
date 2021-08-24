import * as React from 'react';
import type { PortalMethods } from './PortalHost';

type Props = {
  manager: PortalMethods | null;
  children: React.ReactNode;
};

const PortalConsumer = ({ manager, children }: Props) => {
  let key = React.useRef<number>();

  const checkManager = React.useCallback(() => {
    if (!manager) {
      throw new Error(
        'Looks like you forgot to wrap your root component with `Provider` component from `react-native-paper`.\n\n' +
          "Please read our getting-started guide and make sure you've followed all the required steps.\n\n" +
          'https://callstack.github.io/react-native-paper/getting-started.html'
      );
    }
  }, [manager]);

  const onInit = React.useCallback(async () => {
    checkManager();

    // Delay updating to prevent React from going to infinite loop
    await Promise.resolve();

    key.current = manager?.mount(children);
  }, [manager, checkManager, children]);

  React.useEffect(() => {
    if (key.current === undefined) onInit();
    else {
      checkManager();

      manager?.update(key.current, children);
    }
  }, [checkManager, manager, onInit, children]);

  React.useEffect(() => {
    return () => {
      if (key.current !== undefined) {
        checkManager();
        manager?.unmount(key.current);
      }
    };
  }, [checkManager, manager]);
  return null;
};

export default PortalConsumer;
