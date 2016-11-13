/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import { default as RNDrawer } from 'react-native-drawer';

type Props = {
  children: any;
  drawerPosition?: string;
  navigationView: any;
  onDrawerClose?: Function;
  onDrawerOpen?: Function;
  open?: boolean;
  style?: any;
}

type DefaultProps = {
  open: false;
  drawerPosition: string;
}

export default class Drawer extends Component<DefaultProps, Props, void> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    navigationView: PropTypes.node.isRequired,
    drawerPosition: PropTypes.oneOf([ 'left', 'right' ]),
    onDrawerClose: PropTypes.func,
    onDrawerOpen: PropTypes.func,
    open: PropTypes.bool,
    style: PropTypes.object,
  }

  static defaultProps = {
    drawerPosition: 'left',
    open: false,
  }


  // static propTypes = {
  //   acceptDoubleTap: PropTypes.bool,
  //   acceptPan: PropTypes.bool,
  //   acceptTap: PropTypes.bool,
  //   captureGestures: PropTypes.oneOf([ true, false, 'open', 'closed' ]),
  //   closedDrawerOffset: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]),
  //   content: PropTypes.node,
  //   disabled: PropTypes.bool,
  //   elevation: PropTypes.number,
  //   initializeOpen: PropTypes.bool,
  //   open: PropTypes.bool,
  //   negotiatePan: PropTypes.bool,
  //   onClose: PropTypes.func,
  //   onCloseStart: PropTypes.func,
  //   onOpen: PropTypes.func,
  //   onOpenStart: PropTypes.func,
  //   openDrawerOffset: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]),
  //   panThreshold: PropTypes.number,
  //   panCloseMask: PropTypes.number,
  //   panOpenMask: PropTypes.number,
  //   side: PropTypes.oneOf([ 'left', 'right' ]),
  //   tapToClose: PropTypes.bool,
  //   tweenDuration: PropTypes.number,
  //   tweenEasing: PropTypes.string,
  //   tweenHandler: PropTypes.func,
  //   useInteractionManager: PropTypes.bool,
  //
  //   // deprecated
  //   panStartCompensation: PropTypes.bool,
  //   openDrawerThreshold: PropTypes.any,
  // };

  _tweenHandler = ratio => ({
    main: {
      opacity: 1,
    },
    mainOverlay: {
      opacity: ratio / 2,
      backgroundColor: 'black',
    },
  });
  _onDrawerClose = () => {
    if (this.props.onDrawerClose) {
      this.props.onDrawerClose();
    }
  }
  _onDrawerOpen = () => {
    if (this.props.onDrawerOpen) {
      this.props.onDrawerOpen();
    }
  }
  render() {
    const {
      children,
      drawerPosition,
      navigationView,
      style,
      open,
    } = this.props;

    return (
      <RNDrawer
        {...this.props}
        tapToClose
        captureGestures
        negotiatePan
        content={navigationView}
        open={open}
        type='overlay'
        tweenEasing='easeInQuad'
        openDrawerOffset={0.2}
        closedDrawerOffset={0}
        panCloseMask={0.2}
        panOpenMask={0.05}
        onClose={this._onDrawerClose}
        onOpen={this._onDrawerOpen}
        tweenHandler={this._tweenHandler}
        side={drawerPosition}
        styles={{ drawer: style }}
      >
        {children}
      </RNDrawer>
    );
  }
}
