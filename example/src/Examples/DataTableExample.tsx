import { DataTable, Card } from 'react-native-paper';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import ScreenWrapper from '../ScreenWrapper';

type ItemsState = Array<{
  key: number;
  name: string;
  calories: number;
  fat: number;
}>;

const DataTableExample = () => {
  const [sortAscending, setSortAscending] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(0);
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
      (sortAscending ? item1.name < item2.name : item2.name < item1.name)
        ? 1
        : -1
    );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <Card>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title
              sortDirection={sortAscending ? 'ascending' : 'descending'}
              onPress={() => setSortAscending(!sortAscending)}
              style={styles.first}
            >
              Dessert
            </DataTable.Title>
            <DataTable.Title numeric>Calories</DataTable.Title>
            <DataTable.Title numeric>Fat (g)</DataTable.Title>
          </DataTable.Header>

          {sortedItems.slice(from, to).map((item) => (
            <DataTable.Row key={item.key}>
              <DataTable.Cell style={styles.first}>{item.name}</DataTable.Cell>
              <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
              <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
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
  first: {
    flex: 2,
  },
});

export default DataTableExample;
