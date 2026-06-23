import { expect, it, jest } from '@jest/globals';

import PaperProvider from '../../../core/PaperProvider';
import { render, screen } from '../../../test-utils';
import configureFonts from '../../../theme/fonts';
import { LightTheme } from '../../../theme/schemes';
import { tokens } from '../../../theme/tokens';
import Text, { customText } from '../../Typography/Text';

const content = 'Something rendered as a child content';

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

it('throws when custom variant not provided', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  const Text = customText<'myCustomVariant'>();
  await expect(
    render(<Text variant="myCustomVariant">{content}</Text>)
  ).rejects.toThrow(/myCustomVariant was not provided/);

  jest.clearAllMocks();
});
