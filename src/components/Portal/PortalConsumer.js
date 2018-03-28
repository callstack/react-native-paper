/* @flow */
/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';
import type { PortalMethods } from './PortalHost';
import type { PortalProps } from './Portal';

type Props = {
  manager: PortalMethods,
  props: PortalProps,
};

export default class PortalConsumer extends React.Component<Props> {
  componentWillMount() {
    this._key = this.props.manager.mount(this.props.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.props.manager.update(this._key, nextProps.props);
  }

  componentWillUnmount() {
    this.props.manager.unmount(this._key);
  }

  _key: any;

  render() {
    return null;
  }
}
