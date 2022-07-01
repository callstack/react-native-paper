/**
 * Material design guide: https://material.io/develop/android/components/bottom-sheet-dialog-fragment#theming-bottom-sheets
 */

import * as React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import type { Theme } from 'src/types';
import { withTheme } from '../../core/theming';
import Text from '../Typography/Text';

type Props = {
  /**
   * The heading of the modal which is shown at the top
   */
  label: string;
  /**
   * Determines whether the modal is visible
   */
  visible: boolean;
  /**
   * Callback that is called when the user dismisses the modal.
   */
  onDismiss: () => void;
  /**
   * @optional
   */
  theme: Theme;
};

const BottomSheetModal = ({ label, visible, onDismiss }: Props) => {
  const visibleRef = React.useRef(visible);

  React.useEffect(() => {
    visibleRef.current = visible;
  });

  const [rendered, setRendered] = React.useState(visible);

  if (visible && !rendered) {
    setRendered(true);
  }

  const hideModal = () => {
    if (visible && onDismiss) {
      onDismiss();
      setRendered(false);
    }
  };

  if (!rendered) return null;
  return (
    <>
      <View
        pointerEvents={visible ? 'auto' : 'none'}
        accessibilityViewIsModal
        accessibilityLiveRegion="polite"
        style={StyleSheet.absoluteFill}
      >
        <TouchableWithoutFeedback
          accessibilityLabel="Close Bottom Sheet Modal"
          accessibilityRole="button"
          onPress={hideModal}
          importantForAccessibility="no"
        >
          <View style={[styles.backdrop]} />
        </TouchableWithoutFeedback>
        <View style={styles.modalView}>
          <Pressable style={styles.topButton}>
            <Text style={styles.handler}> </Text>
          </Pressable>
          <Text variant="titleMedium" style={{ textAlign: 'center' }}>
            {label}
          </Text>
        </View>
      </View>
    </>
  );
};

export default withTheme(BottomSheetModal);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    opacity: 0.3,
    backgroundColor: 'black',
  },
  handler: {
    height: 5,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1000,
    opacity: 1,
    display: 'flex',
    padding: 10,
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  topButton: {
    backgroundColor: '#666666',
    borderRadius: 20,
    marginHorizontal: 100,
  },
});
