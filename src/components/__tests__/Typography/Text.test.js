import * as React from 'react';

import { render } from '@testing-library/react-native';
import renderer from 'react-test-renderer';

import { tokens } from '../../../styles/themes/v3/tokens';
import Text from '../../Typography/Text.tsx';

const content = 'Something rendered as a child content';

it('renders every variant of Text with children as content', () => {
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

  const tree = renderer.create(variants).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders v3 Text component without variant with default fontWeight and fontFamily', () => {
  const { getByTestId } = render(
    <Text testID="text-without-variant">{content}</Text>
  );
  const { brandRegular, weightRegular } = tokens.md.ref.typeface;

  expect(getByTestId('text-without-variant')).toHaveStyle({
    fontFamily: brandRegular,
    fontWeight: weightRegular,
  });
});
