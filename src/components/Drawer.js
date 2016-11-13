/* @flow */

import { default as RNDrawer } from 'react-native-drawer';
import React, {
  Component,
  PropTypes,
} from 'react';
import { View, Text } from 'react-native';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { white, grey300 } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

type Props = {
  children?: any;
  drawerBackgroundColor?: string;
  drawerPosition?: string;
  drawerWidth?: number;
  drawerLockMode?: string;
  navigationView: any;
  onDrawerClose?: Function;
  onDrawerOpen?: Function;
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
    onDrawerClose: PropTypes.func,
    onDrawerOpen: PropTypes.func,
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
        onClose={this._onDrawerClose}
        onOpen={this._onDrawerOpen}
        tweenHandler={this._tweenHandler}
        side={drawerPosition}
        styles={{ drawer: { backgroundColor: drawerBackgroundColor } }}
      >
        {children}
      </RNDrawer>
    );
  }
}

type DrawerItemProps = {
  icon?: string;
  text?: string;
  active?: boolean;
  onPress?: Function;
  theme: Theme;
}

const DrawerItem = ({ icon, text, active, onPress, theme }: DrawerItemProps) => {
  const { colors } = theme;
  const textColor = active ? colors.primary : colors.text;
  return (
    <TouchableRipple onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8, backgroundColor: active ? grey300 : 'transparent' }}>
        { icon && <Icon
          name={icon}
          size={24}
          color={textColor}
          style={{ marginRight: 8 }}
                  />}
        <Text style={{ color: textColor }}>{text}</Text>
      </View>
    </TouchableRipple>
  );
};

DrawerItem.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onPress: PropTypes.func,
  theme: PropTypes.object.isRequired,
};

Drawer.DrawerItem = withTheme(DrawerItem);
export default Drawer;
