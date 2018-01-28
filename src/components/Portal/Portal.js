/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { manager } from './PortalHost';

export type PortalProps = {
  /**
   * Position of the element in the z-axis
   */
  position?: number,
  children: React.Node,
};

type Props = PortalProps;

/**
 * Portal allows to render a component at a different place in the parent tree.
 */
export default class Portal extends React.Component<Props> {
  static contextTypes = {
    [manager]: PropTypes.object,
  };

  componentDidMount() {
    if (
      typeof this.context[manager] !== 'object' ||
      this.context[manager] === null
    ) {
      throw new Error(
        "Couldn't find portal manager in the context or props. " +
          "You need to wrap your root component in '<PortalHost />'"
      );
    }
    this._key = this.context[manager].mount(this.props);
  }

  componentDidUpdate() {
    this.context[manager].update(this._key, this.props);
  }

  componentWillUnmount() {
    this.context[manager].unmount(this._key);
  }

  _key: any;

  render() {
    return null;
  }
}
