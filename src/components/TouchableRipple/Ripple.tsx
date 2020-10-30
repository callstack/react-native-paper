import {
  StyleSheet,
  View,
  ViewProps,
  //@ts-ignore
  unstable_createElement,
  ColorValue,
} from 'react-native';
import * as React from 'react';

type RippleStatusType = 'pressed' | 'not_pressed';

export type RippleType = {
  style: {
    backgroundColor: ColorValue;
    left: number;
    top: number;
    width: number;
    height: number;
  };
  animationDuration: number;
  status: RippleStatusType;
};

interface AnimatedDivProps extends ViewProps {
  onAnimationEnd?: () => any;
}

const Div = (props: AnimatedDivProps) => unstable_createElement('div', props);

const RIPPLE_DURATION = 250;

export const RippleStatus: { [key: string]: RippleStatusType } = {
  Pressed: 'pressed',
  NotPressed: 'not_pressed',
};

export default function Ripple({
  onRemove,
  ripple,
  ripple: { status, animationDuration, style },
}: {
  ripple: RippleType;
  onRemove: (ripple: RippleType) => any;
}) {
  const onAnimationEnd = () => {
    if (status === RippleStatus.NotPressed) {
      onRemove(ripple);
    }
  };

  return (
    <View
      style={[
        rippleStyles.container,
        status === RippleStatus.Pressed ? rippleStyles.show : rippleStyles.hide,
      ]}
    >
      <Div
        onAnimationEnd={onAnimationEnd}
        style={[
          rippleStyles.ripple,
          style,
          {
            // @ts-ignore
            animationDuration: `${animationDuration}ms`,
          },
        ]}
      />
    </View>
  );
}

const fromRippleStyle = {
  transform: [
    { translateY: '-50%' as any },
    { translateX: '-50%' as any },
    { scale: '0.1' as any },
  ],
};

const toRippleStyle = {
  transform: [
    { translateY: '-50%' as any },
    { translateX: '-50%' as any },
    { scale: '1' as any },
  ],
};

const rippleStyles = StyleSheet.create({
  ripple: {
    position: 'absolute',

    willChange: 'transform' as any,
    borderRadius: '50%' as any,
    transformOrigin: 'center',
    animationDuration: `${RIPPLE_DURATION}ms`,
    animationTimingFunction: 'linear',
    ...toRippleStyle,
    //@ts-ignore
    animationKeyframes: {
      '0%': fromRippleStyle,
      '100%': toRippleStyle,
    },
  },
  container: {
    //@ts-ignore
    transitionDuration: `250ms`,
    willChange: 'opacity' as any,
    transitionProperty: 'opacity',
    transitionTimingFunction: 'linear',
  },
  show: {
    opacity: 0.5,
  },
  hide: {
    opacity: 0,
  },
});
