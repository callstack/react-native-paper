/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { Paragraph, Button, Dialog } from 'react-native-paper';

const DialogWithLongText = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) => (
  <Dialog onRequestClose={close} visible={visible} dismissable={false}>
    <Dialog.Title>Alert</Dialog.Title>
    <Dialog.Content>
      <Paragraph>This is an undismissable dialog!!</Paragraph>
    </Dialog.Content>
    <Dialog.Actions>
      <Button disabled>Disagree</Button>
      <Button primary onPress={close}>
        Agree
      </Button>
    </Dialog.Actions>
  </Dialog>
);

DialogWithLongText.propTypes = {
  visible: PropTypes.bool,
  close: PropTypes.func,
};

export default DialogWithLongText;
