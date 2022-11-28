import * as React from 'react';

import type { PortalMethods } from './PortalHost';

type Props = {
  manager: PortalMethods;
  children: React.ReactNode;
};

export default class PortalConsumer extends React.Component<Props> {
  componentDidMount() {
    this.checkManager();

    this.key = this.props.manager.mount(this.props.children);
  }

  componentDidUpdate() {
    this.checkManager();

    this.props.manager.update(this.key, this.props.children);
  }

  componentWillUnmount() {
    this.checkManager();

    this.props.manager.unmount(this.key);
  }

  private key: any;

  private checkManager() {
    if (!this.props.manager) {
      throw new Error(
        'Looks like you forgot to wrap your root component with `Provider` component from `react-native-paper`.\n\n' +
          "Please read our getting-started guide and make sure you've followed all the required steps.\n\n" +
          'https://callstack.github.io/react-native-paper/getting-started.html'
      );
    }
  }

  render() {
    return null;
  }
}
