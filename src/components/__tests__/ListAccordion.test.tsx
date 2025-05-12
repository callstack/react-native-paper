import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import { red500 } from '../../styles/themes/v2/colors';
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

it('renders list accordion with children', () => {
  const tree = render(
    <ListAccordion
      left={(props) => <ListIcon {...props} icon="folder" />}
      title="Expandable list item"
    >
      <ListItem title="First Item" />
    </ListAccordion>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders multiline list accordion', () => {
  const tree = render(
    <ListAccordion
      title="Expandable list item"
      description="Describes the expandable list item"
    >
      <ListItem title="List item 1" />
    </ListAccordion>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list accordion with left items', () => {
  const tree = render(
    <ListAccordion
      left={(props) => <ListIcon {...props} icon="star" />}
      title="Accordion item 1"
    >
      <ListItem
        left={(props) => <ListIcon {...props} icon="thumb-up" />}
        title="List item 1"
      />
    </ListAccordion>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders expanded accordion', () => {
  const tree = render(
    <ListAccordion title="Accordion item 1" expanded>
      <ListItem title="List item 1" />
    </ListAccordion>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list accordion with custom title and description styles', () => {
  const tree = render(
    <ListAccordion
      title="Accordion item 1"
      description="Describes the expandable list item"
      titleStyle={styles.coloring}
      descriptionStyle={styles.coloring}
    >
      <ListItem title="List item 1" />
    </ListAccordion>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('ListAccordion', () => {
  it('should not throw an error when id={0}', () => {
    const ListAccordionTest = () => (
      <ListAccordionGroup>
        <ListAccordion title="Testing list" id={0}>
          <View></View>
        </ListAccordion>
      </ListAccordionGroup>
    );

    expect(() => render(<ListAccordionTest />)).not.toThrow(
      'List.Accordion is used inside a List.AccordionGroup without specifying an id prop.'
    );
  });

  it('should throw an error when id={""}', () => {
    const ListAccordionTest = () => (
      <ListAccordionGroup>
        <ListAccordion title="Testing list" id={''}>
          <View></View>
        </ListAccordion>
      </ListAccordionGroup>
    );

    expect(() => render(<ListAccordionTest />)).toThrow(
      'List.Accordion is used inside a List.AccordionGroup without specifying an id prop.'
    );
  });
});

describe('getAccordionColors - title color', () => {
  it('should return theme color, for theme version 3', () => {
    expect(
      getAccordionColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      titleColor: getTheme().colors.onSurface,
    });
  });
});

describe('getAccordionColors - description color', () => {
  it('should return theme color, for theme version 3', () => {
    expect(
      getAccordionColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      descriptionColor: getTheme().colors.onSurfaceVariant,
    });
  });
});

describe('getAccordionColors - title text color', () => {
  it('should return theme color, for theme version 3', () => {
    expect(
      getAccordionColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      titleTextColor: getTheme().colors.onSurface,
    });
  });

  it('should return primary color if it is expanded', () => {
    expect(
      getAccordionColors({
        theme: getTheme(),
        isExpanded: true,
      })
    ).toMatchObject({
      titleTextColor: getTheme().colors?.primary,
    });
  });
});

describe('getAccordionColors - ripple color', () => {
  it('should return theme color, for theme version 3', () => {
    expect(
      getAccordionColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.onSurface)
        .alpha(0.12)
        .rgb()
        .string(),
    });
  });

  it('should return primary color if it is expanded', () => {
    expect(
      getAccordionColors({
        theme: getTheme(),
        isExpanded: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.primary).alpha(0.12).rgb().string(),
    });
  });
});
