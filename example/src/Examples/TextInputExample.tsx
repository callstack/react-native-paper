import * as React from 'react';
import {
  StyleSheet,
  TextInput as NativeTextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import {
  Divider,
  List,
  Switch,
  Text,
  TextInput,
  TouchableRipple,
  type TextInputAccessoryProps,
  type TextInputVariant,
} from 'react-native-paper';

import { useExampleTheme } from '../hooks/useExampleTheme';
import ScreenWrapper from '../ScreenWrapper';

type DemoControls = {
  error: boolean;
  disabled: boolean;
  readOnly: boolean;
  leadingIcon: boolean;
  trailingIcon: boolean;
  counter: boolean;
  showPrefix: boolean;
  showSuffix: boolean;
  multiline: boolean;
};

type DemoModifiers = {
  label: string;
  helperText: string;
  placeholder: string;
  prefix: string;
  suffix: string;
};

type TextInputDemoProps = {
  variant: TextInputVariant;
};

const TextInputDemo = ({ variant }: TextInputDemoProps) => {
  const theme = useExampleTheme();

  const [value, setValue] = React.useState('');

  const [controls, setControls] = React.useState<DemoControls>({
    error: false,
    disabled: false,
    readOnly: false,
    leadingIcon: false,
    trailingIcon: false,
    counter: false,
    showPrefix: false,
    showSuffix: false,
    multiline: false,
  });

  const [modifiers, setModifiers] = React.useState<DemoModifiers>({
    label: 'Label',
    helperText: 'Supporting text',
    placeholder: 'Placeholder',
    prefix: '$',
    suffix: '/100',
  });

  const toggleControl = (key: keyof DemoControls) =>
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));

  const setModifier = (key: keyof DemoModifiers, text: string) =>
    setModifiers((prev) => ({ ...prev, [key]: text }));

  const leadingIcon = (props: TextInputAccessoryProps) => (
    <TextInput.Icon {...props} icon="magnify" />
  );

  const trailingIcon = (props: TextInputAccessoryProps) => (
    <TextInput.Icon {...props} icon="close" onPress={() => setValue('')} />
  );

  const inputColor = theme.colors.onSurfaceVariant;
  const borderColor = theme.colors.outlineVariant;

  const modifierInputStyle: TextStyle = {
    flex: 1,
    color: inputColor,
    fontSize: 14,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: borderColor,
  };

  const SWITCH_CONTROLS: { label: string; key: keyof DemoControls }[] = [
    { label: 'Error', key: 'error' },
    { label: 'Disabled', key: 'disabled' },
    { label: 'Readonly', key: 'readOnly' },
    { label: 'Leading icon', key: 'leadingIcon' },
    { label: 'Trailing icon', key: 'trailingIcon' },
    { label: 'Counter', key: 'counter' },
    { label: 'Prefix', key: 'showPrefix' },
    { label: 'Suffix', key: 'showSuffix' },
    { label: 'Multiline', key: 'multiline' },
  ];

  const MODIFIER_FIELDS: { label: string; key: keyof DemoModifiers }[] = [
    { label: 'Label', key: 'label' },
    { label: 'Helper', key: 'helperText' },
    { label: 'Placeholder', key: 'placeholder' },
    { label: 'Prefix', key: 'prefix' },
    { label: 'Suffix', key: 'suffix' },
  ];

  return (
    <View style={styles.demoContainer}>
      {/* Live TextInput */}
      <TextInput
        variant={variant}
        label={modifiers.label || undefined}
        placeholder={modifiers.placeholder || undefined}
        supportingText={modifiers.helperText || undefined}
        error={controls.error}
        disabled={controls.disabled}
        editable={!controls.readOnly}
        value={value}
        onChangeText={setValue}
        multiline={controls.multiline}
        counter={controls.counter}
        maxLength={controls.counter ? 100 : undefined}
        prefix={controls.showPrefix ? modifiers.prefix : undefined}
        suffix={controls.showSuffix ? modifiers.suffix : undefined}
        startAccessory={controls.leadingIcon ? leadingIcon : undefined}
        endAccessory={controls.trailingIcon ? trailingIcon : undefined}
      />

      <Divider style={styles.divider} />

      {/* Controls */}
      <List.Subheader style={styles.subheader}>Controls</List.Subheader>
      {SWITCH_CONTROLS.map(({ label, key }) => (
        <TouchableRipple key={key} onPress={() => toggleControl(key)}>
          <View style={styles.switchRow}>
            <Text variant="bodyMedium">{label}</Text>
            <View pointerEvents="none">
              <Switch value={controls[key]} />
            </View>
          </View>
        </TouchableRipple>
      ))}

      <Divider style={styles.divider} />

      {/* Modifiers */}
      <List.Subheader style={styles.subheader}>Modifiers</List.Subheader>
      {MODIFIER_FIELDS.map(({ label, key }) => (
        <View key={key} style={styles.modifierRow}>
          <Text variant="bodyMedium" style={styles.modifierLabel}>
            {label}
          </Text>
          <NativeTextInput
            value={modifiers[key]}
            onChangeText={(text) => setModifier(key, text)}
            style={modifierInputStyle}
            placeholderTextColor={theme.colors.outline}
            placeholder={`Enter ${label.toLowerCase()}…`}
          />
        </View>
      ))}
    </View>
  );
};

const TextInputExample = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <List.Section title="Filled">
        <TextInputDemo variant="filled" />
      </List.Section>
      <List.Section title="Outlined">
        <TextInputDemo variant="outlined" />
      </List.Section>
    </ScreenWrapper>
  );
};

TextInputExample.title = 'TextInput';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  } satisfies ViewStyle,
  demoContainer: {
    gap: 4,
  } satisfies ViewStyle,
  divider: {
    marginVertical: 8,
  } satisfies ViewStyle,
  subheader: {
    paddingHorizontal: 0,
  } satisfies TextStyle,
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
  } satisfies ViewStyle,
  modifierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
  } satisfies ViewStyle,
  modifierLabel: {
    width: 80,
  } satisfies TextStyle,
});

export default TextInputExample;
