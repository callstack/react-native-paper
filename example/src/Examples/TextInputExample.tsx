import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFonts } from 'expo-font';
import {
  configureFonts,
  HelperText,
  List,
  MD2Colors,
  MD3Colors,
  TextInput,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useExampleTheme } from '..';
import { inputReducer, State } from '../../utils';
import ScreenWrapper from '../ScreenWrapper';

const MAX_LENGTH = 20;

const initialState: State = {
  text: '',
  customIconText: '',
  name: '',
  outlinedText: '',
  largeText: '',
  flatTextPassword: 'Password',
  outlinedLargeText: '',
  outlinedCustomLabel: '',
  outlinedTextPassword: '',
  nameNoPadding: '',
  customStyleText: '',
  nameRequired: '',
  flatDenseText: '',
  flatDense: '',
  outlinedDenseText: '',
  outlinedDense: '',
  flatMultiline: '',
  flatTextArea: '',
  flatUnderlineColors: '',
  outlinedMultiline: '',
  outlinedTextArea: '',
  outlinedColors: '',
  outlinedLongLabel: '',
  maxLengthName: '',
  flatTextSecureEntry: true,
  outlineTextSecureEntry: true,
  iconsColor: {
    flatLeftIcon: undefined,
    flatRightIcon: undefined,
    outlineLeftIcon: undefined,
    outlineRightIcon: undefined,
    customIcon: undefined,
  },
};

type AvoidingViewProps = {
  children: React.ReactNode;
};

type ExpandedId = string | number | undefined;

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
    customIconText,
    name,
    outlinedText,
    largeText,
    flatTextPassword,
    outlinedLargeText,
    outlinedCustomLabel,
    outlinedTextPassword,
    nameNoPadding,
    customStyleText,
    nameRequired,
    flatDenseText,
    flatDense,
    outlinedDenseText,
    outlinedDense,
    flatMultiline,
    flatTextArea,
    flatUnderlineColors,
    outlinedMultiline,
    outlinedTextArea,
    outlinedColors,
    maxLengthName,
    flatTextSecureEntry,
    outlineTextSecureEntry,
    iconsColor: {
      flatLeftIcon,
      flatRightIcon,
      outlineLeftIcon,
      outlineRightIcon,
      customIcon,
    },
  } = state;

  const _isUsernameValid = (name: string) => /^[a-zA-Z]*$/.test(name);

  const theme = useExampleTheme();

  const inputActionHandler = (type: keyof State, payload: string) =>
    dispatch({
      type: type,
      payload: payload,
    });

  const changeIconColor = (name: keyof State['iconsColor']) => {
    const color = state.iconsColor[name];

    const newColors = {
      ...state.iconsColor,
      [name]: !color
        ? theme.isV3
          ? theme.colors.primary
          : theme.colors?.accent
        : undefined,
    };

    dispatch({
      type: 'iconsColor',
      payload: newColors,
    });
  };

  const [fontsLoaded] = useFonts({
    Abel: require('../../assets/fonts/Abel-Regular.ttf'),
  });

  const [expandedId, setExpandedId] = React.useState<ExpandedId>('flat');

  const onAccordionPress = (id: string | number) =>
    setExpandedId(expandedId === id ? undefined : id);

  return (
    <TextInputAvoidingView>
      <ScreenWrapper
        keyboardShouldPersistTaps={'always'}
        removeClippedSubviews={false}
      >
        <List.AccordionGroup
          expandedId={expandedId}
          onAccordionPress={onAccordionPress}
        >
          <List.Accordion title="Flat inputs" id="flat">
            <TextInput
              style={styles.inputContainerStyle}
              label="Flat input"
              placeholder="Type something"
              value={text}
              onChangeText={(text) => inputActionHandler('text', text)}
              left={
                <TextInput.Icon
                  icon="magnify"
                  color={flatLeftIcon}
                  onPress={() => {
                    changeIconColor('flatLeftIcon');
                  }}
                />
              }
              maxLength={100}
              right={<TextInput.Affix text={`${text.length}/100`} />}
            />
            <TextInput
              style={styles.inputContainerStyle}
              label="Flat input with custom icon"
              placeholder="Type something"
              value={customIconText}
              onChangeText={(text) =>
                inputActionHandler('customIconText', text)
              }
              maxLength={100}
              right={<TextInput.Affix text={`${customIconText.length}/100`} />}
              left={
                <TextInput.Icon
                  icon={() => (
                    <Icon
                      name="home"
                      size={24}
                      color={customIcon}
                      onPress={() => {
                        changeIconColor('customIcon');
                      }}
                    />
                  )}
                />
              }
            />
            <TextInput
              style={[styles.inputContainerStyle, styles.fontSize]}
              label="Flat input large font"
              placeholder="Type something"
              value={largeText}
              onChangeText={(largeText) =>
                inputActionHandler('largeText', largeText)
              }
              left={<TextInput.Affix text="#" />}
              right={
                <TextInput.Icon
                  icon="magnify"
                  color={flatRightIcon}
                  onPress={() => {
                    changeIconColor('flatRightIcon');
                  }}
                />
              }
            />
            <TextInput
              style={[styles.inputContainerStyle, styles.fontSize]}
              label="Flat input large font"
              placeholder="Type something"
              value={flatTextPassword}
              onChangeText={(flatTextPassword) =>
                inputActionHandler('flatTextPassword', flatTextPassword)
              }
              secureTextEntry={flatTextSecureEntry}
              right={
                <TextInput.Icon
                  icon={flatTextSecureEntry ? 'eye' : 'eye-off'}
                  onPress={() =>
                    dispatch({
                      type: 'flatTextSecureEntry',
                      payload: !flatTextSecureEntry,
                    })
                  }
                  forceTextInputFocus={false}
                />
              }
            />
          </List.Accordion>
          <List.Accordion title="Outlined inputs" id="outlined">
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Outlined input"
              placeholder="Type something"
              value={outlinedText}
              onChangeText={(outlinedText) =>
                inputActionHandler('outlinedText', outlinedText)
              }
              left={
                <TextInput.Icon
                  icon="magnify"
                  color={outlineLeftIcon}
                  onPress={() => {
                    changeIconColor('outlineLeftIcon');
                  }}
                />
              }
              maxLength={100}
              right={<TextInput.Affix text={`${outlinedText.length}/100`} />}
            />
            <TextInput
              mode="outlined"
              style={[styles.inputContainerStyle, styles.fontSize]}
              label="Outlined large font"
              placeholder="Type something"
              value={outlinedLargeText}
              onChangeText={(outlinedLargeText) =>
                inputActionHandler('outlinedLargeText', outlinedLargeText)
              }
              left={<TextInput.Affix text="$" />}
              right={
                <TextInput.Icon
                  icon="magnify"
                  color={outlineRightIcon}
                  onPress={() => {
                    changeIconColor('outlineRightIcon');
                  }}
                />
              }
            />
            <TextInput
              mode="outlined"
              style={[styles.inputContainerStyle, styles.fontSize]}
              label={<Text style={styles.inputLabelText}>Custom label</Text>}
              placeholder="Type something"
              value={outlinedCustomLabel}
              onChangeText={(outlinedCustomLabel) =>
                inputActionHandler('outlinedCustomLabel', outlinedCustomLabel)
              }
            />
            <TextInput
              mode="outlined"
              style={[styles.inputContainerStyle, styles.fontSize]}
              label="Outlined large font"
              placeholder="Type something"
              value={outlinedTextPassword}
              onChangeText={(outlinedTextPassword) =>
                inputActionHandler('outlinedTextPassword', outlinedTextPassword)
              }
              secureTextEntry={outlineTextSecureEntry}
              right={
                <TextInput.Icon
                  icon={outlineTextSecureEntry ? 'eye' : 'eye-off'}
                  onPress={() =>
                    dispatch({
                      type: 'outlineTextSecureEntry',
                      payload: !outlineTextSecureEntry,
                    })
                  }
                />
              }
            />
          </List.Accordion>
          <List.Accordion title="Disabled inputs" id="disabled">
            <TextInput
              disabled
              style={styles.inputContainerStyle}
              label="Disabled flat input"
            />
            <TextInput
              disabled
              style={styles.inputContainerStyle}
              label="Disabled flat input with value"
              value="Disabled flat input value"
            />
            <TextInput
              style={styles.inputContainerStyle}
              label="Flat input"
              disabled
              value="Disabled flat input with adornments"
              left={
                <TextInput.Icon
                  icon="magnify"
                  color={flatLeftIcon}
                  onPress={() => {
                    changeIconColor('flatLeftIcon');
                  }}
                />
              }
              right={<TextInput.Affix text="/100" />}
            />
            <TextInput
              mode="outlined"
              disabled
              style={styles.inputContainerStyle}
              label="Disabled outlined input"
            />
            <TextInput
              mode="outlined"
              disabled
              style={styles.inputContainerStyle}
              label="Disabled outlined input"
              value="Disabled outlined input with value"
            />
            <TextInput
              style={styles.inputContainerStyle}
              label="Flat input"
              disabled
              mode="outlined"
              value="Disabled flat input with adornments"
              left={
                <TextInput.Icon
                  icon="magnify"
                  color={flatLeftIcon}
                  onPress={() => {
                    changeIconColor('flatLeftIcon');
                  }}
                />
              }
              right={<TextInput.Affix text="/100" />}
            />
          </List.Accordion>
          <List.Accordion title="Dense inputs" id="dense">
            <TextInput
              style={styles.inputContainerStyle}
              dense
              label="Dense flat input"
              placeholder="Type something"
              value={flatDenseText}
              onChangeText={(flatDenseText) =>
                inputActionHandler('flatDenseText', flatDenseText)
              }
              left={<TextInput.Affix text="#" />}
              right={
                <TextInput.Icon
                  icon="chevron-up"
                  color={(focused) =>
                    focused ? theme.colors?.primary : undefined
                  }
                />
              }
            />
            <TextInput
              style={styles.inputContainerStyle}
              dense
              placeholder="Dense flat input without label"
              value={flatDense}
              onChangeText={(flatDense) =>
                inputActionHandler('flatDense', flatDense)
              }
            />
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              dense
              label="Dense outlined input"
              placeholder="Type something"
              value={outlinedDenseText}
              onChangeText={(outlinedDenseText) =>
                inputActionHandler('outlinedDenseText', outlinedDenseText)
              }
              left={<TextInput.Affix text="$" />}
            />
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              dense
              placeholder="Dense outlined input without label"
              value={outlinedDense}
              onChangeText={(outlinedDense) =>
                inputActionHandler('outlinedDense', outlinedDense)
              }
            />
          </List.Accordion>
          <List.Accordion title="Multiline inputs" id="multiline">
            <TextInput
              style={styles.inputContainerStyle}
              label="Flat input multiline"
              multiline
              placeholder="Type something"
              value={flatMultiline}
              onChangeText={(flatMultiline) =>
                inputActionHandler('flatMultiline', flatMultiline)
              }
            />
            <TextInput
              style={[styles.inputContainerStyle, styles.textArea]}
              label="Flat input text area"
              multiline
              placeholder="Type something"
              value={flatTextArea}
              onChangeText={(flatTextArea) =>
                inputActionHandler('flatTextArea', flatTextArea)
              }
            />
            <View style={styles.inputContainerStyle}>
              <TextInput
                mode="flat"
                label="Flat multiline text input with fixed height"
                multiline
                style={styles.fixedHeight}
              />
            </View>
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Outlined input multiline"
              multiline
              placeholder="Type something"
              value={outlinedMultiline}
              onChangeText={(outlinedMultiline) =>
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
              onChangeText={(outlinedTextArea) =>
                inputActionHandler('outlinedTextArea', outlinedTextArea)
              }
            />
            <View style={styles.inputContainerStyle}>
              <TextInput
                mode="outlined"
                label="Outlined multiline text input with fixed height"
                multiline
                style={styles.fixedHeight}
              />
            </View>
          </List.Accordion>
          <List.Accordion title="Inputs with helpers" id="withAddons">
            <View style={styles.inputContainerStyle}>
              <TextInput
                label="Input with helper text"
                placeholder="Enter username, only letters"
                value={name}
                error={!_isUsernameValid(name)}
                onChangeText={(name) => inputActionHandler('name', name)}
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
                onChangeText={(maxLengthName) =>
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
                label={
                  <Text>
                    <Text
                      style={{
                        color: theme.isV3
                          ? MD3Colors.error50
                          : MD2Colors.red500,
                      }}
                    >
                      *
                    </Text>{' '}
                    Label as component
                  </Text>
                }
                style={styles.noPaddingInput}
                placeholder="Enter username, required"
                value={nameRequired}
                error={!nameRequired}
                onChangeText={(nameRequired) =>
                  inputActionHandler('nameRequired', nameRequired)
                }
              />
              <HelperText type="error" padding="none" visible={!nameRequired}>
                Error: Username is required
              </HelperText>
            </View>
          </List.Accordion>
          <List.Accordion title="Custom inputs" id="custom">
            <TextInput
              style={styles.inputContainerStyle}
              label="Flat input with custom underline colors"
              placeholder="Type something"
              value={flatUnderlineColors}
              onChangeText={(flatUnderlineColors) =>
                inputActionHandler('flatUnderlineColors', flatUnderlineColors)
              }
              underlineColor={
                theme.isV3 ? MD3Colors.primary70 : MD2Colors.pink400
              }
              activeUnderlineColor={
                theme.isV3 ? MD3Colors.tertiary50 : MD2Colors.amber900
              }
            />
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Outlined input with custom outline colors"
              placeholder="Type something"
              value={outlinedColors}
              onChangeText={(outlinedColors) =>
                inputActionHandler('outlinedColors', outlinedColors)
              }
              outlineColor={
                theme.isV3 ? MD3Colors.primary70 : MD2Colors.pink400
              }
              activeOutlineColor={
                theme.isV3 ? MD3Colors.tertiary50 : MD2Colors.amber900
              }
            />
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Outlined with super long label which is truncating at some point"
              placeholder="Type something"
              onChangeText={(outlinedLongLabel) =>
                inputActionHandler('outlinedLongLabel', outlinedLongLabel)
              }
            />

            <TextInput
              mode="flat"
              style={styles.inputContainerStyle}
              label="Custom style input"
              placeholder="Input with custom style"
              value={customStyleText}
              onChangeText={(customStyleText) =>
                inputActionHandler('customStyleText', customStyleText)
              }
              contentStyle={styles.inputContentStyle}
            />

            <View style={styles.inputContainerStyle}>
              <TextInput
                label="Input with no padding"
                style={styles.noPaddingInput}
                placeholder="Enter username, only letters"
                value={nameNoPadding}
                error={!_isUsernameValid(nameNoPadding)}
                onChangeText={(nameNoPadding) =>
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

            <View style={styles.inputContainerStyle}>
              <TextInput
                label="Input with text align center"
                style={styles.centeredText}
                activeUnderlineColor="transparent"
              />
            </View>
            <View style={styles.inputContainerStyle}>
              <TextInput
                mode="outlined"
                label="Outlined input with text align center"
                style={styles.centeredText}
              />
            </View>
            <View style={styles.inputContainerStyle}>
              <TextInput
                mode="outlined"
                theme={{
                  roundness: 25,
                }}
                label="Outlined text input with custom roundness"
              />
            </View>
            <View style={styles.inputContainerStyle}>
              <TextInput
                mode="outlined"
                label="Outlined text input without roundness"
                theme={{ roundness: 0 }}
              />
            </View>
            <View style={styles.inputContainerStyle}>
              <TextInput
                mode="outlined"
                label="Outlined text input with error"
                error
              />
            </View>
            <View style={styles.inputContainerStyle}>
              <TextInput mode="outlined" placeholder="Outlined without label" />
            </View>
            <View style={styles.inputContainerStyle}>
              <TextInput
                mode="outlined"
                label="Outlined input with custom cursor and selection colors"
                selectionColor={'rgba(0,255,1,0.5)'}
                cursorColor={'rgba(255,1,1,1)'}
                placeholderTextColor={'rgba(255,0,125,1)'}
                placeholder="Custom colors"
              />
            </View>
            <View style={styles.inputContainerStyle}>
              <TextInput
                label="Flat input with custom cursor and selection colors"
                selectionColor={'rgba(0,255,1,0.5)'}
                cursorColor={'rgba(255,1,1,1)'}
                placeholderTextColor={'rgba(255,0,125,1)'}
                placeholder="Custom colors"
              />
            </View>
            {fontsLoaded && theme.isV3 ? (
              <View style={styles.inputContainerStyle}>
                <TextInput
                  mode="outlined"
                  label="Text input with custom font"
                  placeholder="Custom font"
                  style={styles.fontSize}
                  theme={{
                    fonts: configureFonts({
                      config: {
                        fontFamily: 'Abel',
                      },
                    }),
                  }}
                />
              </View>
            ) : null}
            <View style={styles.row}>
              <TextInput
                mode="outlined"
                label="CVV"
                placeholder="CVV"
                keyboardType="phone-pad"
                maxLength={3}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                mode="flat"
                label="CVV"
                placeholder="CVV"
                keyboardType="phone-pad"
                maxLength={3}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                mode="outlined"
                label="Code"
                placeholder="Code"
                keyboardType="phone-pad"
                maxLength={4}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                mode="flat"
                label="Code"
                placeholder="Code"
                keyboardType="phone-pad"
                maxLength={4}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                mode="flat"
                label="Month"
                placeholder="Month"
                style={styles.month}
              />
              <TextInput
                mode="flat"
                label="Year"
                placeholder="Year"
                keyboardType="phone-pad"
                style={styles.year}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.left}>
                <TextInput
                  mode="flat"
                  label="Month of the car registration (optional)"
                  placeholder="Month"
                  style={styles.month}
                />
              </View>
              <View style={styles.right}>
                <TextInput
                  mode="flat"
                  label="Year of the car registration (optional)"
                  placeholder="Year"
                  keyboardType="phone-pad"
                  style={styles.year}
                  left={<TextInput.Icon icon="calendar" />}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.left}>
                <TextInput
                  mode="outlined"
                  label="Month of the car registration (optional)"
                  placeholder="Month"
                  style={styles.month}
                />
              </View>
              <View style={styles.right}>
                <TextInput
                  mode="outlined"
                  label="Year of the car registration (optional)"
                  placeholder="Year"
                  keyboardType="phone-pad"
                  style={styles.year}
                  right={<TextInput.Icon icon="calendar" />}
                />
              </View>
            </View>
          </List.Accordion>
        </List.AccordionGroup>
      </ScreenWrapper>
    </TextInputAvoidingView>
  );
};

TextInputExample.title = 'TextInput';

const styles = StyleSheet.create({
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
  inputContentStyle: {
    paddingLeft: 50,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  fontSize: {
    fontSize: 32,
  },
  textArea: {
    height: 80,
  },
  // eslint-disable-next-line react-native/no-color-literals
  noPaddingInput: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  centeredText: {
    textAlign: 'center',
  },
  fixedHeight: {
    height: 100,
  },
  row: {
    margin: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  month: {
    flex: 1,
    marginRight: 4,
  },
  year: {
    flex: 1,
    marginLeft: 4,
  },
  inputLabelText: {
    color: MD3Colors.tertiary70,
  },
  left: {
    width: '30%',
  },
  right: {
    width: '70%',
  },
});

export default TextInputExample;
