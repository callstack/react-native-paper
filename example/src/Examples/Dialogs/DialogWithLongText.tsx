import { Dimensions, StyleSheet } from 'react-native';

import { Portal, Dialog } from 'react-native-paper';

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
      title="Alert"
      scrollable
      scrollAreaProps={{ style: styles.scrollArea }}
      scrollViewProps={{ contentContainerStyle: styles.scrollViewContent }}
      content={
        'Material is the metaphor\n\nA material metaphor is the unifying theory of a rationalized space and a system of motion. The material is grounded in tactile reality, inspired by the study of paper and ink, yet technologically advanced and open to imagination and magic.\n\nSurfaces and edges of the material provide visual cues that are grounded in reality. The use of familiar tactile attributes helps users quickly understand affordances. Yet the flexibility of the material creates new affordances that supersede those in the physical world, without breaking the rules of physics.\n\nThe fundamentals of light, surface, and movement are key to conveying how objects move, interact, and exist in space and in relation to each other. Realistic lighting shows seams, divides space, and indicates moving parts.\n\nA material metaphor is the unifying theory of a rationalized space and a system of motion. The material is grounded in tactile reality, inspired by the study of paper and ink, yet technologically advanced and open to imagination and magic.\n\nSurfaces and edges of the material provide visual cues that are grounded in reality. The use of familiar tactile attributes helps users quickly understand affordances. Yet the flexibility of the material creates new affordances that supersede those in the physical world, without breaking the rules of physics.\n\nThe fundamentals of light, surface, and movement are key to conveying how objects move, interact, and exist in space and in relation to each other. Realistic lighting shows seams, divides space, and indicates moving parts.'
      }
      actions={[{ onPress: close, label: 'Ok' }]}
    />
  </Portal>
);

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: 0,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
  },
});

export default DialogWithLongText;
