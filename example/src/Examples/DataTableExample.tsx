import * as React from 'react';
import { StyleSheet } from 'react-native';
import { DataTable, Card } from 'react-native-paper';
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
  const [visible, setVisible] = React.useState<boolean>(false);
  const [originalItems] = React.useState<ItemsState>([
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
  const [items, setItems] = React.useState<ItemsState>([
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

  const leftIconConfig = [
    {
      id: 1,
      title: 'Sort Ascending',
      onPress: () => {
        setSortAscending(true);
      },
      leadingIcon: 'arrow-up',
      disabled: sortAscending ? true : false,
    },
    {
      id: 1,
      title: 'Sort Descending',
      onPress: () => {
        setSortAscending(false);
      },
      leadingIcon: 'arrow-down',
      disabled: !sortAscending ? true : false,
    },
  ];
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 200]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [modalVisible, setModalVisible] = React.useState(false);
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

  const likeMatch = (array, key, searchStr) => {
    if (key == 'calories') {
      return array.filter((item) => {
        console.log(searchStr);
        return item.calories == searchStr;
      });
    } else if (key == 'fat') {
      return array.filter((item) => {
        console.log(searchStr);
        return item.fat == searchStr;
      });
    }
    return array.filter((item) =>
      item[key].toLowerCase().includes(searchStr.toLowerCase())
    );
  };
  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <Card>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title
              sortDirection={sortAscending ? 'ascending' : 'descending'}
              onPress={() => {
                setSortAscending(!sortAscending);
              }}
              leftIconConfig={leftIconConfig}
              style={styles.first}
              textStyle={styles.titleStyle}
              onLeftIconPress={() => {}}
            >
              Dessert
            </DataTable.Title>

            <DataTable.Title
              numberOfLines={2}
              onPress={() => {}}
              onLeftIconPress={() => {}}
              style={styles.first}
              textStyle={styles.titleStyle}
              onPressAsc={() => {
                setSortAscending(true);
              }}
              onPressDes={() => {
                setSortAscending(false);
              }}
            >
              Calories per piece
            </DataTable.Title>
            <DataTable.Title
              onPress={() => {}}
              style={styles.first}
              textStyle={styles.titleStyle}
              onLeftIconPress={() => {}}
            >
              Fat (g)
            </DataTable.Title>
          </DataTable.Header>

          <DataTable.Header>
            <DataTable.CellSearch
              style={styles.searchStyle}
              onChangeText={(text) => {
                if (text.length) {
                  setItems(likeMatch(originalItems, 'name', text));
                } else {
                  setItems(originalItems);
                }
              }}
              placeholder={'Search Dessert'}
            ></DataTable.CellSearch>
            <DataTable.CellSearch
              style={styles.searchStyle}
              onChangeText={(text) => {
                if (text.length) {
                  setItems(likeMatch(originalItems, 'calories', text));
                } else {
                  setItems(originalItems);
                }
              }}
              placeholder={'Search Calories'}
            ></DataTable.CellSearch>
            <DataTable.CellSearch
              style={styles.searchStyle}
              onChangeText={(text) => {
                if (text.length) {
                  setItems(likeMatch(originalItems, 'fat', text));
                } else {
                  setItems(originalItems);
                }
              }}
              placeholder={'Search Calories'}
            ></DataTable.CellSearch>
          </DataTable.Header>

          {sortedItems.slice(from, to).map((item) => (
            <DataTable.Row key={item.key} style={styles.bodyStyle}>
              <DataTable.Cell style={styles.bodyStyleItem}>
                {item.name}
              </DataTable.Cell>
              <DataTable.Cell style={styles.bodyStyleItem} numeric>
                {item.calories}
              </DataTable.Cell>
              <DataTable.Cell style={styles.bodyStyleItem} numeric>
                {item.fat}
              </DataTable.Cell>
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
    borderColor: 'grey',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 5,
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bodyStyle: {},
  bodyStyleItem: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 5,
  },
  searchStyle: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '30%',
    top: 55,
  },
  centeredView: {
    flex: 1,
    marginTop: 30,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

export default DataTableExample;
