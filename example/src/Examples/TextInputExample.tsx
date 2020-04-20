import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput, HelperText, withTheme, Theme } from 'react-native-paper';

const MAX_LENGTH = 20;

type Props = {
  theme: Theme;
};

type State = {
  text: string;
  name: string;
  outlinedText: string;
  largeText: string;
  flatTextPassword: string;
  outlinedLargeText: string;
  nameNoPadding: string;
  flatDenseText: string;
  flatDense: string;
  outlinedDenseText: string;
  outlinedDense: string;
  flatMultiline: string;
  flatTextArea: string;
  outlinedMultiline: string;
  outlinedTextArea: string;
  maxLengthName: string;
  flatTextSecureEntry: boolean;
  outlineTextSecureEntry: boolean;
  iconsColor: {
    [key: string]: string | undefined;
  };
};

class TextInputExample extends React.Component<Props, State> {
  static title = 'TextInput';

  state = {
    text: '',
    name: '',
    outlinedText: '',
    largeText: '',
    flatTextPassword: 'Password',
    outlinedLargeText: '',
    outlinedTextPassword: 'Password',
    nameNoPadding: '',
    flatDenseText: '',
    flatDense: '',
    outlinedDenseText: '',
    outlinedDense: '',
    flatMultiline: '',
    flatTextArea: '',
    outlinedMultiline: '',
    outlinedTextArea: '',
    maxLengthName: '',
    flatTextSecureEntry: true,
    outlineTextSecureEntry: true,
    iconsColor: {
      flatLeftIcon: undefined,
      flatRightIcon: undefined,
      outlineLeftIcon: undefined,
      outlineRightIcon: undefined,
    },
  };

  _isUsernameValid = (name: string) => /^[a-zA-Z]*$/.test(name);

  _changeIconColor = (name: string) => {
    const {
      theme: {
        colors: { accent },
      },
    } = this.props;

    const { iconsColor: currentColors } = this.state;

    const color = (currentColors as State['iconsColor'])[name];

    const iconsColor = {
      ...currentColors,
      [name]: !color ? accent : undefined,
    };

    this.setState({ iconsColor });
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

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
            value={this.state.text}
            onChangeText={text => this.setState({ text })}
            left={
              <TextInput.Icon
                name="heart"
                color={this.state.iconsColor['flatLeftIcon']}
                onPress={() => {
                  this._changeIconColor('flatLeftIcon');
                }}
              />
            }
            right={<TextInput.Affix text="/100" />}
          />
          <TextInput
            style={[styles.inputContainerStyle, styles.fontSize]}
            label="Flat input large font"
            placeholder="Type something"
            value={this.state.largeText}
            onChangeText={largeText => this.setState({ largeText })}
            left={<TextInput.Affix text="#" />}
            right={
              <TextInput.Icon
                name="heart"
                color={this.state.iconsColor['flatRightIcon']}
                onPress={() => {
                  this._changeIconColor('flatRightIcon');
                }}
              />
            }
          />
          <TextInput
            style={[styles.inputContainerStyle, styles.fontSize]}
            label="Flat input large font"
            placeholder="Type something"
            value={this.state.flatTextPassword}
            onChangeText={flatTextPassword =>
              this.setState({ flatTextPassword })
            }
            secureTextEntry={this.state.flatTextSecureEntry}
            right={
              <TextInput.Icon
                name={this.state.flatTextSecureEntry ? 'eye' : 'eye-off'}
                onPress={() =>
                  this.setState({
                    flatTextSecureEntry: !this.state.flatTextSecureEntry,
                  })
                }
              />
            }
          />
          <TextInput
            style={styles.inputContainerStyle}
            dense
            label="Dense flat input"
            placeholder="Type something"
            value={this.state.flatDenseText}
            onChangeText={flatDenseText => this.setState({ flatDenseText })}
            left={<TextInput.Affix text="#" />}
          />
          <TextInput
            style={styles.inputContainerStyle}
            dense
            placeholder="Dense flat input without label"
            value={this.state.flatDense}
            onChangeText={flatDense => this.setState({ flatDense })}
          />
          <TextInput
            style={styles.inputContainerStyle}
            label="Flat input multiline"
            multiline
            placeholder="Type something"
            value={this.state.flatMultiline}
            onChangeText={flatMultiline => this.setState({ flatMultiline })}
          />
          <TextInput
            style={[styles.inputContainerStyle, styles.textArea]}
            label="Flat input text area"
            multiline
            placeholder="Type something"
            value={this.state.flatTextArea}
            onChangeText={flatTextArea => this.setState({ flatTextArea })}
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
            value={this.state.outlinedText}
            onChangeText={outlinedText => this.setState({ outlinedText })}
            left={
              <TextInput.Icon
                name="heart"
                color={this.state.iconsColor['outlineLeftIcon']}
                onPress={() => {
                  this._changeIconColor('outlineLeftIcon');
                }}
              />
            }
            right={<TextInput.Affix text="/100" />}
          />
          <TextInput
            mode="outlined"
            style={[styles.inputContainerStyle, styles.fontSize]}
            label="Outlined large font"
            placeholder="Type something"
            value={this.state.outlinedLargeText}
            onChangeText={outlinedLargeText =>
              this.setState({ outlinedLargeText })
            }
            left={<TextInput.Affix text="$" />}
            right={
              <TextInput.Icon
                name="heart"
                color={this.state.iconsColor['outlineRightIcon']}
                onPress={() => {
                  this._changeIconColor('outlineRightIcon');
                }}
              />
            }
          />
          <TextInput
            mode="outlined"
            style={[styles.inputContainerStyle, styles.fontSize]}
            label="Outlined large font"
            placeholder="Type something"
            value={this.state.outlinedTextPassword}
            onChangeText={outlinedLargeText =>
              this.setState({ outlinedLargeText })
            }
            secureTextEntry={this.state.outlineTextSecureEntry}
            right={
              <TextInput.Icon
                name={this.state.outlineTextSecureEntry ? 'eye' : 'eye-off'}
                onPress={() =>
                  this.setState({
                    outlineTextSecureEntry: !this.state.outlineTextSecureEntry,
                  })
                }
              />
            }
          />
          <TextInput
            mode="outlined"
            style={styles.inputContainerStyle}
            dense
            label="Dense outlined input"
            placeholder="Type something"
            value={this.state.outlinedDenseText}
            onChangeText={outlinedDenseText =>
              this.setState({ outlinedDenseText })
            }
            left={<TextInput.Affix text="$" />}
          />
          <TextInput
            mode="outlined"
            style={styles.inputContainerStyle}
            dense
            placeholder="Dense outlined input without label"
            value={this.state.outlinedDense}
            onChangeText={outlinedDense => this.setState({ outlinedDense })}
          />
          <TextInput
            mode="outlined"
            style={styles.inputContainerStyle}
            label="Outlined input multiline"
            multiline
            placeholder="Type something"
            value={this.state.outlinedMultiline}
            onChangeText={outlinedMultiline =>
              this.setState({ outlinedMultiline })
            }
          />
          <TextInput
            mode="outlined"
            style={[styles.inputContainerStyle, styles.textArea]}
            label="Outlined input text area"
            multiline
            placeholder="Type something"
            value={this.state.outlinedTextArea}
            onChangeText={outlinedTextArea =>
              this.setState({ outlinedTextArea })
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
              value={this.state.name}
              error={!this._isUsernameValid(this.state.name)}
              onChangeText={name => this.setState({ name })}
            />
            <HelperText
              type="info"
              visible={!this._isUsernameValid(this.state.name)}
            >
              Error: Only letters are allowed
            </HelperText>
          </View>
          <View style={styles.inputContainerStyle}>
            <TextInput
              label="Input with helper text and character counter"
              placeholder="Enter username, only letters"
              value={this.state.maxLengthName}
              error={!this._isUsernameValid(this.state.maxLengthName)}
              onChangeText={maxLengthName => this.setState({ maxLengthName })}
              maxLength={MAX_LENGTH}
            />
            <View style={styles.helpersWrapper}>
              <HelperText
                type="error"
                visible={!this._isUsernameValid(this.state.maxLengthName)}
                style={styles.helper}
              >
                Error: Numbers and special characters are not allowed
              </HelperText>
              <HelperText type="info" visible style={styles.counterHelper}>
                {this.state.maxLengthName.length} / {MAX_LENGTH}
              </HelperText>
            </View>
          </View>
          <View style={styles.inputContainerStyle}>
            <TextInput
              label="Input with no padding"
              style={{ backgroundColor: 'transparent', paddingHorizontal: 0 }}
              placeholder="Enter username, only letters"
              value={this.state.nameNoPadding}
              error={!this._isUsernameValid(this.state.nameNoPadding)}
              onChangeText={nameNoPadding => this.setState({ nameNoPadding })}
            />
            <HelperText
              type="error"
              padding="none"
              visible={!this._isUsernameValid(this.state.nameNoPadding)}
            >
              Error: Only letters are allowed
            </HelperText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

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
    fontSize: 32,
  },
  textArea: {
    height: 80,
  },
});

export default withTheme(TextInputExample);
