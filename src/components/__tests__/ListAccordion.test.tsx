import { StyleSheet, View } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { render, screen, within } from '../../test-utils';
import { red500 } from '../../theme/colors';
import { LightTheme } from '../../theme/schemes';
import ListAccordion from '../List/ListAccordion';
import ListAccordionGroup from '../List/ListAccordionGroup';
import ListIcon from '../List/ListIcon';
import ListItem from '../List/ListItem';
import { getAccordionColors } from '../List/utils';

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

it('indents expanded accordion children without their own left/right when the accordion has a left icon', async () => {
  await render(
    <ListAccordion
      left={(props) => <ListIcon {...props} icon="folder" />}
      title="Accordion with indented children"
      expanded
    >
      <ListItem title="Child item" testID="accordion-child" />
    </ListAccordion>
  );

  expect(screen.getByTestId('accordion-child')).toHaveStyle({
    paddingLeft: 40,
  });
});

it('does not indent expanded accordion children when the accordion has no left icon', async () => {
  await render(
    <ListAccordion title="Accordion without left icon" expanded>
      <ListItem title="Child item" testID="accordion-child" />
    </ListAccordion>
  );

  expect(screen.getByTestId('accordion-child')).not.toHaveStyle({
    paddingLeft: 40,
  });
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
});

describe('ListAccordionGroup', () => {
  it('expands the accordion with id={0} and keeps id={1} collapsed when expandedId={0}', async () => {
    await render(
      <ListAccordionGroup expandedId={0}>
        <ListAccordion title="Accordion 0" id={0}>
          <ListItem title="Item 0" />
        </ListAccordion>
        <ListAccordion title="Accordion 1" id={1}>
          <ListItem title="Item 1" />
        </ListAccordion>
      </ListAccordionGroup>
    );

    expect(
      within(screen.getByRole('button', { expanded: true })).getByText(
        'Accordion 0'
      )
    ).toBeOnTheScreen();
    expect(screen.getByText('Item 0')).toBeOnTheScreen();

    expect(
      within(screen.getByRole('button', { expanded: false })).getByText(
        'Accordion 1'
      )
    ).toBeOnTheScreen();
    expect(screen.queryByText('Item 1')).not.toBeOnTheScreen();
  });
});

describe('getAccordionColors - description color', () => {
  it('should return theme color, for theme version 3', () => {
    expect(
      getAccordionColors({
        theme: LightTheme,
      })
    ).toMatchObject({
      descriptionColor: LightTheme.colors.onSurfaceVariant,
    });
  });
});

describe('getAccordionColors - title text color', () => {
  it('should return theme color, for theme version 3', () => {
    expect(
      getAccordionColors({
        theme: LightTheme,
      })
    ).toMatchObject({
      titleTextColor: LightTheme.colors.onSurface,
    });
  });

  it('should return primary color if it is expanded', () => {
    expect(
      getAccordionColors({
        theme: LightTheme,
        isExpanded: true,
      })
    ).toMatchObject({
      titleTextColor: LightTheme.colors?.primary,
    });
  });
});
