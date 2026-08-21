import { Pressable, StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import type {
  AppbarTitleAlignment,
  AppbarVariant,
  Props as AppbarProps,
} from './types';
import type { Theme, TypescaleKey } from '../../types';
import Text from '../Typography/Text';

type Props = Pick<
  AppbarProps,
  | 'contentStyle'
  | 'onTitlePress'
  | 'subtitle'
  | 'subtitleMaxFontSizeMultiplier'
  | 'subtitleStyle'
  | 'title'
  | 'titleDisabled'
  | 'titleImage'
  | 'titleMaxFontSizeMultiplier'
  | 'titleRef'
  | 'titleStyle'
> & {
  alignment: AppbarTitleAlignment;
  subtitleColor: ColorValue;
  theme: Theme;
  titleColor: ColorValue;
  variant: AppbarVariant;
  style?: StyleProp<ViewStyle>;
  testID: string;
};

const titleVariants = {
  small: 'titleLarge',
  'medium-flexible': 'headlineMedium',
  'large-flexible': 'displaySmall',
} as const satisfies Record<AppbarVariant, TypescaleKey>;

const subtitleVariants = {
  small: 'labelSmall',
  'medium-flexible': 'labelLarge',
  'large-flexible': 'titleMedium',
} as const satisfies Record<AppbarVariant, TypescaleKey>;

const subtitleSpacing = {
  small: 0,
  'medium-flexible': 4,
  'large-flexible': 8,
} as const satisfies Record<AppbarVariant, number>;

const AppbarContent = ({
  alignment,
  contentStyle,
  onTitlePress,
  subtitle,
  subtitleColor,
  subtitleMaxFontSizeMultiplier,
  subtitleStyle,
  testID,
  theme,
  title,
  titleColor,
  titleDisabled,
  titleImage,
  titleMaxFontSizeMultiplier,
  titleRef,
  titleStyle,
  variant,
  style,
}: Props) => {
  const titleVariant = titleVariants[variant];
  const subtitleVariant = subtitleVariants[variant];
  const centered = alignment === 'center';

  const content = titleImage ? (
    titleImage
  ) : (
    <>
      <Text
        ref={titleRef}
        theme={theme}
        variant={titleVariant}
        numberOfLines={variant === 'small' ? 1 : 2}
        role={onTitlePress ? 'none' : 'heading'}
        accessible
        maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
        testID={`${testID}-title-text`}
        style={[
          styles.text,
          centered && styles.centeredText,
          { color: titleColor },
          titleStyle,
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          variant={subtitleVariant}
          theme={theme}
          numberOfLines={1}
          maxFontSizeMultiplier={subtitleMaxFontSizeMultiplier}
          testID={`${testID}-subtitle-text`}
          style={[
            styles.text,
            centered && styles.centeredText,
            { marginTop: subtitleSpacing[variant] },
            { color: subtitleColor },
            subtitleStyle,
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </>
  );

  const wrapperProps = {
    testID,
    style: [
      styles.container,
      variant !== 'small' && styles.flexibleContainer,
      centered && styles.centeredContainer,
      style,
      contentStyle,
    ],
  };

  if (onTitlePress) {
    return (
      <Pressable
        {...wrapperProps}
        role="button"
        aria-disabled={titleDisabled}
        disabled={titleDisabled}
        onPress={onTitlePress}
      >
        {content}
      </Pressable>
    );
  }

  return <View {...wrapperProps}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  flexibleContainer: {
    flex: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  centeredContainer: {
    alignItems: 'center',
  },
  text: {
    alignSelf: 'stretch',
  },
  centeredText: {
    textAlign: 'center',
  },
});

export default AppbarContent;
