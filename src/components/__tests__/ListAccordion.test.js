import * as React from 'react';
import { StyleSheet } from 'react-native';
import renderer from 'react-test-renderer';
import ListAccordion from '../List/ListAccordion.tsx';
import ListItem from '../List/ListItem.tsx';
import ListIcon from '../List/ListIcon.tsx';
import { red500 } from '../../styles/colors';

const styles = StyleSheet.create({
  coloring: {
    color: red500,
  },
});

it('renders list accordion with children', () => {
  const tree = renderer
    .create(
      <ListAccordion
        left={(props) => <ListIcon {...props} icon="folder" />}
        title="Expandable list item"
      >
        <ListItem title="First Item" />
      </ListAccordion>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders multiline list accordion', () => {
  const tree = renderer
    .create(
      <ListAccordion
        title="Expandable list item"
        description="Describes the expandable list item"
      >
        <ListItem title="List item 1" />
      </ListAccordion>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list accordion with left items', () => {
  const tree = renderer
    .create(
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
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders expanded accordion', () => {
  const tree = renderer
    .create(
      <ListAccordion title="Accordion item 1" expanded>
        <ListItem title="List item 1" />
      </ListAccordion>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list accordion with custom title and description styles', () => {
  const tree = renderer
    .create(
      <ListAccordion
        title="Accordion item 1"
        description="Describes the expandable list item"
        titleStyle={styles.coloring}
        descriptionStyle={styles.coloring}
      >
        <ListItem title="List item 1" />
      </ListAccordion>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
