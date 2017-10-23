/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { Paragraph, Button, Dialog, Colors } from 'react-native-paper';

const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) => (
  <Dialog
    onRequestClose={close}
    style={{ backgroundColor: Colors.purple900 }}
    visible={visible}
  >
    <Dialog.Title style={{ color: Colors.white }}>Alert</Dialog.Title>
    <Dialog.Content>
      <Paragraph style={{ color: Colors.white }}>
        This is a dialog with custom colors
      </Paragraph>
    </Dialog.Content>
    <Dialog.Actions>
      <Button color={Colors.pink500} onPress={close}>
        OK
      </Button>
    </Dialog.Actions>
  </Dialog>
);

DialogWithCustomColors.propTypes = {
  visible: PropTypes.bool,
  close: PropTypes.func,
};

export default DialogWithCustomColors;
