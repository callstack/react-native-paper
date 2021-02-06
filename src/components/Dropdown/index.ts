import DropdownComponent from './Dropdown';
import DropdownOption from './DropdownOption';

type DropdownExport = typeof DropdownComponent & {
  Option: typeof DropdownOption;
};

const Dropdown: DropdownExport = Object.assign(
  // @component ./Dropdown.tsx
  DropdownComponent,
  {
    // @component ./DropdownOption.tsx
    Option: DropdownOption,
  }
);

export default Dropdown;
