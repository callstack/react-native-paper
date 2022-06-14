import * as React from 'react';
import renderer from 'react-test-renderer';
import Text from '../../Typography/Text.tsx';

it('renders every variant of Text with children as content', () => {
  const content = 'Something rendered as a child content';

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
