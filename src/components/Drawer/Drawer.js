/* @flow */

import { default as RNDrawer } from 'react-native-drawer';
import React, {
  Component,
  PropTypes,
} from 'react';
import DrawerItem from './DrawerItem';
import DrawerGroup from './DrawerGroup';
import { white } from '../../styles/colors';

type Props = {
  children?: any;
  drawerBackgroundColor?: string;
  drawerPosition?: string;
  drawerWidth?: number;
  drawerLockMode?: string;
  navigationView: any;
  onClose?: Function;
  onOpen?: Function;
  open?: boolean;
  panOpenMask?: number;
}

type DefaultProps = {
  drawerBackgroundColor: string;
  drawerPosition: string;
  drawerLockMode: string;
  open: boolean;
  panOpenMask: number;
}

class Drawer extends Component<DefaultProps, Props, void> {
  static Item = DrawerItem;
  static Group = DrawerGroup;

  static propTypes = {
    children: PropTypes.node.isRequired,
    drawerBackgroundColor: PropTypes.string,
    drawerPosition: PropTypes.oneOf([ 'left', 'right' ]),
    drawerWidth: PropTypes.number,
    /*
    Specifies the lock mode of the drawer. The drawer can be locked in 2 states:
     - unlocked (default), meaning that the drawer will respond (open/close) to touch gestures
     - locked, meaning that the drawer won't respond to touch gestures but it can be open by passing prop `open`
     */
    drawerLockMode: PropTypes.oneOf([ 'unlocked', 'locked' ]),
    navigationView: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.bool,
    /* Ratio of screen width that is valid for the start of a pan open action */
    panOpenMask: PropTypes.number,
  }

  static defaultProps = {
    drawerBackgroundColor: white,
    drawerPosition: 'left',
    drawerLockMode: 'unlocked',
    open: false,
    panOpenMask: 0.05,
  }
  _root: any;

  _tweenHandler = ratio => ({
    main: {
      opacity: 1,
    },
    mainOverlay: {
      opacity: ratio / 2,
      backgroundColor: 'black',
    },
  });
  _onClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
    global.requestAnimationFrame(() => {
      if (this.props.open === false) {
        return;
      } else {
        this._root.open();
      }
    });
  }
  _onOpen = () => {
    if (this.props.onOpen) {
      this.props.onOpen();
    }
    global.requestAnimationFrame(() => {
      if (this.props.open === true) {
        return;
      } else {
        this._root.close();
      }
    });
  }
  _calculateOpenDrawerOffset = viewport => this.props.drawerWidth ?
      (viewport.width - this.props.drawerWidth) :
      (viewport.width - ((viewport.width * 80) / 100))

  render(): ?React.Element<any> {
    const {
      children,
      drawerBackgroundColor,
      drawerPosition,
      drawerLockMode,
      navigationView,
      open,
      panOpenMask,
    } = this.props;

    return (
      <RNDrawer
        {...this.props}
        ref={c => (this._root = c)}
        tapToClose
        captureGestures
        negotiatePan
        acceptPan={drawerLockMode === 'unlocked'}
        type='overlay'
        tweenEasing='easeInQuad'
        content={navigationView}
        open={open}
        openDrawerOffset={this._calculateOpenDrawerOffset}
        panOpenMask={panOpenMask}
        onClose={this._onClose}
        onOpen={this._onOpen}
        tweenHandler={this._tweenHandler}
        side={drawerPosition}
        styles={{ drawer: { backgroundColor: drawerBackgroundColor } }}
      >
        {children}
      </RNDrawer>
    );
  }
}

export default Drawer;
