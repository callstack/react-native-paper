import * as React from 'react';
import type { CSSProperties } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import { BrowserOnly } from '@rspress/core/runtime';
import {
  Appbar,
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

import LandingSection, { asset, docsHref } from './LandingSection';

// The original sample referenced a non-existent `TouchableWithNativeFeedback`
// and was missing a comma in the StyleSheet object; both corrected here.
/**
 * editorTheme.plain from the source, which prism-react-renderer applies as an
 * inline style rather than through a class, plus CodeSnippet's own padding.
 */
const codePlain: CSSProperties = {
  backgroundColor: '#202C32',
  color: 'rgb(170, 176, 179)',
  whiteSpace: 'break-spaces',
  borderRadius: 5,
  fontSize: '16px',
  padding: 20,
  overflowY: 'auto',
  margin: 0,
};

const standardReact = `
const Touchable = Platform.OS === 'ios' ?
  TouchableOpacity :
  TouchableNativeFeedback

const Button = ({ onPress }) =>
  <Touchable
    style={styles.button}
    onPress={onPress}
  >
    <Text style={styles.text}>
      Press me
    </Text>
  </Touchable>

const styles = StyleSheet.create({
  button: {
    // Styles here
  },
  text: {
    // Styles here
  }
});

`;

/**
 * The Paper snippet is the only syntax-coloured panel in the source; the
 * standard-React one uses grayTheme and stays monochrome. Rendered as spans so
 * the landing page does not need a syntax-highlighting dependency.
 */
const withPaper = (
  <>
    {'\n'}
    <span className="tok-tag">&lt;Button</span>{' '}
    <span className="tok-attr">onPress</span>=
    <span className="tok-value">{'{onPress}'}</span>
    <span className="tok-tag">&gt;</span>
    {'\n  Press me\n'}
    <span className="tok-tag">&lt;/Button&gt;</span>
    {'\n\n'}
  </>
);

const snippet = `<View style={ customStyle.box }>
  <Text variant='headlineSmall'>
    Sign up to our newsletter!
  </Text>
  <Text variant='labelLarge'>
    Get a monthly dose of fresh React Native Paper news straight to your mailbox. Just sign up to our newsletter and enjoy!
  </Text>
  <Divider />
  <View style={ customStyle.row }>
  <Chip
    onPress={
      toggleTheme
    }
    style={{ marginRight: 8 }}
    selected={ isDarkTheme }
  >
    Dark theme
  </Chip>
  <Chip
    onPress={
     toggleMD3
    }
    style={{ marginRight: 8 }}
    selected={ isV3 }
  >
    Material You
  </Chip>
  </View>
  <Divider />
  <TextInput
    style={{ marginTop: 15 }}
    label='Outlined input'
    mode='outlined'
  />
  <TextInput
    style={{ marginTop: 15 }}
    label='Flat input'
    mode='flat'
  />
  <Button
    style={{ marginTop: 15 }}
    icon='send'
    mode='contained'
    onPress={ toggleSnack }
  >
    Sign me up
  </Button>
</View>
<Snackbar
  visible={ showSnack }
  onDismiss={ toggleSnack }
  action={{
    label: 'Dismiss',
    onPress: () => {
      // Do side magic
    },
  }}
  duration={
    Snackbar.DURATION_LONG
  }
>
  Hey there! I'm a Snackbar.
</Snackbar>`;

// `customStyle` and the transformCode wrapper from the source's exampleCode.js.
const styles = StyleSheet.create({
  box: {
    padding: 15,
  },
  row: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'row',
  },
  field: {
    marginTop: 15,
  },
  chip: {
    marginRight: 8,
  },
  // The ScrollContainer the source nests under the Appbar: a fixed 600px
  // viewport, so the demo scrolls inside the phone instead of overflowing it.
  scroll: {
    height: 600,
    marginBottom: -30,
  },
  placeholder: {
    minHeight: 480,
  },
});

type DemoProps = { isDarkTheme: boolean; onToggleTheme: () => void };

const Demo = ({ isDarkTheme, onToggleTheme }: DemoProps) => {
  const theme = useTheme();
  const [showSnack, setShowSnack] = React.useState(false);

  const toggleSnack = () => setShowSnack((visible) => !visible);

  return (
    <View>
      {/* `statusBarHeight: 47` leaves the frame's notch clear of the title. */}
      <Appbar.Header statusBarHeight={47}>
        <Appbar.Content title="react-native-paper" />
        <Appbar.Action
          icon="open-in-new"
          onPress={() =>
            void Linking.openURL(docsHref('docs/components/Appbar/'))
          }
        />
      </Appbar.Header>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.box}>
          <Text variant="headlineSmall">Sign up to our newsletter!</Text>
          <Text variant="labelLarge">
            Get a monthly dose of fresh React Native Paper news straight to your
            mailbox. Just sign up to our newsletter and enjoy!
          </Text>
          <Divider />
          <View style={styles.row}>
            <Chip
              onPress={onToggleTheme}
              selected={isDarkTheme}
              style={styles.chip}
            >
              Dark theme
            </Chip>
          </View>
          <Divider />
          <TextInput
            label="Outlined input"
            style={styles.field}
            variant="outlined"
          />
          <TextInput label="Flat input" style={styles.field} />
          <Button
            icon="send"
            mode="contained"
            onPress={toggleSnack}
            style={styles.field}
          >
            Sign me up
          </Button>
        </View>
        <Snackbar
          visible={showSnack}
          onDismiss={toggleSnack}
          action={{ label: 'Dismiss', onPress: toggleSnack }}
          duration={Snackbar.DURATION_LONG}
        >
          Hey there! I&apos;m a Snackbar.
        </Snackbar>
      </ScrollView>
    </View>
  );
};

const ThemedDemo = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  return (
    <Provider theme={isDarkTheme ? DarkTheme : LightTheme}>
      <Demo
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme((value) => !value)}
      />
    </Provider>
  );
};

export default function LandingCode() {
  return (
    <LandingSection variant="shegl68" innerClassName="i1vg0a03">
      <div className="hhlgf0c">
        <h1 className="hn5vo52">
          Achieve more <span>in less time</span>
        </h1>
        <p className="t1ol3fh0">
          Don&apos;t waste your time writing complex components from scratch.
        </p>
      </div>

      <div className="cmn45yp">
        <div className="c1wrkpdf">
          <h2>Standard React code</h2>
          <pre className="c11ps6c6">
            <pre className="seb0k0g" style={codePlain}>
              {standardReact}
            </pre>
          </pre>
        </div>
        <div className="c16bevq1">
          <h2>With react-native-paper</h2>
          <pre className="c11ps6c6">
            <pre className="seb0k0g" style={codePlain}>
              {withPaper}
            </pre>
          </pre>
          <span role="img" aria-label="point up">
            👆
          </span>
          <p>
            Interactions, animations and accessibility.
            <br />
            React-native-paper takes care of the details and your UI logic, so
            you can focus on your users.
          </p>
        </div>
      </div>

      <div className="esf2wzt">
        <div className="landing-editor">
          <div className="landing-editor__col">
            <img
              alt=""
              className="landing-editor__icon"
              src={asset('images/icons/live-icon.svg')}
            />
            <h1 className="hn5vo52 landing-editor__heading">
              Try it <span>live</span>!
            </h1>
            <p className="landing-editor__lede">
              Try our live demo and check it out for yourself! When you are
              done, make sure to copy the code and drop it straight into a React
              Native app! Yes, Paper is cross-platform and works on both web and
              mobile.
            </p>
            <div className="landing-editor__codebox">
              <pre className="landing-editor__code">{snippet}</pre>
            </div>
            <img
              alt=""
              className="landing-editor__ornament"
              src={asset('images/ornament-small.svg')}
            />
          </div>

          <div className="landing-editor__phone">
            <div className="landing-editor__screen">
              <div className="landing-editor__preview">
                <BrowserOnly fallback={<View style={styles.placeholder} />}>
                  {() => <ThemedDemo />}
                </BrowserOnly>
              </div>
            </div>
            <img
              alt=""
              className="landing-editor__frame"
              src={asset('images/ip13.png')}
            />
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
