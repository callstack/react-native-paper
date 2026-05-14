import TextFieldComponent from './TextField';
import TextFieldIcon from './TextFieldIcon';

const TextField = Object.assign(
  // @component ./TextField.tsx
  TextFieldComponent,
  {
    // @component ./TextFieldIcon.tsx
    Icon: TextFieldIcon,
  }
);

export default TextField;
