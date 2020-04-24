import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { inputReducer } from '../../utils';

const MAX_LENGTH = 20;

const initialState = {
  text: '',
  maxLengthName: '',
};

type AvoidingViewProps = {
  children: React.ReactNode;
};

const TextInputAvoidingView = ({ children }: AvoidingViewProps) => {
  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior="padding"
      keyboardVerticalOffset={80}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <>{children}</>
  );
};

const TextInputExample = () => {
  const [state, dispatch] = React.useReducer(inputReducer, initialState);
  const {
    text,
    name,
    outlinedText,
    largeText,
    outlinedLargeText,
    nameNoPadding,
    flatDenseText,
    flatDense,
    outlinedDenseText,
    outlinedDense,
    flatMultiline,
    flatTextArea,
    outlinedMultiline,
    outlinedTextArea,
    maxLengthName,
  } = state;

  const _isUsernameValid = (name: string) => /^[a-zA-Z]*$/.test(name);

  const {
    colors: { background },
  } = useTheme();

  const inputActionHandler = (type: string, payload: string) =>
    dispatch({
      type: type,
      payload: payload,
    });

  return (
    <TextInputAvoidingView>
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
          onChangeText={text => inputActionHandler('text', text)}
        />
        <TextInput
          style={[styles.inputContainerStyle, styles.fontSize]}
          label="Flat input large font"
          placeholder="Type something"
          value={largeText}
          onChangeText={largeText => inputActionHandler('largeText', largeText)}
        />
        <TextInput
          style={styles.inputContainerStyle}
          dense
          label="Dense flat input"
          placeholder="Type something"
          value={flatDenseText}
          onChangeText={flatDenseText =>
            inputActionHandler('flatDenseText', flatDenseText)
          }
        />
        <TextInput
          style={styles.inputContainerStyle}
          dense
          placeholder="Dense flat input without label"
          value={flatDense}
          onChangeText={flatDense => inputActionHandler('flatDense', flatDense)}
        />
        <TextInput
          style={styles.inputContainerStyle}
          label="Flat input multiline"
          multiline
          placeholder="Type something"
          value={flatMultiline}
          onChangeText={flatMultiline =>
            inputActionHandler('flatMultiline', flatMultiline)
          }
        />
        <TextInput
          style={[styles.inputContainerStyle, styles.textArea]}
          label="Flat input text area"
          multiline
          placeholder="Type something"
          value={flatTextArea}
          onChangeText={flatTextArea =>
            inputActionHandler('flatTextArea', flatTextArea)
          }
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
          onChangeText={outlinedText =>
            inputActionHandler('outlinedText', outlinedText)
          }
        />
        <TextInput
          mode="outlined"
          style={[styles.inputContainerStyle, styles.fontSize]}
          label="Outlined large font"
          placeholder="Type something"
          value={outlinedLargeText}
          onChangeText={outlinedLargeText =>
            inputActionHandler('outlinedLargeText', outlinedLargeText)
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
            inputActionHandler('outlinedDenseText', outlinedDenseText)
          }
        />
        <TextInput
          mode="outlined"
          style={styles.inputContainerStyle}
          dense
          placeholder="Dense outlined input without label"
          value={outlinedDense}
          onChangeText={outlinedDense =>
            inputActionHandler('outlinedDense', outlinedDense)
          }
        />
        <TextInput
          mode="outlined"
          style={styles.inputContainerStyle}
          label="Outlined input multiline"
          multiline
          placeholder="Type something"
          value={outlinedMultiline}
          onChangeText={outlinedMultiline =>
            inputActionHandler('outlinedMultiline', outlinedMultiline)
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
            inputActionHandler('outlinedTextArea', outlinedTextArea)
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
            onChangeText={name => inputActionHandler('name', name)}
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
            onChangeText={maxLengthName =>
              inputActionHandler('maxLengthName', maxLengthName)
            }
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
            onChangeText={nameNoPadding =>
              inputActionHandler('nameNoPadding', nameNoPadding)
            }
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
    </TextInputAvoidingView>
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
