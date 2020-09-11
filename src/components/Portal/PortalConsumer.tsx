import * as React from 'react';
import type { PortalMethods } from './PortalHost';

type Props = {
  manager: PortalMethods | null;
  children: React.ReactNode;
};

const PortalConsumer = ({ manager, children }: Props) => {
  const [key, setKey] = React.useState<number | undefined>();

  const checkManager = () => {
    if (!manager) {
      throw new Error(
        'Looks like you forgot to wrap your root component with `Provider` component from `react-native-paper`.\n\n' +
          "Please read our getting-started guide and make sure you've followed all the required steps.\n\n" +
          'https://callstack.github.io/react-native-paper/getting-started.html'
      );
    }
  };
  const onInit = async () => {
    checkManager();

    // Delay updating to prevent React from going to infinite loop
    await Promise.resolve();

    setKey(manager?.mount(children));
  };

  React.useEffect(() => {
    onInit();

    return () => {
      if (key !== undefined) {
        checkManager();
        manager?.unmount(key);
      }
    };
  }, []);

  React.useEffect(() => {
    if (key !== undefined) {
      checkManager();

      manager?.update(key, children);
    }
  }, [key, children]);

  return null;
};

export default PortalConsumer;
