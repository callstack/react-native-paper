import * as React from 'react';
import { StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const RadioButtonItemExample = () => {
  const [checkedDefault, setCheckedDefault] = React.useState<boolean>(true);
  const [checkedAndroid, setCheckedAndroid] = React.useState<boolean>(true);
  const [checkedIOS, setCheckedIOS] = React.useState<boolean>(true);
  const [checkedLeadingControl, setCheckedLeadingControl] =
    React.useState<boolean>(true);

  return (
    <ScreenWrapper style={styles.container}>
      <RadioButton.Item
        label="Default (will look like whatever system this is running on)"
        status={checkedDefault ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDefault(!checkedDefault)}
        value="default"
      />
      <RadioButton.Item
        label="Material Design"
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
      <RadioButton.Item
        label="Default with leading control"
        status={checkedLeadingControl ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLeadingControl(!checkedLeadingControl)}
        value="iOS"
        position="leading"
      />
    </ScreenWrapper>
  );
};

RadioButtonItemExample.title = 'Radio Button Item';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});

export default RadioButtonItemExample;
