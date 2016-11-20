/* @flow */

import RNDrawer from 'react-native-drawer';
import React, {
  Component,
  PropTypes,
} from 'react';
import { View, StyleSheet } from 'react-native';
import DrawerItem from './DrawerItem';
import DrawerSection from './DrawerSection';
import { white } from '../../styles/colors';

type Props = {
  children?: any;
  content?: any;
  locked?: boolean;
  onClose?: Function;
  onOpen?: Function;
  open?: boolean;
  swipeRatio?: number;
  style?: any;
  side?: string;
  width?: number;
}

type DefaultProps = {
  locked: boolean;
  open: boolean;
  swipeRatio: number;
  side: string;
}

class Drawer extends Component<DefaultProps, Props, void> {
  static Item = DrawerItem;
  static Section = DrawerSection;

  static propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    /*
    Specifies the lock mode of the drawer. The drawer can be locked in 2 states:
     - false, meaning that the drawer will respond (open/close) to touch gestures
     - true, meaning that the drawer won't respond to touch gestures but it can be open by passing prop `open`
     */
    locked: PropTypes.bool,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.bool,
    /* Ratio of screen width that is valid for the start of a pan open action */
    swipeRatio: PropTypes.number,
    width: PropTypes.number,
    style: View.propTypes.style,
    side: PropTypes.oneOf([ 'left', 'right' ]),
  }

  static defaultProps = {
    side: 'left',
    locked: false,
    open: false,
    swipeRatio: 0.05,
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
  })

  _handleClose = () => {
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

  _handleOpen = () => {
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

  _calculateOpenDrawerOffset = viewport => this.props.width ?
      (viewport.width - this.props.width) :
      (viewport.width - ((viewport.width * 80) / 100))

  render(): ?React.Element<any> {
    const {
      children,
      content,
      style,
      side,
      locked,
      open,
      swipeRatio,
    } = this.props;

    return (
      <RNDrawer
        {...this.props}
        ref={c => (this._root = c)}
        tapToClose
        captureGestures
        negotiatePan
        acceptPan={!locked}
        type='overlay'
        tweenEasing='easeInQuad'
        content={content}
        open={open}
        openDrawerOffset={this._calculateOpenDrawerOffset}
        panOpenMask={swipeRatio}
        onClose={this._handleClose}
        onOpen={this._handleOpen}
        tweenHandler={this._tweenHandler}
        side={side}
        styles={{ drawer: StyleSheet.flatten({ backgroundColor: white }, style) }}
      >
        {children}
      </RNDrawer>
    );
  }
}

export default Drawer;
