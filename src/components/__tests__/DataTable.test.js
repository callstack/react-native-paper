import * as React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';
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
      showFastPagination
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
      showFastPagination
    />
  );

  expect(() => getByA11yLabel('Options Select')).toThrow();
});

it('renders data table pagination with options select', () => {
  jest.mock(
    '../../utils/useLayout',
    () =>
      function useLayout() {
        return [{ width: 600 }, jest.fn];
      }
  );

  const { getByA11yLabel, toJSON } = render(
    <DataTable.Pagination
      page={3}
      numberOfPages={15}
      onPageChange={() => {}}
      label="11-20 of 150"
      showFastPagination
      optionsPerPage={[2, 4, 6]}
      itemsPerPage={2}
      setItemsPerPage={() => {}}
      optionsLabel={'Rows per page'}
    />
  );

  fireEvent(getByA11yLabel('pagination-container'), 'layout', {
    nativeEvent: {
      layout: {
        width: 500,
      },
    },
  });

  expect(() => getByA11yLabel('Options Select')).not.toThrow();
  expect(() => getByA11yLabel('optionsLabel')).not.toThrow();

  expect(toJSON()).toMatchSnapshot();
});
