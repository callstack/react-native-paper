import * as React from 'react';

import { render } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

import Checkbox from '../Checkbox';
import DataTable from '../DataTable/DataTable';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

describe('DataTable.Header', () => {
  it('renders data table header', () => {
    const tree = render(
      <DataTable.Header>
        <DataTable.Title>Dessert</DataTable.Title>
        <DataTable.Title>Calories</DataTable.Title>
      </DataTable.Header>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('DataTable.Title', () => {
  it('renders data table title with sort icon', () => {
    const tree = render(
      <DataTable.Title sortDirection="descending">Dessert</DataTable.Title>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders right aligned data table title', () => {
    const tree = render(
      <DataTable.Title numeric>Calories</DataTable.Title>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders data table title with press handler', () => {
    const tree = render(
      <DataTable.Title sortDirection="descending" onPress={() => {}}>
        Dessert
      </DataTable.Title>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('DataTable.Cell', () => {
  it('renders data table cell', () => {
    const tree = render(<DataTable.Cell>Cupcake</DataTable.Cell>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders right aligned data table cell', () => {
    const tree = render(<DataTable.Cell numeric>356</DataTable.Cell>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders data table cell with text container', () => {
    const { getByText, getByTestId } = render(
      <DataTable.Cell testID="table-cell">Table cell</DataTable.Cell>
    );

    expect(getByText('Table cell')).toBeOnTheScreen();
    expect(getByTestId('table-cell-text-container')).toBeOnTheScreen();
  });

  it('renders data table cell children without text container', () => {
    const { queryByTestId } = render(
      <DataTable.Cell testID="table-cell">
        <Checkbox status="checked" testID="table-cell-checkbox" />
      </DataTable.Cell>
    );

    expect(queryByTestId('table-cell-text-container')).not.toBeOnTheScreen();
  });
});

describe('DataTable.Pagination', () => {
  it('renders data table pagination', () => {
    const tree = render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders data table pagination with label', () => {
    const tree = render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders data table pagination with fast-forward buttons', () => {
    const { getByLabelText, toJSON } = render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
        showFastPaginationControls
      />
    );

    expect(getByLabelText('page-first')).toBeTruthy();
    expect(getByLabelText('page-last')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders data table pagination without options select', () => {
    const { queryByLabelText } = render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
        showFastPaginationControls
      />
    );

    expect(queryByLabelText('Options Select')).toBeFalsy();
  });

  it('renders data table pagination with options select', () => {
    const { getByLabelText, toJSON } = render(
      <mockSafeAreaContext.SafeAreaProvider>
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
      </mockSafeAreaContext.SafeAreaProvider>
    );

    expect(getByLabelText('Options Select')).toBeTruthy();
    expect(getByLabelText('selectPageDropdownLabel')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });
});
