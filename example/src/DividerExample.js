/* @flow */

import React from 'react';
import {
  ListView,
  StyleSheet,
} from 'react-native';
import {
  Divider,
  Subheading,
  Colors,
} from 'react-native-paper';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const dataSource = ds.cloneWithRows([ 'Apple', 'Banana', 'Coconut', 'Lemon', 'Mango', 'Peach' ]);

const DividerExample = () => {
  return (
    <ListView
      style={styles.container}
      dataSource={dataSource}
      renderRow={(rowData, sectionId, rowId) => (
        <Subheading
          key={rowId}
          style={styles.item}
        >
          {rowData}
        </Subheading>
      )}
      renderSeparator={(sectionId, rowId) => <Divider key={rowId}/>}
    />
  );
};

DividerExample.title = 'Divider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default DividerExample;
