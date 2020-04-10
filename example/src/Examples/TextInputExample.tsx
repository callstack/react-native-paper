import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';

const MAX_LENGTH = 20;

const TextInputExample = () => {
  const [text, setText] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [outlinedText, setOutlinedText] = React.useState<string>('');
  const [largeText, setLargeText] = React.useState<string>('');
  const [outlinedLargeText, setOutlinedLargeText] = React.useState<string>('');
  const [nameNoPadding, setNameNoPadding] = React.useState<string>('');
  const [flatDenseText, setFlatDenseText] = React.useState<string>('');
  const [flatDense, setFlatDense] = React.useState<string>('');
  const [outlinedDenseText, setOutlinedDenseText] = React.useState<string>('');
  const [outlinedDense, setOutlinedDense] = React.useState<string>('');
  const [flatMultiline, setFlatMultiline] = React.useState<string>('');
  const [flatTextArea, setFlatTextArea] = React.useState<string>('');
  const [outlinedMultiline, setOutlinedMultiline] = React.useState<string>('');
  const [outlinedTextArea, setOutlinedTextArea] = React.useState<string>('');
  const [maxLengthName, setMaxLengthName] = React.useState<string>('');

  const _isUsernameValid = (name: string) => /^[a-zA-Z]*$/.test(name);

  const {
    colors: { background },
  } = useTheme();

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior="padding"
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        keyboardShouldPersistTaps={'always'}
        removeClippedSubviews={false}
      >
        <TextInput
          style={styles.inputContainerStyle}
          label="Flat input"
          placeholder="Type something"
          value={text}
          onChangeText={text => setText(text)}
        />
        <TextInput
          style={[styles.inputContainerStyle, styles.fontSize]}
          label="Flat input large font"
          placeholder="Type something"
          value={largeText}
          onChangeText={largeText => setLargeText(largeText)}
        />
        <TextInput
          style={styles.inputContainerStyle}
          dense
          label="Dense flat input"
          placeholder="Type something"
          value={flatDenseText}
          onChangeText={flatDenseText => setFlatDenseText(flatDenseText)}
        />
        <TextInput
          style={styles.inputContainerStyle}
          dense
          placeholder="Dense flat input without label"
          value={flatDense}
          onChangeText={flatDense => setFlatDense(flatDense)}
        />
        <TextInput
          style={styles.inputContainerStyle}
          label="Flat input multiline"
          multiline
          placeholder="Type something"
          value={flatMultiline}
          onChangeText={flatMultiline => setFlatMultiline(flatMultiline)}
        />
        <TextInput
          style={[styles.inputContainerStyle, styles.textArea]}
          label="Flat input text area"
          multiline
          placeholder="Type something"
          value={flatTextArea}
          onChangeText={flatTextArea => setFlatTextArea(flatTextArea)}
        />
        <TextInput
          disabled
          style={styles.inputContainerStyle}
          label="Disabled flat input"
        />
        <TextInput
          mode="outlined"
          style={styles.inputContainerStyle}
          label="Outlined input"
          placeholder="Type something"
          value={outlinedText}
          onChangeText={outlinedText => setOutlinedText(outlinedText)}
        />
        <TextInput
          mode="outlined"
          style={[styles.inputContainerStyle, styles.fontSize]}
          label="Outlined large font"
          placeholder="Type something"
          value={outlinedLargeText}
          onChangeText={outlinedLargeText =>
            setOutlinedLargeText(outlinedLargeText)
          }
        />
        <TextInput
          mode="outlined"
          style={styles.inputContainerStyle}
          dense
          label="Dense outlined input"
          placeholder="Type something"
          value={outlinedDenseText}
          onChangeText={outlinedDenseText =>
            setOutlinedDenseText(outlinedDenseText)
          }
        />
        <TextInput
          mode="outlined"
          style={styles.inputContainerStyle}
          dense
          placeholder="Dense outlined input without label"
          value={outlinedDense}
          onChangeText={outlinedDense => setOutlinedDense(outlinedDense)}
        />
        <TextInput
          mode="outlined"
          style={styles.inputContainerStyle}
          label="Outlined input multiline"
          multiline
          placeholder="Type something"
          value={outlinedMultiline}
          onChangeText={outlinedMultiline =>
            setOutlinedMultiline(outlinedMultiline)
          }
        />
        <TextInput
          mode="outlined"
          style={[styles.inputContainerStyle, styles.textArea]}
          label="Outlined input text area"
          multiline
          placeholder="Type something"
          value={outlinedTextArea}
          onChangeText={outlinedTextArea =>
            setOutlinedTextArea(outlinedTextArea)
          }
        />
        <TextInput
          mode="outlined"
          disabled
          style={styles.inputContainerStyle}
          label="Disabled outlined input"
        />
        <View style={styles.inputContainerStyle}>
          <TextInput
            label="Input with helper text"
            placeholder="Enter username, only letters"
            value={name}
            error={!_isUsernameValid(name)}
            onChangeText={name => setName(name)}
          />
          <HelperText type="error" visible={!_isUsernameValid(name)}>
            Error: Only letters are allowed
          </HelperText>
        </View>
        <View style={styles.inputContainerStyle}>
          <TextInput
            label="Input with helper text and character counter"
            placeholder="Enter username, only letters"
            value={maxLengthName}
            error={!_isUsernameValid(maxLengthName)}
            onChangeText={maxLengthName => setMaxLengthName(maxLengthName)}
            maxLength={MAX_LENGTH}
          />
          <View style={styles.helpersWrapper}>
            <HelperText
              type="error"
              visible={!_isUsernameValid(maxLengthName)}
              style={styles.helper}
            >
              Error: Numbers and special characters are not allowed
            </HelperText>
            <HelperText type="info" visible style={styles.counterHelper}>
              {maxLengthName.length} / {MAX_LENGTH}
            </HelperText>
          </View>
        </View>
        <View style={styles.inputContainerStyle}>
          <TextInput
            label="Input with no padding"
            style={{ backgroundColor: 'transparent', paddingHorizontal: 0 }}
            placeholder="Enter username, only letters"
            value={nameNoPadding}
            error={!_isUsernameValid(nameNoPadding)}
            onChangeText={nameNoPadding => setNameNoPadding(nameNoPadding)}
          />
          <HelperText
            type="error"
            padding="none"
            visible={!_isUsernameValid(nameNoPadding)}
          >
            Error: Only letters are allowed
          </HelperText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

TextInputExample.title = 'TextInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  helpersWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapper: {
    flex: 1,
  },
  helper: {
    flexShrink: 1,
  },
  counterHelper: {
    textAlign: 'right',
  },
  inputContainerStyle: {
    margin: 8,
  },
  fontSize: {
    fontSize: 24,
  },
  textArea: {
    height: 80,
  },
});

export default TextInputExample;
