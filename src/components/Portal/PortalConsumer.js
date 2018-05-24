/* @flow */
/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';
import type { PortalMethods } from './PortalHost';

type Props = {
  manager: PortalMethods,
  children: React.Node,
};

export default class PortalConsumer extends React.Component<Props> {
  componentDidMount() {
    this._key = this.props.manager.mount(this.props.children);
  }

  componentDidUpdate() {
    this.props.manager.update(this._key, this.props.children);
  }

  componentWillUnmount() {
    this.props.manager.unmount(this._key);
  }

  _key: any;

  render() {
    return null;
  }
}
