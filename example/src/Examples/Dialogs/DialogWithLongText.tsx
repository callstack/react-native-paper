import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

import { Button, Portal, Dialog } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithLongText = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal>
    <Dialog
      onDismiss={close}
      visible={visible}
      style={{ maxHeight: 0.6 * Dimensions.get('window').height }}
    >
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.ScrollArea style={styles.smallPadding}>
        <ScrollView contentContainerStyle={styles.biggerPadding}>
          <TextComponent>
            Material is the metaphor
            {'\n'}
            {'\n'}A material metaphor is the unifying theory of a rationalized
            space and a system of motion. The material is grounded in tactile
            reality, inspired by the study of paper and ink, yet technologically
            advanced and open to imagination and magic.
            {'\n'}
            {'\n'}
            Surfaces and edges of the material provide visual cues that are
            grounded in reality. The use of familiar tactile attributes helps
            users quickly understand affordances. Yet the flexibility of the
            material creates new affordances that supersede those in the
            physical world, without breaking the rules of physics.
            {'\n'}
            {'\n'}
            The fundamentals of light, surface, and movement are key to
            conveying how objects move, interact, and exist in space and in
            relation to each other. Realistic lighting shows seams, divides
            space, and indicates moving parts.
            {'\n'}
            {'\n'}A material metaphor is the unifying theory of a rationalized
            space and a system of motion. The material is grounded in tactile
            reality, inspired by the study of paper and ink, yet technologically
            advanced and open to imagination and magic.
            {'\n'}
            {'\n'}
            Surfaces and edges of the material provide visual cues that are
            grounded in reality. The use of familiar tactile attributes helps
            users quickly understand affordances. Yet the flexibility of the
            material creates new affordances that supersede those in the
            physical world, without breaking the rules of physics.
            {'\n'}
            {'\n'}
            The fundamentals of light, surface, and movement are key to
            conveying how objects move, interact, and exist in space and in
            relation to each other. Realistic lighting shows seams, divides
            space, and indicates moving parts.
          </TextComponent>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button onPress={close}>Ok</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

const styles = StyleSheet.create({
  smallPadding: {
    paddingHorizontal: 0,
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
});

export default DialogWithLongText;
