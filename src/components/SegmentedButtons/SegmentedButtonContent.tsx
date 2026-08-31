import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

import {
  ReduceMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import AnimatedCheckIcon from './AnimatedCheckIcon';
import AnimatedOptionIcon from './AnimatedOptionIcon';
import { SegmentedButtonTokens } from './tokens';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { Theme } from '../../types';
import type { IconSource } from '../Icon';
import Text from '../Typography/Text';

type Props = {
  checked: boolean;
  icon?: IconSource;
  iconColor: TextStyle['color'];
  iconOpacity: number;
  label?: string;
  labelColor: TextStyle['color'];
  labelMaxFontSizeMultiplier?: number;
  labelOpacity: number;
  labelStyle?: StyleProp<TextStyle>;
  showSelectedCheck?: boolean;
  testID?: string;
  theme: Theme;
};

const SegmentedButtonContent = ({
  checked,
  icon,
  iconColor,
  iconOpacity,
  label,
  labelColor,
  labelMaxFontSizeMultiplier,
  labelOpacity,
  labelStyle,
  showSelectedCheck,
  testID,
  theme,
}: Props) => {
  const showCheckIcon = !!(checked && showSelectedCheck);
  const optionIcon = icon && (!label || !showCheckIcon) ? icon : undefined;

  const reduceMotion = useReduceMotion();
  const checkmarkScale = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    checkmarkScale.value = withSpring(showCheckIcon ? 1 : 0, {
      reduceMotion: reduceMotion ? ReduceMotion.Always : ReduceMotion.Never,
    });
  }, [checkmarkScale, reduceMotion, showCheckIcon]);

  const labelTextStyle: TextStyle = {
    ...theme.fonts[SegmentedButtonTokens.labelTextType],
    color: labelColor,
  };

  return (
    <View style={styles.content}>
      {showCheckIcon && (
        <AnimatedCheckIcon
          color={iconColor}
          opacity={iconOpacity}
          scale={checkmarkScale}
          testID={testID && `${testID}-check-icon`}
        />
      )}
      {optionIcon && (
        <AnimatedOptionIcon
          animated={Boolean(label && showSelectedCheck)}
          color={iconColor}
          opacity={iconOpacity}
          scale={checkmarkScale}
          source={optionIcon}
          testID={testID && `${testID}-icon`}
        />
      )}
      {label && (
        <Text
          variant={SegmentedButtonTokens.labelTextType}
          style={[
            styles.label,
            labelTextStyle,
            { opacity: labelOpacity },
            labelStyle,
          ]}
          selectable={false}
          numberOfLines={1}
          maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
          testID={testID && `${testID}-label`}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SegmentedButtonTokens.horizontalPadding,
    columnGap: SegmentedButtonTokens.iconLabelGap,
  },
  label: {
    flexShrink: 1,
    textAlign: 'center',
  },
});

export default SegmentedButtonContent;
