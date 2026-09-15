import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

import Animated from 'react-native-reanimated';

type Props = ViewProps & {
  index: number;
};

const BottomNavigationRouteScreen = ({
  style,
  index,
  children,
  ...rest
}: Props): ReactNode => (
  <Animated.View testID={`RouteScreen: ${index}`} style={style} {...rest}>
    {children}
  </Animated.View>
);

export default BottomNavigationRouteScreen;
