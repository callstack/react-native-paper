import React from 'react';
import { Button, Text } from 'react-native';

import { fireEvent, screen } from '@testing-library/react-native';
import { measurePerformance } from 'reassure';

import Card from '../../Card/Card';
import theme from '../utils';

const TEST_ID = 'card-perf-test';

function renderCard(props = {}) {
  return (
    <Card {...props} testID={TEST_ID}>
      <Text>Label</Text>
    </Card>
  );
}

describe('Card perf', () => {
  test('Base', async () => {
    await measurePerformance(renderCard());
  });

  test('with Title', async () => {
    await measurePerformance(
      <Card testID={TEST_ID}>
        <Card.Title title="Title" />
      </Card>
    );
  });

  test('with Content', async () => {
    await measurePerformance(
      <Card testID={TEST_ID}>
        <Card.Content>
          <Text>Content</Text>
        </Card.Content>
      </Card>
    );
  });

  test('with Cover', async () => {
    await measurePerformance(
      <Card testID={TEST_ID}>
        <Card.Cover
          source={{ uri: require('../../../assets/back-chevron.png') }}
        />
      </Card>
    );
  });

  test('with Actions', async () => {
    await measurePerformance(
      <Card testID={TEST_ID}>
        <Card.Actions>
          <Button title="Cancel" />
          <Button title="OK" />
        </Card.Actions>
      </Card>
    );
  });

  test('with All Sections', async () => {
    await measurePerformance(
      <Card>
        <Card.Title title="Title" subtitle="Subtitle" />
        <Card.Content>
          <Text>Card title</Text>
          <Text>Card content</Text>
        </Card.Content>
        <Card.Cover
          source={{ uri: require('../../../assets/back-chevron.png') }}
        />
        <Card.Actions>
          <Button title="Cancel" />
          <Button title="OK" />
        </Card.Actions>
      </Card>
    );
  });

  test('with All Sections and Theme', async () => {
    await measurePerformance(
      <Card theme={theme}>
        <Card.Title title="Title" subtitle="Subtitle" />
        <Card.Content>
          <Text>Card title</Text>
          <Text>Card content</Text>
        </Card.Content>
        <Card.Cover
          source={{ uri: require('../../../assets/back-chevron.png') }}
        />
        <Card.Actions>
          <Button title="Cancel" />
          <Button title="OK" />
        </Card.Actions>
      </Card>
    );
  });
});
