import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton, Colors, useTheme } from 'react-native-paper';

const RadioButtonItemExample = () => {
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
      <RadioButton.Item
        label="Default (will look like whatever system this is running on)"
        status={checkedDefault ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDefault(!checkedDefault)}
        value="default"
      />
      <RadioButton.Item
        label="Android"
        mode="android"
        status={checkedAndroid ? 'checked' : 'unchecked'}
        onPress={() => setCheckedAndroid(!checkedAndroid)}
        value="android"
      />
      <RadioButton.Item
        label="iOS"
        mode="ios"
        status={checkedIOS ? 'checked' : 'unchecked'}
        onPress={() => setCheckedIOS(!checkedIOS)}
        value="iOS"
      />
    </View>
  );
};

RadioButtonItemExample.title = 'Radio Button Item';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 8,
  },
});

export default RadioButtonItemExample;
