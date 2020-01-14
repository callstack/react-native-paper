import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { DataTable, Card, withTheme, Theme } from 'react-native-paper';

type Props = {
  theme: Theme;
};

type State = {
  page: number;
  sortAscending: boolean;
  items: Array<{ key: number; name: string; calories: number; fat: number }>;
};

class DataTableColumnExample extends React.Component<Props, State> {
  static title = 'DataTable.Column';

  state = {
    page: 0,
    sortAscending: true,
    items: [
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
    ],
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    const { sortAscending } = this.state;

    const items = this.state.items
      .slice()
      .sort((item1, item2) =>
        (sortAscending
        ? item1.name < item2.name
        : item2.name < item1.name)
          ? 1
          : -1
      );
    const itemsPerPage = 2;
    const from = this.state.page * itemsPerPage;
    const to = (this.state.page + 1) * itemsPerPage;

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.content}
      >
        <Card>
          <DataTable>
            <DataTable.Wrapper>
              <DataTable.Column scrollable={false}>
                <DataTable.Header>
                  <DataTable.Title>Dessert</DataTable.Title>
                </DataTable.Header>
                {items.slice(from, to).map(item => (
                  <DataTable.Row key={item.key}>
                    <DataTable.Cell style={styles.first}>
                      {item.name}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable.Column>
              <DataTable.Column scrollable={true}>
                <DataTable.Header>
                  <DataTable.Title numeric>Calories</DataTable.Title>
                  <DataTable.Title numeric>Fat</DataTable.Title>
                </DataTable.Header>
                {items.slice(from, to).map(item => (
                  <DataTable.Row key={item.key}>
                    <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable.Column>
            </DataTable.Wrapper>

            <DataTable.Pagination
              page={this.state.page}
              numberOfPages={Math.floor(items.length / itemsPerPage)}
              onPageChange={page => {
                this.setState({ page });
              }}
              label={`${from + 1}-${to} of ${items.length}`}
            />
          </DataTable>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 8,
  },

  first: {
    flex: 2,
  },
});

export default withTheme(DataTableColumnExample);
