import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import { DropdownContext } from './Dropdown';
import Dialog from '../Dialog/Dialog';

type Props = {
  children: React.ReactNodeArray;
};

const DropdownContent = ({ children }: Props) => {
  const { closeMenu } = useContext(DropdownContext);

  return (
    <Dialog visible onDismiss={closeMenu}>
      <ScrollView>{children}</ScrollView>
    </Dialog>
  );
};

export default DropdownContent;
