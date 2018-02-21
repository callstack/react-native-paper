/* @flow */

import * as React from 'react';
import { ScrollView } from 'react-native';
import {
  Paragraph,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogScrollArea,
} from 'react-native-paper';

const DialogWithLongText = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) => (
  <Dialog onDismiss={close} visible={visible}>
    <DialogTitle>Alert</DialogTitle>
    <DialogScrollArea style={{ maxHeight: 220, paddingHorizontal: 0 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
        <Paragraph>
          Material is the metaphor
          {'\n'}
          {'\n'}
          A material metaphor is the unifying theory of a rationalized space and
          a system of motion. The material is grounded in tactile reality,
          inspired by the study of paper and ink, yet technologically advanced
          and open to imagination and magic.
          {'\n'}
          {'\n'}
          Surfaces and edges of the material provide visual cues that are
          grounded in reality. The use of familiar tactile attributes helps
          users quickly understand affordances. Yet the flexibility of the
          material creates new affordances that supersede those in the physical
          world, without breaking the rules of physics.
          {'\n'}
          {'\n'}
          The fundamentals of light, surface, and movement are key to conveying
          how objects move, interact, and exist in space and in relation to each
          other. Realistic lighting shows seams, divides space, and indicates
          moving parts.
        </Paragraph>
      </ScrollView>
    </DialogScrollArea>
    <DialogActions>
      <Button primary onPress={close}>
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default DialogWithLongText;
