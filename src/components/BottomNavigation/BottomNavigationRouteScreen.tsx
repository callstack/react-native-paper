import React from 'react';
import { Animated, Platform, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  visibility?: 0 | 1 | Animated.AnimatedInterpolation;
  index: number;
}

class BottomNavigationRouteScreen extends React.Component<Props> {
  render(): JSX.Element {
    const { style, index, children, visibility, ...rest } = this.props;

    // On Web, the unfocused tab screens can still be clicked since they are transparent, but still there
    // Hiding them with `display: none` makes sure that they won't receive clicks
    // We only set it on Web since on native, react-native-pager-view's breaks due to layout changing
    const display =
      Platform.OS === 'web' ? (visibility === 0 ? 'none' : 'flex') : undefined;

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
