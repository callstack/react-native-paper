import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import {
  Portal,
  Dialog,
  RadioButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

type Props = {
  visible: boolean;
  close: () => void;
};

type CheckedState = 'normal' | 'first' | 'second' | 'third' | 'fourth';

const DialogWithRadioBtns = ({ visible, close }: Props) => {
  const [checked, setChecked] = React.useState<CheckedState>('normal');
  const theme = useTheme();
  const optionTextColor = { color: theme.colors.onSurfaceVariant };

  return (
    <Portal>
      <Dialog
        onDismiss={close}
        visible={visible}
        title="Choose an option"
        scrollable
        scrollAreaProps={{ style: styles.container }}
        content={
          <View>
            <TouchableRipple onPress={() => setChecked('normal')}>
              <View style={styles.row}>
                <View pointerEvents="none">
                  <RadioButton
                    value="normal"
                    status={checked === 'normal' ? 'checked' : 'unchecked'}
                  />
                </View>
                <Text
                  variant="bodyLarge"
                  style={[styles.text, optionTextColor]}
                >
                  Option 1
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => setChecked('second')}>
              <View style={styles.row}>
                <View pointerEvents="none">
                  <RadioButton
                    value="second"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                  />
                </View>
                <Text
                  variant="bodyLarge"
                  style={[styles.text, optionTextColor]}
                >
                  Option 2
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => setChecked('third')}>
              <View style={styles.row}>
                <View pointerEvents="none">
                  <RadioButton
                    value="third"
                    status={checked === 'third' ? 'checked' : 'unchecked'}
                  />
                </View>
                <Text
                  variant="bodyLarge"
                  style={[styles.text, optionTextColor]}
                >
                  Option 3
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => setChecked('fourth')}>
              <View style={styles.row}>
                <View pointerEvents="none">
                  <RadioButton
                    value="fourth"
                    status={checked === 'fourth' ? 'checked' : 'unchecked'}
                  />
                </View>
                <Text
                  variant="bodyLarge"
                  style={[styles.text, optionTextColor]}
                >
                  Option 4
                </Text>
              </View>
            </TouchableRipple>
          </View>
        }
        actions={[
          { label: 'Cancel', onPress: close },
          { label: 'Ok', onPress: close },
        ]}
      />
    </Portal>
  );
};

export default DialogWithRadioBtns;

const styles = StyleSheet.create({
  container: {
    maxHeight: 170,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
  },
});
