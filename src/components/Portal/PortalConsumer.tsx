import * as React from 'react';
import type { PortalMethods } from './PortalHost';

type Props = {
  manager: PortalMethods | null;
  children: React.ReactNode;
};

const PortalConsumer = ({ manager, children }: Props) => {
  const [key, setKey] = React.useState<number | undefined>(undefined);

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

    setKey(manager?.mount(children));
  }, [manager, checkManager, children]);

  React.useEffect(() => {
    if (key === undefined) onInit();
    else {
      checkManager();

      manager?.update(key, children);
    }
  }, [checkManager, key, manager, onInit, children]);

  React.useEffect(() => {
    return () => {
      if (key !== undefined) {
        checkManager();
        manager?.unmount(key);
      }
    };
  }, [key, checkManager, manager]);
  return null;
};

export default PortalConsumer;
