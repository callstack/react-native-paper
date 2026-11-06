import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Card, Checkbox, DataTable } from 'react-native-paper';
import type { DataTableColumn } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type ItemsState = Array<{
  key: number;
  name: string;
  calories: number;
  fat: number;
}>;

// Declared once, outside the component: every title and cell reads its width
// and alignment from here, and the reference has to stay stable.
const columns: readonly DataTableColumn[] = [
  { key: 'selected', width: 48 },
  { key: 'name', flex: 2 },
  { key: 'calories', numeric: true },
  { key: 'fat', numeric: true },
];

const DataTableExample = () => {
  const [sortAscending, setSortAscending] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<ReadonlySet<number>>(
    () => new Set()
  );
  const [items] = React.useState<ItemsState>([
    {
      key: 1,
      name: 'Cupcake',
      calories: 356,
      fat: 16,
    },
    {
      key: 2,
      name: 'Eclair',
      calories: 262,
      fat: 16,
    },
    {
      key: 3,
      name: 'Frozen yogurt',
      calories: 159,
      fat: 6,
    },
    {
      key: 4,
      name: 'Gingerbread',
      calories: 305,
      fat: 3.7,
    },
    {
      key: 5,
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9,
    },
    {
      key: 6,
      name: 'Jelly Bean',
      calories: 375,
      fat: 0,
    },
  ]);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 200]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const sortedItems = items
    .slice()
    .sort((item1, item2) =>
      sortAscending
        ? item1.name.localeCompare(item2.name)
        : item2.name.localeCompare(item1.name)
    );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const toggle = (key: number) =>
    setSelected((previous) => {
      const next = new Set(previous);

      if (!next.delete(key)) {
        next.add(key);
      }

      return next;
    });

  const allSelected = selected.size === items.length;

  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set(items.map((item) => item.key))
    );

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <Card>
        <DataTable
          aria-label="Nutrition"
          columns={columns}
          rowCount={sortedItems.length}
        >
          <DataTable.Header>
            <DataTable.Title column="selected" aria-label="Selected">
              <Checkbox
                status={
                  allSelected
                    ? 'checked'
                    : selected.size > 0
                      ? 'indeterminate'
                      : 'unchecked'
                }
                onPress={toggleAll}
                aria-label="Select all"
              />
            </DataTable.Title>
            <DataTable.Title
              column="name"
              sortDirection={sortAscending ? 'ascending' : 'descending'}
              onPress={() => setSortAscending(!sortAscending)}
            >
              Dessert
            </DataTable.Title>
            <DataTable.Title column="calories" numberOfLines={2}>
              Calories per piece
            </DataTable.Title>
            <DataTable.Title column="fat">Fat (g)</DataTable.Title>
          </DataTable.Header>

          {sortedItems.slice(from, to).map((item, i) => (
            // The row is a pointer shortcut. On the web it is no Tab stop, so
            // the checkbox is how keyboard and screen reader users select it.
            <DataTable.Row
              key={item.key}
              index={from + i}
              onPress={() => toggle(item.key)}
            >
              <DataTable.Cell column="selected">
                <Checkbox
                  status={selected.has(item.key) ? 'checked' : 'unchecked'}
                  onPress={() => toggle(item.key)}
                  aria-label={`Select ${item.name}`}
                />
              </DataTable.Cell>
              <DataTable.Cell column="name">{item.name}</DataTable.Cell>
              <DataTable.Cell column="calories">{item.calories}</DataTable.Cell>
              <DataTable.Cell column="fat">{item.fat}</DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(sortedItems.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${sortedItems.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
        </DataTable>
      </Card>
    </ScreenWrapper>
  );
};

DataTableExample.title = 'Data Table';

const styles = StyleSheet.create({
  content: {
    padding: 8,
  },
});

export default DataTableExample;
