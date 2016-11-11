/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
} from 'react-native';
import { default as RNDrawer } from 'react-native-drawer';
import Icon from './Icon';

type Props = {
  children?: any;
}

export default class Drawer extends Component<void, Props, void> {

  static propTypes = {
    acceptDoubleTap: PropTypes.bool,
    acceptPan: PropTypes.bool,
    acceptTap: PropTypes.bool,
    captureGestures: PropTypes.oneOf([ true, false, 'open', 'closed' ]),
    children: PropTypes.node,
    closedDrawerOffset: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]),
    content: PropTypes.node,
    disabled: PropTypes.bool,
    elevation: PropTypes.number,
    initializeOpen: PropTypes.bool,
    open: PropTypes.bool,
    negotiatePan: PropTypes.bool,
    onClose: PropTypes.func,
    onCloseStart: PropTypes.func,
    onOpen: PropTypes.func,
    onOpenStart: PropTypes.func,
    openDrawerOffset: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]),
    panThreshold: PropTypes.number,
    panCloseMask: PropTypes.number,
    panOpenMask: PropTypes.number,
    side: PropTypes.oneOf([ 'left', 'right' ]),
    styles: PropTypes.object,
    tapToClose: PropTypes.bool,
    tweenDuration: PropTypes.number,
    tweenEasing: PropTypes.string,
    tweenHandler: PropTypes.func,
    type: PropTypes.oneOf([ 'overlay', 'static', 'displace' ]),
    useInteractionManager: PropTypes.bool,

    // deprecated
    panStartCompensation: PropTypes.bool,
    openDrawerThreshold: PropTypes.any,
  };

  static defaultProps = {
    type: 'overlay',
    openDrawerOffset: 0.2,
    closedDrawerOffset: 0,
    panCloseMask: 0.2,
    panOpenMask: 0.05,
    elevation: 4,
    tapToClose: true,
    captureGestures: true,
    negotiatePan: true,
    tweenEasing: 'easeInQuad',
  };
  _tweenHandler = ratio => ({
    main: {
      opacity: 1,
    },
    mainOverlay: {
      opacity: ratio / 2,
      backgroundColor: 'black',
    },
  });

  render() {
    const { children } = this.props;

    return (
      <RNDrawer
        tweenHandler={this._tweenHandler}
        {...this.props}
      >
        {children}
      </RNDrawer>
    );
  }
}
