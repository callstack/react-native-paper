import React from 'react';
import { DropdownContext } from './Dropdown';
import DropdownContentModal from './DropdownContentModal';
import DropdownContentFloating from './DropdownContentFloating';

type Props = {
  children: React.ReactNode;
  visible: boolean;
};

const DropdownContent = (props: Props) => {
  const context = React.useContext(DropdownContext);

  if (!context) {
    return null;
  }

  const { mode } = context;

  switch (mode) {
    case 'floating':
      return (
        <DropdownContentFloating {...props}>
          {props.children}
        </DropdownContentFloating>
      );
    case 'modal':
      return (
        <DropdownContentModal {...props}>{props.children}</DropdownContentModal>
      );
    default:
      throw new Error('Unknown mode ' + mode);
  }
};

export default DropdownContent;
