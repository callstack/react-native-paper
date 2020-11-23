import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Colors, useTheme } from 'react-native-paper';

const CheckboxExample = () => {
  const [checkedDefault, setCheckedDefault] = React.useState<boolean>(true);
  const [checkedAndroid, setCheckedAndroid] = React.useState<boolean>(true);
  const [checkedIOS, setCheckedIOS] = React.useState<boolean>(true);
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
      <Checkbox.Item
        label="Default (will look like whatever system this is running on)"
        status={checkedDefault ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDefault(!checkedDefault)}
      />
      <Checkbox.Item
        label="Android"
        mode="android"
        status={checkedAndroid ? 'checked' : 'unchecked'}
        onPress={() => setCheckedAndroid(!checkedAndroid)}
      />
      <Checkbox.Item
        label="iOS"
        mode="ios"
        status={checkedIOS ? 'checked' : 'unchecked'}
        onPress={() => setCheckedIOS(!checkedIOS)}
      />
    </View>
  );
};

CheckboxExample.title = 'Checkbox Item';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 8,
  },
});

export default CheckboxExample;
