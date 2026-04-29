import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Icon,
  List,
  TextField,
  type TextFieldAccessoryProps,
} from 'react-native-paper';

import { useExampleTheme } from '../hooks/useExampleTheme';
import ScreenWrapper from '../ScreenWrapper';

const TextFieldExample = () => {
  const { colors } = useExampleTheme();
  const iconMuted = colors.onSurfaceVariant;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [filledPassword, setFilledPassword] = React.useState('');
  const [filledNotes, setFilledNotes] = React.useState('');
  const [filledPrefix, setFilledPrefix] = React.useState('');
  const [filledSuffix, setFilledSuffix] = React.useState('');
  const [outlinedSearchQuery, setOutlinedSearchQuery] = React.useState('');
  const [outlinedText, setOutlinedText] = React.useState('');
  const [outlinedPassword, setOutlinedPassword] = React.useState('');
  const [outlinedNotes, setOutlinedNotes] = React.useState('');
  const [outlinedPrefix, setOutlinedPrefix] = React.useState('');
  const [outlinedSuffix, setOutlinedSuffix] = React.useState('');
  const [errorField, setErrorField] = React.useState('invalid@');

  const ClearFilledSearchAccessory = ({
    style,
    editable,
  }: TextFieldAccessoryProps) => {
    return (
      <Pressable
        style={style}
        disabled={!editable}
        onPress={() => setSearchQuery('')}
        accessibilityRole="button"
        accessibilityLabel="Clear text"
      >
        <Icon source="close" size={24} color={iconMuted} />
      </Pressable>
    );
  };

  const ClearOutlinedSearchAccessory = ({
    style,
    editable,
  }: TextFieldAccessoryProps) => {
    return (
      <Pressable
        style={style}
        disabled={!editable}
        onPress={() => setOutlinedSearchQuery('')}
        accessibilityRole="button"
        accessibilityLabel="Clear text"
      >
        <Icon source="close" size={24} color={iconMuted} />
      </Pressable>
    );
  };

  const SearchLeadingAccessory = ({ style }: TextFieldAccessoryProps) => {
    return (
      <View style={style}>
        <Icon source="magnify" size={24} color={iconMuted} />
      </View>
    );
  };

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <List.Section title="Filled" style={styles.section}>
        <TextField
          variant="filled"
          label="With accessories"
          value={searchQuery}
          onChangeText={setSearchQuery}
          StartAccessory={SearchLeadingAccessory}
          EndAccessory={ClearFilledSearchAccessory}
          pressableStyle={styles.field}
          placeholder="Search"
        />
        <TextField
          variant="filled"
          label="Without accessories"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          pressableStyle={styles.field}
          placeholder="Email"
        />
        <TextField
          variant="filled"
          label="Email (error)"
          supportingText="Enter a valid email address."
          placeholder="name@example.com"
          status="error"
          value={errorField}
          onChangeText={setErrorField}
          keyboardType="email-address"
          autoCapitalize="none"
          pressableStyle={styles.field}
        />
        <TextField
          variant="filled"
          label="Account (disabled)"
          supportingText="Contact support to make changes."
          value="read-only@example.com"
          editable={false}
          pressableStyle={styles.field}
        />
        <TextField
          variant="filled"
          label="Notes (multiline)"
          supportingText="Optional details for your request."
          placeholder="Add a note…"
          value={filledNotes}
          onChangeText={setFilledNotes}
          multiline
          pressableStyle={styles.field}
        />
        <TextField
          variant="filled"
          label="Password"
          supportingText="At least 8 characters."
          placeholder="••••••••"
          value={filledPassword}
          onChangeText={setFilledPassword}
          secureTextEntry
          textContentType="password"
          pressableStyle={styles.field}
        />

        <TextField
          variant="filled"
          label="Label"
          value={filledPrefix}
          onChangeText={setFilledPrefix}
          prefix="$"
          pressableStyle={styles.field}
          placeholder="0.00"
          keyboardType="decimal-pad"
          StartAccessory={SearchLeadingAccessory}
        />
        <TextField
          variant="filled"
          label="Label"
          value={filledSuffix}
          onChangeText={setFilledSuffix}
          suffix="/100"
          pressableStyle={styles.field}
          keyboardType="number-pad"
          EndAccessory={ClearFilledSearchAccessory}
        />
      </List.Section>

      <List.Section title="Outlined" style={styles.section}>
        <TextField
          variant="outlined"
          label="With accessories"
          value={outlinedSearchQuery}
          onChangeText={setOutlinedSearchQuery}
          StartAccessory={SearchLeadingAccessory}
          EndAccessory={ClearOutlinedSearchAccessory}
          pressableStyle={styles.field}
          placeholder="Search"
        />
        <TextField
          variant="outlined"
          label="Without accessories"
          value={outlinedText}
          onChangeText={setOutlinedText}
          pressableStyle={styles.field}
        />
        <TextField
          variant="outlined"
          label="Email (error)"
          supportingText="Enter a valid email address."
          placeholder="name@example.com"
          status="error"
          value={errorField}
          onChangeText={setErrorField}
          keyboardType="email-address"
          autoCapitalize="none"
          pressableStyle={styles.field}
        />
        <TextField
          variant="outlined"
          label="Disabled via status"
          supportingText="This field cannot be edited."
          value="Disabled"
          status="disabled"
          pressableStyle={styles.field}
        />
        <TextField
          variant="outlined"
          label="Notes (multiline)"
          supportingText="Optional details for your request."
          placeholder="Add a note…"
          value={outlinedNotes}
          onChangeText={setOutlinedNotes}
          multiline
          pressableStyle={styles.field}
        />
        <TextField
          variant="outlined"
          label="Password"
          supportingText="At least 8 characters."
          placeholder="••••••••"
          value={outlinedPassword}
          onChangeText={setOutlinedPassword}
          secureTextEntry
          textContentType="password"
          pressableStyle={styles.field}
        />
        <TextField
          variant="outlined"
          label="Label"
          value={outlinedPrefix}
          onChangeText={setOutlinedPrefix}
          prefix="$"
          pressableStyle={styles.field}
          placeholder="0.00"
          keyboardType="decimal-pad"
          StartAccessory={SearchLeadingAccessory}
        />
        <TextField
          variant="outlined"
          label="Label"
          value={outlinedSuffix}
          onChangeText={setOutlinedSuffix}
          suffix="/100"
          pressableStyle={styles.field}
          keyboardType="number-pad"
          EndAccessory={ClearOutlinedSearchAccessory}
        />
      </List.Section>
    </ScreenWrapper>
  );
};

TextFieldExample.title = 'TextField';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  field: {},
  section: {
    gap: 16,
  },
});

export default TextFieldExample;
