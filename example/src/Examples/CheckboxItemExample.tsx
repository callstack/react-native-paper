import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Checkbox } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const CheckboxExample = () => {
  const [checkedDefault, setCheckedDefault] = React.useState<boolean>(true);
  const [checkedLeadingControl, setCheckedLeadingControl] =
    React.useState<boolean>(true);
  const [checkedDisabled, setCheckedDisabled] = React.useState<boolean>(true);
  const [checkedLabelVariant, setCheckedLabelVariant] = React.useState(true);

  return (
    <ScreenWrapper style={styles.container}>
      <Checkbox.Item
        label="Default"
        status={checkedDefault ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDefault(!checkedDefault)}
      />
      <Checkbox.Item
        label="Default with leading control"
        status={checkedLeadingControl ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLeadingControl(!checkedLeadingControl)}
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
