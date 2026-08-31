import TextInputComponent from './TextInput';
import TextInputIcon from './TextInputIcon';

const TextInput = Object.assign(
  // @component ./TextInput.tsx
  TextInputComponent,
  {
    // @component ./TextInputIcon.tsx
    Icon: TextInputIcon,
  }
);

export default TextInput;
