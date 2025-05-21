import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Checkbox } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const CheckboxExample = () => {
  const [checkedDefault, setCheckedDefault] = React.useState<boolean>(true);
  const [checkedAndroid, setCheckedAndroid] = React.useState<boolean>(true);
  const [checkedIOS, setCheckedIOS] = React.useState<boolean>(true);
  const [checkedLeadingControl, setCheckedLeadingControl] =
    React.useState<boolean>(true);
  const [checkedDisabled, setCheckedDisabled] = React.useState<boolean>(true);
  const [checkedLabelVariant, setCheckedLabelVariant] = React.useState(true);

  return (
    <ScreenWrapper style={styles.container}>
      <Checkbox.Item
        label="Default (will look like whatever system this is running on)"
        status={checkedDefault ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDefault(!checkedDefault)}
      />
      <Checkbox.Item
        label="Material Design"
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
      <Checkbox.Item
        label="Default with leading control"
        status={checkedLeadingControl ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLeadingControl(!checkedLeadingControl)}
        mode="ios"
        position="leading"
      />
      <Checkbox.Item
        label="Disabled checkbox"
        status={checkedDisabled ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDisabled(!checkedDisabled)}
        disabled
      />
      <Checkbox.Item
        label="Default with titleLarge title variant"
        labelVariant="titleLarge"
        status={checkedLabelVariant ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLabelVariant(!checkedLabelVariant)}
      />
    </ScreenWrapper>
  );
};

CheckboxExample.title = 'Checkbox Item';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});

export default CheckboxExample;
