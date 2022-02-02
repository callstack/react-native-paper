import * as React from 'react';
import renderer from 'react-test-renderer';
import Text from '../../Typography/Text.tsx';

it('renders every variant of Text with children as content', () => {
  const content = 'Something rendered as a child content';

  const variants = (
    <>
      <Text variant="display-large">{content}</Text>
      <Text variant="display-medium">{content}</Text>
      <Text variant="display-small">{content}</Text>

      <Text variant="headline-large">{content}</Text>
      <Text variant="headline-medium">{content}</Text>
      <Text variant="headline-small">{content}</Text>

      <Text variant="title-large">{content}</Text>
      <Text variant="title-medium">{content}</Text>
      <Text variant="title-small">{content}</Text>

      <Text variant="body-large">{content}</Text>
      <Text variant="body-medium">{content}</Text>
      <Text variant="body-small">{content}</Text>

      <Text variant="label-large">{content}</Text>
      <Text variant="label-medium">{content}</Text>
      <Text variant="label-small">{content}</Text>
    </>
  );

  const tree = renderer.create(variants).toJSON();

  expect(tree).toMatchSnapshot();
});
