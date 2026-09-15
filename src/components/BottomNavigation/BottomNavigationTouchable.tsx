import { Pressable } from 'react-native';

import type { BaseRoute, TouchableProps } from './types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

const BottomNavigationTouchable = <Route extends BaseRoute>({
  route: _route,
  style,
  children,
  borderless,
  centered,
  rippleColor,
  ...rest
}: TouchableProps<Route>) =>
  TouchableRipple.supported ? (
    <TouchableRipple
      {...rest}
      disabled={rest.disabled || undefined}
      borderless={borderless}
      centered={centered}
      rippleColor={rippleColor}
      style={style}
    >
      {children}
    </TouchableRipple>
  ) : (
    <Pressable style={style} {...rest}>
      {children}
    </Pressable>
  );

const renderDefaultTouchable = <Route extends BaseRoute>({
  key,
  ...props
}: TouchableProps<Route>) => <BottomNavigationTouchable key={key} {...props} />;

export { renderDefaultTouchable };
export default BottomNavigationTouchable;
