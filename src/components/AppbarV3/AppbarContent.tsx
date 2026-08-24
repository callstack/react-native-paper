import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import type {
  AppbarTitleAlignment,
  AppbarTitleVariant,
  Props as AppbarProps,
} from './types';
import { APPBAR_TITLE_IMAGE_HEIGHT } from './utils';
import type { Theme, TypescaleKey } from '../../types';
import Text from '../Typography/Text';

type Props = Pick<
  AppbarProps,
  | 'contentStyle'
  | 'onTitlePress'
  | 'subtitle'
  | 'subtitleProps'
  | 'title'
  | 'titleImage'
  | 'titleProps'
> & {
  alignment: AppbarTitleAlignment;
  theme: Theme;
  variant: AppbarTitleVariant;
  style?: StyleProp<ViewStyle>;
  testID: string;
};

const titleVariants = {
  small: 'titleLarge',
  'medium-flexible': 'headlineMedium',
  'large-flexible': 'displaySmall',
} as const satisfies Record<AppbarTitleVariant, TypescaleKey>;

const subtitleVariants = {
  small: 'labelMedium',
  'medium-flexible': 'labelLarge',
  'large-flexible': 'titleMedium',
} as const satisfies Record<AppbarTitleVariant, TypescaleKey>;

const subtitleSpacing = {
  small: 0,
  'medium-flexible': 4,
  'large-flexible': 8,
} as const satisfies Record<AppbarTitleVariant, number>;

const AppbarContent = ({
  alignment,
  contentStyle,
  onTitlePress,
  subtitle,
  subtitleProps,
  testID,
  theme,
  title,
  titleImage,
  titleProps,
  variant,
  style,
}: Props) => {
  const titleVariant = titleVariants[variant];
  const subtitleVariant = subtitleVariants[variant];
  const centered = alignment === 'center';
  const hasTitleImage = variant === 'small' && Boolean(titleImage);

  const content = hasTitleImage ? (
    <View
      testID={`${testID}-title-image`}
      aria-hidden
      importantForAccessibility="no-hide-descendants"
      style={styles.titleImage}
    >
      {titleImage}
    </View>
  ) : (
    <>
      <Text
        ref={titleProps?.ref}
        theme={theme}
        variant={titleVariant}
        numberOfLines={variant === 'small' ? 1 : 2}
        role={onTitlePress ? 'none' : 'heading'}
        accessible
        maxFontSizeMultiplier={titleProps?.maxFontSizeMultiplier}
        testID={`${testID}-title-text`}
        style={[
          styles.text,
          centered && styles.centeredText,
          { color: theme.colors.onSurface },
          titleProps?.style,
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          variant={subtitleVariant}
          theme={theme}
          numberOfLines={1}
          maxFontSizeMultiplier={subtitleProps?.maxFontSizeMultiplier}
          testID={`${testID}-subtitle-text`}
          style={[
            styles.text,
            centered && styles.centeredText,
            { marginTop: subtitleSpacing[variant] },
            { color: theme.colors.onSurfaceVariant },
            subtitleProps?.style,
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
        accessibilityLabel={hasTitleImage ? title : undefined}
        onPress={onTitlePress}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      {...wrapperProps}
      accessible={hasTitleImage || undefined}
      accessibilityLabel={hasTitleImage ? title : undefined}
      role={hasTitleImage ? 'heading' : undefined}
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
  titleImage: {
    height: APPBAR_TITLE_IMAGE_HEIGHT,
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default AppbarContent;
