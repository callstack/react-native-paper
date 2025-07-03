import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Checkbox,
  MD2Colors,
  MD3Colors,
  Paragraph,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import { useExampleTheme } from '../hooks/useExampleTheme';
import ScreenWrapper from '../ScreenWrapper';

const CheckboxExample = () => {
  const [checkedNormal, setCheckedNormal] = React.useState<boolean>(true);
  const [checkedCustom, setCheckedCustom] = React.useState<boolean>(true);
  const [indeterminate, setIndeterminate] = React.useState<boolean>(true);

  const { isV3 } = useExampleTheme();
  const TextComponent = isV3 ? Text : Paragraph;

  return (
    <ScreenWrapper style={styles.container}>
      <TouchableRipple onPress={() => setCheckedNormal(!checkedNormal)}>
        <View style={styles.row}>
          <TextComponent>Normal</TextComponent>
          <View pointerEvents="none">
            <Checkbox status={checkedNormal ? 'checked' : 'unchecked'} />
          </View>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={() => setCheckedCustom(!checkedCustom)}>
        <View style={styles.row}>
          <TextComponent>Custom</TextComponent>
          <View pointerEvents="none">
            <Checkbox
              color={isV3 ? MD3Colors.error70 : MD2Colors.blue500}
              status={checkedCustom ? 'checked' : 'unchecked'}
            />
          </View>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={() => setIndeterminate(!indeterminate)}>
        <View style={styles.row}>
          <TextComponent>Indeterminate</TextComponent>
          <View pointerEvents="none">
            <Checkbox status={indeterminate ? 'indeterminate' : 'unchecked'} />
          </View>
        </View>
      </TouchableRipple>

      <View style={styles.row}>
        <TextComponent>Checked (Disabled)</TextComponent>
        <Checkbox status="checked" disabled />
      </View>
      <View style={styles.row}>
        <TextComponent>Unchecked (Disabled)</TextComponent>
        <Checkbox status="unchecked" disabled />
      </View>
      <View style={styles.row}>
        <TextComponent>Indeterminate (Disabled)</TextComponent>
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
