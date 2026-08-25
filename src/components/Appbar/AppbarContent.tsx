import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import type {
  AppbarHeadlineAlignment,
  AppbarHeadlineVariant,
  Props as AppbarProps,
} from './types';
import { APPBAR_HEADLINE_IMAGE_HEIGHT } from './utils';
import type { Theme, TypescaleKey } from '../../types';
import Text from '../Typography/Text';

type Props = Pick<
  AppbarProps,
  | 'contentStyle'
  | 'headline'
  | 'headlineImage'
  | 'headlinePressableProps'
  | 'headlineProps'
  | 'onHeadlinePress'
  | 'subtitle'
  | 'subtitleProps'
> & {
  alignment: AppbarHeadlineAlignment;
  theme: Theme;
  variant: AppbarHeadlineVariant;
  style?: StyleProp<ViewStyle>;
  testID: string;
};

const headlineVariants: Record<AppbarHeadlineVariant, TypescaleKey> = {
  small: 'titleLarge',
  'medium-flexible': 'headlineMedium',
  'large-flexible': 'displaySmall',
};

const subtitleVariants: Record<AppbarHeadlineVariant, TypescaleKey> = {
  small: 'labelMedium',
  'medium-flexible': 'labelLarge',
  'large-flexible': 'titleMedium',
};

const subtitleSpacing: Record<AppbarHeadlineVariant, number> = {
  small: 0,
  'medium-flexible': 4,
  'large-flexible': 8,
};

const AppbarContent = ({
  alignment,
  contentStyle,
  headline,
  headlineImage,
  headlinePressableProps,
  headlineProps,
  onHeadlinePress,
  subtitle,
  subtitleProps,
  testID,
  theme,
  variant,
  style,
}: Props) => {
  const headlineVariant = headlineVariants[variant];
  const subtitleVariant = subtitleVariants[variant];
  const centered = alignment === 'center';
  const hasHeadlineImage = variant === 'small' && Boolean(headlineImage);
  const headlineStyle = React.useMemo(
    () => [
      styles.text,
      centered && styles.centeredText,
      { color: theme.colors.onSurface },
      headlineProps?.style,
    ],
    [centered, headlineProps?.style, theme.colors.onSurface]
  );
  const subtitleStyle = React.useMemo(
    () => [
      styles.text,
      centered && styles.centeredText,
      { marginTop: subtitleSpacing[variant] },
      { color: theme.colors.onSurfaceVariant },
      subtitleProps?.style,
    ],
    [centered, subtitleProps?.style, theme.colors.onSurfaceVariant, variant]
  );
  const wrapperStyle = React.useMemo(
    () => [
      styles.container,
      variant !== 'small' && styles.flexibleContainer,
      centered && styles.centeredContainer,
      style,
      contentStyle,
    ],
    [centered, contentStyle, style, variant]
  );

  const content = hasHeadlineImage ? (
    <View
      testID={`${testID}-headline-image`}
      aria-hidden
      importantForAccessibility="no-hide-descendants"
      style={styles.headlineImage}
    >
      {headlineImage}
    </View>
  ) : (
    <>
      <Text
        ref={headlineProps?.ref}
        theme={theme}
        variant={headlineVariant}
        numberOfLines={variant === 'small' ? 1 : 2}
        role="heading"
        accessible
        maxFontSizeMultiplier={headlineProps?.maxFontSizeMultiplier}
        testID={`${testID}-headline-text`}
        style={headlineStyle}
      >
        {headline}
      </Text>
      {subtitle ? (
        <Text
          variant={subtitleVariant}
          theme={theme}
          numberOfLines={1}
          maxFontSizeMultiplier={subtitleProps?.maxFontSizeMultiplier}
          testID={`${testID}-subtitle-text`}
          style={subtitleStyle}
        >
          {subtitle}
        </Text>
      ) : null}
    </>
  );

  const wrapperProps = {
    testID,
    style: wrapperStyle,
  };

  if (onHeadlinePress) {
    const {
      'aria-label': ariaLabel,
      accessibilityLabel,
      disabled,
      ...restHeadlinePressableProps
    } = headlinePressableProps ?? {};

    return (
      <Pressable
        {...wrapperProps}
        {...restHeadlinePressableProps}
        role="button"
        aria-label={
          ariaLabel ??
          accessibilityLabel ??
          (hasHeadlineImage ? headline : undefined)
        }
        aria-disabled={
          restHeadlinePressableProps['aria-disabled'] ??
          restHeadlinePressableProps.accessibilityState?.disabled ??
          disabled
        }
        disabled={disabled}
        onPress={onHeadlinePress}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      {...wrapperProps}
      accessible={hasHeadlineImage || undefined}
      accessibilityLabel={hasHeadlineImage ? headline : undefined}
      role={hasHeadlineImage ? 'heading' : undefined}
    >
      {content}
    </View>
  );
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
  headlineImage: {
    height: APPBAR_HEADLINE_IMAGE_HEIGHT,
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default React.memo(AppbarContent);
