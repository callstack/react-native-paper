/* @flow */
/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';
import PortalConsumer from './PortalConsumer';
import { PortalContext } from './PortalHost';

type Props = {
  /**
   * Content of the `Portal`.
   */
  children: React.Element<*>,
};

/**
 * Portal allows to render a component at a different place in the parent tree.
 */
export default function Portal({ children }: Props) {
  return (
    <PortalContext.Consumer>
      {manager => <PortalConsumer manager={manager}>{children}</PortalConsumer>}
    </PortalContext.Consumer>
  );
}
