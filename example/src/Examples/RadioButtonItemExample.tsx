import * as React from 'react';
import { StyleSheet } from 'react-native';

import { RadioButton } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const RadioButtonItemExample = () => {
  const [checkedDefault, setCheckedDefault] = React.useState(true);
  const [checkedLeadingControl, setCheckedLeadingControl] =
    React.useState(true);
  const [checkedDisabled, setCheckedDisabled] = React.useState<boolean>(true);
  const [checkedLabelVariant, setCheckedLabelVariant] = React.useState(true);

  return (
    <ScreenWrapper style={styles.container}>
      <RadioButton.Item
        label="Default"
        status={checkedDefault ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDefault(!checkedDefault)}
        value="default"
      />
      <RadioButton.Item
        label="Default with leading control"
        status={checkedLeadingControl ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLeadingControl(!checkedLeadingControl)}
        value="iOS"
        position="leading"
      />
      <RadioButton.Item
        label="Disabled checkbox"
        status={checkedDisabled ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDisabled(!checkedDisabled)}
        value="iOS"
        disabled
      />
      <RadioButton.Item
        label="Default with titleLarge title variant"
        labelVariant="titleLarge"
        status={checkedLabelVariant ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLabelVariant(!checkedLabelVariant)}
        value="default"
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
