import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { BrowserOnly } from '@rspress/core/runtime';
import {
  Button,
  Chip,
  DarkTheme,
  Divider,
  LightTheme,
  Provider,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import LandingSection, { asset } from './LandingSection';

// The original sample referenced a non-existent `TouchableWithNativeFeedback`
// and was missing a comma in the StyleSheet object; both corrected here.
const standardReact = `const Touchable = Platform.OS === 'ios'
  ? TouchableOpacity
  : TouchableNativeFeedback;

const Button = ({ onPress }) => (
  <Touchable
    style={styles.button}
    onPress={onPress}
  >
    <Text style={styles.text}>Press me</Text>
  </Touchable>
);

const styles = StyleSheet.create({
  button: {
    // Styles here
  },
  text: {
    // Styles here
  },
});`;

const withPaper = `<Button onPress={onPress}>Press me</Button>`;

const snippet = `<View style={customStyle.box}>
  <Text variant="headlineSmall">
    Sign up to our newsletter!
  </Text>
  <Text variant="labelLarge">
    Get a monthly dose of fresh React Native
    Paper news straight to your mailbox. Just
    sign up to our newsletter and enjoy!
  </Text>
  <Divider />
  <Chip
    onPress={toggleTheme}
    selected={isDarkTheme}
  >
    Dark theme
  </Chip>
  <Divider />
  <TextInput
    label="Outlined input"
    variant="outlined"
  />
  <TextInput label="Flat input" />
  <Button
    icon="send"
    mode="contained"
    onPress={toggleSnack}
  >
    Sign me up
  </Button>
</View>`;

const styles = StyleSheet.create({
  box: {
    padding: 24,
    borderWidth: 1,
    borderRadius: 16,
    gap: 16,
  },
  placeholder: {
    minHeight: 480,
  },
  stack: {
    gap: 16,
  },
  themeToggle: {
    alignSelf: 'flex-start',
  },
});

const Demo = () => {
  const theme = useTheme();
  const [showSnack, setShowSnack] = React.useState(false);

  const toggleSnack = () => setShowSnack((visible) => !visible);

  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.surfaceVariant,
        },
      ]}
    >
      <Text variant="headlineSmall">Sign up to our newsletter!</Text>
      <Text variant="labelLarge">
        Get a monthly dose of fresh React Native Paper news straight to your
        mailbox. Just sign up to our newsletter and enjoy!
      </Text>
      <Divider />
      <TextInput label="Outlined input" variant="outlined" />
      <TextInput label="Flat input" />
      <Button icon="send" mode="contained" onPress={toggleSnack}>
        Sign me up
      </Button>
      <Snackbar
        visible={showSnack}
        onDismiss={toggleSnack}
        action={{ label: 'Dismiss', onPress: toggleSnack }}
        duration={Snackbar.DURATION_LONG}
      >
        Hey there! I&apos;m a Snackbar.
      </Snackbar>
    </View>
  );
};

const ThemedDemo = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  return (
    <Provider theme={isDarkTheme ? DarkTheme : LightTheme}>
      <View style={styles.stack}>
        <View style={styles.themeToggle}>
          <Chip
            onPress={() => setIsDarkTheme((value) => !value)}
            selected={isDarkTheme}
          >
            Dark theme
          </Chip>
        </View>
        <Demo />
      </View>
    </Provider>
  );
};

export default function LandingCode() {
  return (
    <LandingSection className="landing-code">
      <h2 className="landing-heading">
        Achieve more
        <br />
        in less time
      </h2>
      <p className="landing-body landing-code__lede">
        Don&apos;t waste your time writing complex components from scratch.
      </p>

      <div className="landing-code__grid">
        <div>
          <h2 className="landing-code__label">Standard React code</h2>
          <pre className="landing-code__block">
            <code>{standardReact}</code>
          </pre>
        </div>
        <div>
          <h2 className="landing-code__label">With react-native-paper</h2>
          <pre className="landing-code__block">
            <code>{withPaper}</code>
          </pre>
        </div>
      </div>

      <p className="landing-code__footnote">
        <img alt="point up emoji" src={asset('images/finger.svg')} />
        <span>
          Interactions, animations and accessibility. React-native-paper takes
          care of the details and your UI logic, so you can focus on your users.
        </span>
      </p>

      <h2 className="landing-heading landing-code__live-heading">
        Try it <span>live</span>!
      </h2>
      <p className="landing-body landing-code__lede">
        Try our live demo and check it out for yourself! When you are done, make
        sure to copy the code and drop it straight into a React Native app! Yes,
        Paper is cross-platform and works on both web and mobile.
      </p>

      <div className="landing-editor">
        <pre className="landing-code__block">
          <code>{snippet}</code>
        </pre>
        <div className="landing-editor__preview">
          <BrowserOnly fallback={<View style={styles.placeholder} />}>
            {() => <ThemedDemo />}
          </BrowserOnly>
        </div>
      </div>
    </LandingSection>
  );
}
