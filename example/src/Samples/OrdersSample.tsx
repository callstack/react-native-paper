import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Checkbox,
  DataTable,
  Menu,
  Text,
} from 'react-native-paper';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const OrdersSampleConfig: SampleConfig = {
  title: 'Orders',
  icon: 'table-large',
  components: ['Banner', 'Button', 'Checkbox', 'DataTable', 'Menu', 'Text'],
};

const ORDERS = [
  { id: 'A-1041', customer: 'Ada Lovelace', total: 128 },
  { id: 'A-1042', customer: 'Grace Hopper', total: 64 },
  { id: 'A-1043', customer: 'Alan Turing', total: 512 },
  { id: 'A-1044', customer: 'Barbara Liskov', total: 96 },
  { id: 'A-1045', customer: 'Radia Perlman', total: 240 },
  { id: 'A-1046', customer: 'Mary Jackson', total: 32 },
];

const ITEMS_PER_PAGE = 3;

type SortKey = 'id' | 'customer' | 'total';

const SORT_LABELS: Record<SortKey, string> = {
  id: 'Order number',
  customer: 'Customer',
  total: 'Total',
};

const OrdersSample = () => {
  const [bannerVisible, setBannerVisible] = React.useState(true);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortKey>('id');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);

  const sorted = ORDERS.slice().sort((a, b) =>
    sortBy === 'total'
      ? a.total - b.total
      : String(a[sortBy]).localeCompare(String(b[sortBy]))
  );

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min(from + ITEMS_PER_PAGE, sorted.length);

  const toggleSelected = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  const selectSort = (key: SortKey) => {
    setSortBy(key);
    setMenuVisible(false);
    setPage(0);
  };

  return (
    <ScreenWrapper>
      <Banner
        visible={bannerVisible}
        icon="information-outline"
        actions={[{ label: 'Got it', onPress: () => setBannerVisible(false) }]}
      >
        Two orders are waiting for a payment confirmation.
      </Banner>

      <View style={styles.toolbar}>
        <Text variant="titleMedium">{selected.length} selected</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              icon="sort"
              onPress={() => setMenuVisible(true)}
            >
              {SORT_LABELS[sortBy]}
            </Button>
          }
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <Menu.Item
              key={key}
              title={SORT_LABELS[key]}
              onPress={() => selectSort(key)}
            />
          ))}
        </Menu>
      </View>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={styles.selectColumn}> </DataTable.Title>
          <DataTable.Title>Order</DataTable.Title>
          <DataTable.Title style={styles.customerColumn}>
            Customer
          </DataTable.Title>
          <DataTable.Title numeric>Total</DataTable.Title>
        </DataTable.Header>

        {sorted.slice(from, to).map((order) => (
          <DataTable.Row key={order.id}>
            <DataTable.Cell style={styles.selectColumn}>
              <Checkbox
                status={selected.includes(order.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleSelected(order.id)}
              />
            </DataTable.Cell>
            <DataTable.Cell>{order.id}</DataTable.Cell>
            <DataTable.Cell style={styles.customerColumn}>
              {order.customer}
            </DataTable.Cell>
            <DataTable.Cell numeric>{`$${order.total}`}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(sorted.length / ITEMS_PER_PAGE)}
          onPageChange={setPage}
          label={`${from + 1}-${to} of ${sorted.length}`}
        />
      </DataTable>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  selectColumn: {
    flex: 0.5,
  },
  customerColumn: {
    flex: 2,
  },
});

export default OrdersSample;
