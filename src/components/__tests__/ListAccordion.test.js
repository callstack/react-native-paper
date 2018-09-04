/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import ListAccordion from '../List/ListAccordion';
import ListItem from '../List/ListItem';
import ListIcon from '../List/ListIcon';

it('renders list accordion with children', () => {
  const tree = renderer
    .create(
      <ListAccordion
        left={props => <ListIcon {...props} icon="folder" />}
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
        left={props => <ListIcon {...props} icon="star" />}
        title="Accordion item 1"
      >
        <ListItem
          left={props => <ListIcon {...props} icon="thumb-up" />}
          title="List item 1"
        />
      </ListAccordion>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
