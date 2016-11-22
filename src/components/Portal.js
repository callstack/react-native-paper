/* @flow */

import {
  PureComponent,
  PropTypes,
} from 'react';

type Props = {
  children?: any;
}

class Portal extends PureComponent<void, Props, void> {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  componentDidMount() {
    const { children } = this.props;

    this._key = this.context.portalManager.mount(children);
  }
  componentWillUnmount() {
    this.context.portalManager.unmount(this._key);
  }
  render() {
    return null;
  }
}

Portal.contextTypes = {
  portalManager: PropTypes.object,
};

export default Portal;
