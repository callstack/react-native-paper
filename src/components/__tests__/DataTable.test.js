import * as React from 'react';
import renderer from 'react-test-renderer';
import { render } from 'react-native-testing-library';
import DataTable from '../DataTable/DataTable.tsx';

it('renders data table header', () => {
  const tree = renderer
    .create(
      <DataTable.Header>
        <DataTable.Title>Dessert</DataTable.Title>
        <DataTable.Title>Calories</DataTable.Title>
      </DataTable.Header>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders data table title with sort icon', () => {
  const tree = renderer
    .create(
      <DataTable.Title sortDirection="descending">Dessert</DataTable.Title>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders right aligned data table title', () => {
  const tree = renderer
    .create(<DataTable.Title numeric>Calories</DataTable.Title>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders data table title with press handler', () => {
  const tree = renderer
    .create(
      <DataTable.Title sortDirection="descending" onPress={() => {}}>
        Dessert
      </DataTable.Title>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders data table cell', () => {
  const tree = renderer
    .create(<DataTable.Cell>Cupcake</DataTable.Cell>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders right aligned data table cell', () => {
  const tree = renderer
    .create(<DataTable.Cell numeric>356</DataTable.Cell>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders data table pagination', () => {
  const tree = renderer
    .create(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders data table pagination with label', () => {
  const tree = renderer
    .create(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders data table pagination with fast-forward buttons', () => {
  const { getByA11yLabel, toJSON } = render(
    <DataTable.Pagination
      page={3}
      numberOfPages={15}
      onPageChange={() => {}}
      label="11-20 of 150"
      showFastPaginationControls
    />
  );

  expect(() => getByA11yLabel('page-first')).not.toThrow();
  expect(() => getByA11yLabel('page-last')).not.toThrow();
  expect(toJSON()).toMatchSnapshot();
});

it('renders data table pagination without options select', () => {
  const { getByA11yLabel } = render(
    <DataTable.Pagination
      page={3}
      numberOfPages={15}
      onPageChange={() => {}}
      label="11-20 of 150"
      showFastPaginationControls
    />
  );

  expect(() => getByA11yLabel('Options Select')).toThrow();
});

it('renders data table pagination with options select', () => {
  const { getByA11yLabel, toJSON } = render(
    <DataTable.Pagination
      page={3}
      numberOfPages={15}
      onPageChange={() => {}}
      label="11-20 of 150"
      showFastPaginationControls
      numberOfItemsPerPageList={[2, 4, 6]}
      numberOfItemsPerPage={2}
      onItemsPerPageChange={() => {}}
      selectPageDropdownLabel={'Rows per page'}
    />
  );

  expect(() => getByA11yLabel('Options Select')).not.toThrow();
  expect(() => getByA11yLabel('selectPageDropdownLabel')).not.toThrow();

  expect(toJSON()).toMatchSnapshot();
});
