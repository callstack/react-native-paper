/* @flow */

import {
  PureComponent,
  PropTypes,
} from 'react';
import { manager } from '../core/PortalHost';

type Props = {
  children?: any;
}

export default class Portal extends PureComponent<void, Props, void> {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static contextTypes = {
    [manager]: PropTypes.object,
  };

  componentDidMount() {
    if (typeof this.context[manager] !== 'object' || this.context[manager] === null) {
      throw new Error(
        'Couldn\'t find portal manager in the context or props. ' +
        'You need to wrap your root component in \'<PortalHost />\''
      );
    }
    this._key = this.context[manager].mount(this.props.children);
  }

  componentDidUpdate() {
    this.context[manager].update(this._key, this.props.children);
  }

  componentWillUnmount() {
    this.context[manager].unmount(this._key);
  }

  _key: ?string;

  render() {
    return null;
  }
}
