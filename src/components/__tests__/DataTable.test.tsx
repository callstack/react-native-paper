import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import Checkbox from '../Checkbox';
import DataTable from '../DataTable/DataTable';

describe('DataTable.Header', () => {
  it('renders data table header', async () => {
    const tree = (
      await render(
        <DataTable.Header>
          <DataTable.Title>Dessert</DataTable.Title>
          <DataTable.Title>Calories</DataTable.Title>
        </DataTable.Header>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('DataTable.Title', () => {
  it('renders data table title with sort icon', async () => {
    const tree = (
      await render(
        <DataTable.Title sortDirection="descending">Dessert</DataTable.Title>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders right aligned data table title', async () => {
    const tree = (
      await render(<DataTable.Title numeric>Calories</DataTable.Title>)
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders data table title with press handler', async () => {
    const tree = (
      await render(
        <DataTable.Title sortDirection="descending" onPress={() => {}}>
          Dessert
        </DataTable.Title>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('DataTable.Cell', () => {
  it('renders data table cell', async () => {
    const tree = (
      await render(<DataTable.Cell>Cupcake</DataTable.Cell>)
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders right aligned data table cell', async () => {
    const tree = (
      await render(<DataTable.Cell numeric>356</DataTable.Cell>)
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders data table cell with text container', async () => {
    await render(
      <DataTable.Cell testID="table-cell">Table cell</DataTable.Cell>
    );

    expect(screen.getByText('Table cell')).toBeOnTheScreen();
    expect(screen.getByTestId('table-cell-text-container')).toBeOnTheScreen();
  });

  it('renders data table cell children without text container', async () => {
    await render(
      <DataTable.Cell testID="table-cell">
        <Checkbox status="checked" testID="table-cell-checkbox" />
      </DataTable.Cell>
    );

    expect(
      screen.queryByTestId('table-cell-text-container')
    ).not.toBeOnTheScreen();
  });
});

describe('DataTable.Pagination', () => {
  it('renders data table pagination', async () => {
    const tree = (
      await render(
        <DataTable.Pagination
          page={3}
          numberOfPages={15}
          onPageChange={() => {}}
        />
      )
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders data table pagination with label', async () => {
    const tree = (
      await render(
        <DataTable.Pagination
          page={3}
          numberOfPages={15}
          onPageChange={() => {}}
          label="11-20 of 150"
        />
      )
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders data table pagination with fast-forward buttons', async () => {
    const { toJSON } = await render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
        showFastPaginationControls
      />
    );

    expect(screen.getByLabelText('page-first')).toBeOnTheScreen();
    expect(screen.getByLabelText('page-last')).toBeOnTheScreen();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders data table pagination without options select', async () => {
    await render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
        showFastPaginationControls
      />
    );

    expect(screen.queryByLabelText('Options Select')).not.toBeOnTheScreen();
  });

  it('renders data table pagination with options select', async () => {
    const { toJSON } = await render(
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

    expect(screen.getByLabelText('Options Select')).toBeOnTheScreen();
    expect(screen.getByLabelText('selectPageDropdownLabel')).toBeOnTheScreen();

    expect(toJSON()).toMatchSnapshot();
  });
});
