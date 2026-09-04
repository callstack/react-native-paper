import { StyleSheet, View } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { fireEvent, render, screen } from '../../test-utils';
import { red500 } from '../../theme/colors';
import ListAccordion from '../List/ListAccordion';
import ListAccordionGroup from '../List/ListAccordionGroup';
import ListIcon from '../List/ListIcon';
import ListItem from '../List/ListItem';

const styles = StyleSheet.create({
  coloring: {
    color: red500,
  },
});

it('renders list accordion with children', async () => {
  const tree = (
    await render(
      <ListAccordion
        left={(props) => <ListIcon {...props} icon="folder" />}
        title="Expandable list item"
      >
        <ListItem title="First Item" />
      </ListAccordion>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders multiline list accordion', async () => {
  const tree = (
    await render(
      <ListAccordion
        title="Expandable list item"
        description="Describes the expandable list item"
      >
        <ListItem title="List item 1" />
      </ListAccordion>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list accordion with left items', async () => {
  const tree = (
    await render(
      <ListAccordion
        left={(props) => <ListIcon {...props} icon="star" />}
        title="Accordion item 1"
      >
        <ListItem
          left={(props) => <ListIcon {...props} icon="thumb-up" />}
          title="List item 1"
        />
      </ListAccordion>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders expanded accordion', async () => {
  const tree = (
    await render(
      <ListAccordion title="Accordion item 1" expanded>
        <ListItem title="List item 1" />
      </ListAccordion>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list accordion with custom title and description styles', async () => {
  const tree = (
    await render(
      <ListAccordion
        title="Accordion item 1"
        description="Describes the expandable list item"
        titleStyle={styles.coloring}
        descriptionStyle={styles.coloring}
      >
        <ListItem title="List item 1" />
      </ListAccordion>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('ListAccordion', () => {
  it('should not throw an error when id={0}', async () => {
    const ListAccordionTest = () => (
      <ListAccordionGroup>
        <ListAccordion title="Testing list" id={0}>
          <View></View>
        </ListAccordion>
      </ListAccordionGroup>
    );

    await expect(render(<ListAccordionTest />)).resolves.toBeDefined();
  });

  it('should throw an error when id={""}', async () => {
    const ListAccordionTest = () => (
      <ListAccordionGroup>
        <ListAccordion title="Testing list" id={''}>
          <View></View>
        </ListAccordion>
      </ListAccordionGroup>
    );

    await expect(render(<ListAccordionTest />)).rejects.toThrow(
      'List.Accordion is used inside a List.AccordionGroup without specifying an id prop.'
    );
  });

  it('keeps the title on onSurface when collapsed', async () => {
    await render(
      <ListAccordion title="Accordion item 1">
        <ListItem title="List item 1" />
      </ListAccordion>
    );

    expect(screen.getByText('Accordion item 1')).toHaveStyle({
      color: getTheme().colors.onSurface,
    });
  });

  it('keeps the title on onSurface when expanded', async () => {
    await render(
      <ListAccordion title="Accordion item 1" expanded>
        <ListItem title="List item 1" />
      </ListAccordion>
    );

    expect(screen.getByText('Accordion item 1')).toHaveStyle({
      color: getTheme().colors.onSurface,
    });
  });

  it('hits the container heights without measuring the description', async () => {
    await render(
      <ListAccordion title="Accordion item 1" testID="list-accordion">
        <ListItem title="List item 1" />
      </ListAccordion>
    );

    expect(screen.getByTestId('list-accordion')).toHaveStyle({
      minHeight: 56,
      paddingVertical: 8,
    });
  });

  it('keeps the two line container height once a description is present', async () => {
    await render(
      <ListAccordion
        title="Accordion item 1"
        description="Describes the expandable list item"
        testID="list-accordion"
      >
        <ListItem title="List item 1" />
      </ListAccordion>
    );

    expect(screen.getByTestId('list-accordion')).toHaveStyle({
      minHeight: 72,
      paddingVertical: 8,
    });

    await fireEvent(
      screen.getByText('Describes the expandable list item'),
      'textLayout',
      { nativeEvent: { lines: [{}, {}] } }
    );

    expect(screen.getByTestId('list-accordion')).toHaveStyle({
      minHeight: 72,
      paddingVertical: 12,
    });
  });

  it('uses the expand token for the chevron', async () => {
    await render(
      <ListAccordion title="Accordion item 1">
        <ListItem title="List item 1" />
      </ListAccordion>
    );

    expect(
      screen.getByText('chevron-down', { includeHiddenElements: true })
    ).toHaveStyle({
      color: getTheme().colors.onSurface,
    });
  });

  it('applies the theme override to title and description typography', async () => {
    await render(
      <ListAccordion
        title="Accordion item 1"
        description="Describes the expandable list item"
        theme={{
          fonts: { bodyLarge: { fontSize: 99 }, bodyMedium: { fontSize: 77 } },
        }}
      >
        <ListItem title="List item 1" />
      </ListAccordion>
    );

    expect(screen.getByText('Accordion item 1')).toHaveStyle({ fontSize: 99 });
    expect(screen.getByText('Describes the expandable list item')).toHaveStyle({
      fontSize: 77,
    });
  });
});
