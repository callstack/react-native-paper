/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Paragraph, Colors, Dialog } from 'react-native-paper';

const isIOS = Platform.OS === 'ios';

const DialogWithLoadingIndicator = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) =>
  <Dialog onRequestClose={close} visible={visible}>
    <Dialog.Title>Progress Dialog</Dialog.Title>
    <Dialog.Content>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ActivityIndicator
          color={Colors.indigo500}
          size={isIOS ? 'large' : 48}
          style={{ marginRight: 16 }}
        />
        <Paragraph>Loading.....</Paragraph>
      </View>
    </Dialog.Content>
  </Dialog>;

DialogWithLoadingIndicator.propTypes = {
  visible: PropTypes.bool,
  close: PropTypes.func,
};

export default DialogWithLoadingIndicator;
