import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Button,
  Portal,
  Dialog,
  RadioButton,
  TouchableRipple,
} from 'react-native-paper';
import { TextComponent } from './utils';

type Props = {
  visible: boolean;
  close: () => void;
};

type CheckedState = 'normal' | 'first' | 'second' | 'third' | 'fourth';

const DialogWithRadioBtns = ({ visible, close }: Props) => {
  const [checked, setChecked] = React.useState<CheckedState>('normal');

  return (
    <Portal>
      <Dialog onDismiss={close} visible={visible}>
        <Dialog.Title>Choose an option</Dialog.Title>
        <Dialog.ScrollArea style={styles.container}>
          <ScrollView>
            <View>
              <TouchableRipple onPress={() => setChecked('normal')}>
                <View style={styles.row}>
                  <View pointerEvents="none">
                    <RadioButton
                      value="normal"
                      status={checked === 'normal' ? 'checked' : 'unchecked'}
                    />
                  </View>
                  <TextComponent isSubheading style={styles.text}>
                    Option 1
                  </TextComponent>
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
                  <TextComponent isSubheading style={styles.text}>
                    Option 2
                  </TextComponent>
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
                  <TextComponent isSubheading style={styles.text}>
                    Option 3
                  </TextComponent>
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
                  <TextComponent isSubheading style={styles.text}>
                    Option 4
                  </TextComponent>
                </View>
              </TouchableRipple>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={close}>Cancel</Button>
          <Button onPress={close}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
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
