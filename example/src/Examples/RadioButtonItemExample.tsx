import * as React from 'react';
import { StyleSheet } from 'react-native';

import { RadioButton } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const RadioButtonItemExample = () => {
  const [checkedDefault, setCheckedDefault] = React.useState(true);
  const [checkedLeadingControl, setCheckedLeadingControl] =
    React.useState(true);
  const [checkedDisabled, setCheckedDisabled] = React.useState<boolean>(true);
  const [checkedError, setCheckedError] = React.useState(true);
  const [checkedLabelVariant, setCheckedLabelVariant] = React.useState(true);

  return (
    <ScreenWrapper style={styles.container}>
      <RadioButton.Item
        label="Default (trailing control)"
        status={checkedDefault ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDefault(!checkedDefault)}
        value="default"
      />
      <RadioButton.Item
        label="Leading control"
        status={checkedLeadingControl ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLeadingControl(!checkedLeadingControl)}
        value="leading"
        position="leading"
      />
      <RadioButton.Item
        label="Error"
        status={checkedError ? 'checked' : 'unchecked'}
        onPress={() => setCheckedError(!checkedError)}
        value="error"
        error
      />
      <RadioButton.Item
        label="Disabled"
        status={checkedDisabled ? 'checked' : 'unchecked'}
        onPress={() => setCheckedDisabled(!checkedDisabled)}
        value="disabled"
        disabled
      />
      <RadioButton.Item
        label="titleLarge label variant"
        labelVariant="titleLarge"
        status={checkedLabelVariant ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLabelVariant(!checkedLabelVariant)}
        value="variant"
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
