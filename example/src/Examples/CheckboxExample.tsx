import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Checkbox, Colors, Text, TouchableRipple } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const CheckboxExample = () => {
  const [checkedNormal, setCheckedNormal] = React.useState<boolean>(true);
  const [checkedCustom, setCheckedCustom] = React.useState<boolean>(true);
  const [indeterminate, setIndeterminate] = React.useState<boolean>(true);

  return (
    <ScreenWrapper style={styles.container}>
      <TouchableRipple onPress={() => setCheckedNormal(!checkedNormal)}>
        <View style={styles.row}>
          <Text>Normal</Text>
          <View pointerEvents="none">
            <Checkbox status={checkedNormal ? 'checked' : 'unchecked'} />
          </View>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={() => setCheckedCustom(!checkedCustom)}>
        <View style={styles.row}>
          <Text>Custom</Text>
          <View pointerEvents="none">
            <Checkbox
              color={Colors.error70}
              status={checkedCustom ? 'checked' : 'unchecked'}
            />
          </View>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={() => setIndeterminate(!indeterminate)}>
        <View style={styles.row}>
          <Text>Indeterminate</Text>
          <View pointerEvents="none">
            <Checkbox status={indeterminate ? 'indeterminate' : 'unchecked'} />
          </View>
        </View>
      </TouchableRipple>

      <View style={styles.row}>
        <Text>Checked (Disabled)</Text>
        <Checkbox status="checked" disabled />
      </View>
      <View style={styles.row}>
        <Text>Unchecked (Disabled)</Text>
        <Checkbox status="unchecked" disabled />
      </View>
      <View style={styles.row}>
        <Text>Indeterminate (Disabled)</Text>
        <Checkbox status="indeterminate" disabled />
      </View>
    </ScreenWrapper>
  );
};

CheckboxExample.title = 'Checkbox';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default CheckboxExample;
