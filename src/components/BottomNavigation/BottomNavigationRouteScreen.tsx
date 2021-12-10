import React from 'react';
import { Animated, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  visibility?: 0 | 1 | Animated.AnimatedInterpolation;
  index: number;
}

class BottomNavigationRouteScreen extends React.Component<Props> {
  render(): JSX.Element {
    const { style, index, children, visibility, ...rest } = this.props;

    const display = visibility === 0 ? 'none' : 'flex';

    return (
      <View
        testID={`RouteScreen: ${index}`}
        style={[style, { display }]}
        {...rest}
      >
        {children}
      </View>
    );
  }
}

export default Animated.createAnimatedComponent(BottomNavigationRouteScreen);
