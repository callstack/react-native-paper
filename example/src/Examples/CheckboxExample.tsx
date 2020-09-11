import {
  Paragraph,
  Checkbox,
  Colors,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';

const CheckboxExample = () => {
  const [checkedNormal, setCheckedNormal] = React.useState<boolean>(true);
  const [checkedCustom, setCheckedCustom] = React.useState<boolean>(true);
  const [indeterminate, setIndeterminate] = React.useState<boolean>(true);
  const {
    colors: { background },
  } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <TouchableRipple onPress={() => setCheckedNormal(!checkedNormal)}>
        <View style={styles.row}>
          <Paragraph>Normal</Paragraph>
          <View pointerEvents="none">
            <Checkbox status={checkedNormal ? 'checked' : 'unchecked'} />
          </View>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={() => setCheckedCustom(!checkedCustom)}>
        <View style={styles.row}>
          <Paragraph>Custom</Paragraph>
          <View pointerEvents="none">
            <Checkbox
              color={Colors.blue500}
              status={checkedCustom ? 'checked' : 'unchecked'}
            />
          </View>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={() => setIndeterminate(!indeterminate)}>
        <View style={styles.row}>
          <Paragraph>Indeterminate</Paragraph>
          <View pointerEvents="none">
            <Checkbox status={indeterminate ? 'indeterminate' : 'unchecked'} />
          </View>
        </View>
      </TouchableRipple>

      <View style={styles.row}>
        <Paragraph>Checked (Disabled)</Paragraph>
        <Checkbox status="checked" disabled />
      </View>
      <View style={styles.row}>
        <Paragraph>Unchecked (Disabled)</Paragraph>
        <Checkbox status="unchecked" disabled />
      </View>
      <View style={styles.row}>
        <Paragraph>Indeterminate (Disabled)</Paragraph>
        <Checkbox status="indeterminate" disabled />
      </View>
    </View>
  );
};

CheckboxExample.title = 'Checkbox';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
