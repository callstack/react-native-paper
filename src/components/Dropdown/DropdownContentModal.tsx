import React from 'react';
import { ScrollView } from 'react-native';
import { DropdownContext } from './Dropdown';
import Dialog from '../Dialog/Dialog';

type Props = {
  children: React.ReactNode;
  visible: boolean;
};

const DropdownContentModal = ({ children, visible }: Props) => {
  const { closeMenu } = React.useContext(DropdownContext);

  return (
    <Dialog visible={visible} onDismiss={closeMenu}>
      <ScrollView>{children}</ScrollView>
    </Dialog>
  );
};

export default DropdownContentModal;
