import { StyleSheet, View } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
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
});
