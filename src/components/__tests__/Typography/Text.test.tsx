import { View } from 'react-native';
import type { Text as NativeText } from 'react-native';

import { expect, it, jest } from '@jest/globals';

import PaperProvider from '../../../core/PaperProvider';
import { render, screen } from '../../../test-utils';
import configureFonts from '../../../theme/fonts';
import { LightTheme } from '../../../theme/schemes';
import { tokens } from '../../../theme/tokens';
import AnimatedText from '../../Typography/AnimatedText';
import Text, { customText } from '../../Typography/Text';

const content = 'Something rendered as a child content';
const parentColor = 'tomato';

it('renders every variant of Text with children as content', async () => {
  const variants = (
    <>
      <Text variant="displayLarge">{content}</Text>
      <Text variant="displayMedium">{content}</Text>
      <Text variant="displaySmall">{content}</Text>

      <Text variant="headlineLarge">{content}</Text>
      <Text variant="headlineMedium">{content}</Text>
      <Text variant="headlineSmall">{content}</Text>

      <Text variant="titleLarge">{content}</Text>
      <Text variant="titleMedium">{content}</Text>
      <Text variant="titleSmall">{content}</Text>

      <Text variant="bodyLarge">{content}</Text>
      <Text variant="bodyMedium">{content}</Text>
      <Text variant="bodySmall">{content}</Text>

      <Text variant="labelLarge">{content}</Text>
      <Text variant="labelMedium">{content}</Text>
      <Text variant="labelSmall">{content}</Text>
    </>
  );

  const tree = (await render(variants)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders v3 Text component without variant with default fontWeight and fontFamily', async () => {
  await render(<Text testID="text-without-variant">{content}</Text>);
  const { brandRegular, weightRegular } = tokens.md.ref.typeface;

  expect(screen.getByTestId('text-without-variant')).toHaveStyle({
    fontFamily: brandRegular,
    fontWeight: weightRegular,
  });
});

it('renders v3 Text component with custom variant correctly', async () => {
  const fontConfig = {
    customVariant: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      letterSpacing: 0.51,
      lineHeight: 54.1,
      fontSize: 41,
    },
  } as const;

  const theme = {
    ...LightTheme,
    fonts: configureFonts({ config: fontConfig }),
  };
  const Text = customText<'customVariant'>();
  await render(
    <PaperProvider theme={theme}>
      <Text testID="text-with-custom-variant" variant="customVariant">
        {content}
      </Text>
    </PaperProvider>
  );

  expect(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByTestId('text-with-custom-variant').props.style
  ).toMatchSnapshot();
});

it("nested text with variant should override parent's variant", async () => {
  await render(
    <Text testID="parent-text" variant="bodySmall">
      <Text variant="displayLarge">Test</Text>
    </Text>
  );

  expect(screen.getByTestId('parent-text')).toHaveStyle(
    LightTheme.fonts.displayLarge
  );
});

it("nested non-text component should not override parent's variant", async () => {
  const ChildComponent = () => <>{content}</>;

  await render(
    <Text testID="parent-text" variant="displayLarge">
      <ChildComponent />
    </Text>
  );

  expect(screen.getByTestId('parent-text')).toHaveStyle(
    LightTheme.fonts.displayLarge
  );
});

it("nested text without variant, but with styles, should override parent's styles", async () => {
  const customStyle = { fontSize: 50, lineHeight: 70 };
  await render(
    <Text testID="parent-text" variant="bodySmall">
      <Text style={customStyle}>Test</Text>
    </Text>
  );

  expect(screen.getByTestId('parent-text')).toHaveStyle(customStyle);
});

it("nested unstyled text should leave the parent's variant intact", async () => {
  await render(
    <Text testID="parent-text" variant="displayLarge">
      <Text>Test</Text>
    </Text>
  );

  expect(screen.getByTestId('parent-text')).toHaveStyle(
    LightTheme.fonts.displayLarge
  );
});

it("nested styled text should only override the parent's clashing properties", async () => {
  await render(
    <Text testID="parent-text" variant="displayLarge">
      <Text style={{ fontSize: 50 }}>Test</Text>
    </Text>
  );

  expect(screen.getByTestId('parent-text')).toHaveStyle({
    fontSize: 50,
    letterSpacing: LightTheme.fonts.displayLarge.letterSpacing,
    lineHeight: LightTheme.fonts.displayLarge.lineHeight,
  });
});

it('nested text keeps its own style and inherits the rest from the parent', async () => {
  await render(
    <Text
      testID="parent-text"
      variant="displayLarge"
      style={{ color: parentColor }}
    >
      Parent{' '}
      <Text testID="child-text" style={{ fontStyle: 'italic' }}>
        child
      </Text>
    </Text>
  );

  expect(screen.getByTestId('parent-text')).toHaveStyle({
    ...LightTheme.fonts.displayLarge,
    color: parentColor,
  });
  expect(screen.getByTestId('child-text')).toHaveStyle({
    fontStyle: 'italic',
    fontFamily: undefined,
    fontSize: undefined,
    fontWeight: undefined,
    letterSpacing: undefined,
    color: undefined,
  });
});

it('text nested inside another component inherits from the enclosing text', async () => {
  const Label = () => <Text testID="child-text">child</Text>;

  await render(
    <Text
      testID="parent-text"
      variant="displayLarge"
      style={{ color: parentColor }}
    >
      <Label />
    </Text>
  );

  expect(screen.getByTestId('parent-text')).toHaveStyle({
    ...LightTheme.fonts.displayLarge,
    color: parentColor,
  });
  expect(screen.getByTestId('child-text')).toHaveStyle({
    fontFamily: undefined,
    fontWeight: undefined,
    letterSpacing: undefined,
    color: undefined,
  });
});

it('nested text with a variant applies its font and inherits the color', async () => {
  await render(
    <Text variant="headlineSmall" style={{ color: parentColor }}>
      Parent{' '}
      <Text testID="child-text" variant="bodyLarge">
        child
      </Text>
    </Text>
  );

  expect(screen.getByTestId('child-text')).toHaveStyle({
    ...LightTheme.fonts.bodyLarge,
    color: undefined,
  });
});

it('nested text with its own theme uses the theme color', async () => {
  const theme = { colors: { onSurface: 'green' } };

  await render(
    <Text variant="headlineSmall">
      Parent{' '}
      <Text testID="child-text" theme={theme}>
        child
      </Text>{' '}
      <Text testID="variant-child-text" variant="bodyLarge" theme={theme}>
        variant child
      </Text>
    </Text>
  );

  expect(screen.getByTestId('child-text')).toHaveStyle({ color: 'green' });
  expect(screen.getByTestId('variant-child-text')).toHaveStyle({
    ...LightTheme.fonts.bodyLarge,
    color: 'green',
  });
});

it('animated text uses its fallback font at the top level and nests like text', async () => {
  const theme = { colors: { onSurface: 'green' } };

  await render(
    <AnimatedText testID="parent-text" style={{ color: parentColor }}>
      Parent <AnimatedText testID="child-text">child</AnimatedText>{' '}
      <AnimatedText testID="variant-child-text" variant="bodyLarge">
        variant child
      </AnimatedText>{' '}
      <AnimatedText testID="theme-child-text" theme={theme}>
        theme child
      </AnimatedText>
    </AnimatedText>
  );

  const { fontFamily, fontSize } = LightTheme.fonts.bodyMedium;

  expect(screen.getByTestId('parent-text')).toHaveStyle({
    fontFamily,
    fontSize,
    color: parentColor,
  });
  expect(screen.getByTestId('child-text')).toHaveStyle({
    fontFamily: undefined,
    fontSize: undefined,
    color: undefined,
  });
  expect(screen.getByTestId('variant-child-text')).toHaveStyle({
    ...LightTheme.fonts.bodyLarge,
    color: undefined,
  });
  expect(screen.getByTestId('theme-child-text')).toHaveStyle({
    color: 'green',
  });
});

it('text inside a View inside a text renders like a top-level text', async () => {
  await render(
    <Text variant="headlineSmall" style={{ color: parentColor }}>
      Parent{' '}
      <View>
        <Text testID="child-text">child in a View</Text>
      </View>
      <View>
        <AnimatedText testID="animated-child-text">
          animated child in a View
        </AnimatedText>
      </View>
    </Text>
  );

  expect(screen.getByTestId('child-text')).toHaveStyle({
    ...LightTheme.fonts.default,
    color: LightTheme.colors.onSurface,
  });
  expect(screen.getByTestId('animated-child-text')).toHaveStyle({
    ...LightTheme.fonts.bodyMedium,
    color: LightTheme.colors.onSurface,
  });
});

it("detects nesting like React Native's own Text and View", async () => {
  // Nesting relies on React Native's unstable text ancestor context, so check
  // it against the real components instead of the test mocks
  const { default: RealText } = jest.requireActual<{
    default: typeof NativeText;
  }>('react-native/Libraries/Text/Text');
  const { default: RealView } = jest.requireActual<{
    default: typeof View;
  }>('react-native/Libraries/Components/View/View');

  await render(
    <RealText style={{ color: parentColor }}>
      Parent <Text testID="child-text">child</Text>
      <RealView>
        <Text testID="view-child-text">child in a View</Text>
      </RealView>
    </RealText>
  );

  expect(screen.getByTestId('child-text')).toHaveStyle({
    fontFamily: undefined,
    color: undefined,
  });
  expect(screen.getByTestId('view-child-text')).toHaveStyle({
    ...LightTheme.fonts.default,
    color: LightTheme.colors.onSurface,
  });
});

it('throws when custom variant not provided', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  const Text = customText<'myCustomVariant'>();
  await expect(
    render(<Text variant="myCustomVariant">{content}</Text>)
  ).rejects.toThrow(/myCustomVariant was not provided/);

  jest.clearAllMocks();
});
