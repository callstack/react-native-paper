import * as React from 'react';
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

import { grayTheme } from './editorTheme';
import LandingCodeSnippet from './LandingCodeSnippet';
import LandingSection, { asset, docsHref } from './LandingSection';
import { prepareThemes } from '../../utils/themes';

// The original sample referenced a non-existent `TouchableWithNativeFeedback`
// and was missing a comma in the StyleSheet object; both corrected here.
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

const withPaper = `
<Button onPress={onPress}>
  Press me
</Button>

`;

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

/**
 * The source's second chip switches the demo between MD2 and MD3. Paper 6
 * renders MD3 components only, so the chip switches the palette instead:
 * on, a Material You scheme derived from the page's own purple; off, the MD2
 * colours the source hands its editor (`#6200ee` light, `#64DAC5` dark).
 * Component shapes stay MD3 either way - that part needs Paper 5.
 */
const materialYouColors = prepareThemes({ primary: '#21005d' });

const md2Colors = {
  light: {
    primary: '#6200ee',
    onPrimary: '#ffffff',
    secondary: '#03dac4',
    secondaryContainer: '#e0e0e0',
    onSecondaryContainer: 'rgba(0, 0, 0, 0.87)',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceVariant: '#f0f0f0',
    surfaceContainerHighest: '#f0f0f0',
    onSurface: 'rgba(0, 0, 0, 0.87)',
    onSurfaceVariant: 'rgba(0, 0, 0, 0.54)',
    outline: 'rgba(0, 0, 0, 0.38)',
  },
  dark: {
    primary: '#64dac5',
    onPrimary: '#000000',
    secondary: '#64dac5',
    secondaryContainer: '#3a3a3a',
    onSecondaryContainer: '#ffffff',
    background: '#202c32',
    surface: '#202c32',
    surfaceVariant: '#2b383f',
    surfaceContainerHighest: '#2b383f',
    onSurface: '#ffffff',
    onSurfaceVariant: '#aaaaaa',
    outline: 'rgba(255, 255, 255, 0.38)',
  },
};

/**
 * MD2 squared most surfaces off at 4dp and kept chips as 16dp pills, where
 * MD3 rounds everything much further. `TextInput`'s radius is a constant in
 * Paper 6 rather than a token, so the fields stay MD3-round either way.
 */
/**
 * MD2 fills its Appbar with the primary colour in both modes and picks the
 * contrasting content colour: white on the light theme's `#6200ee`, black on
 * the dark theme's `#64DAC5`.
 */
const md2OnAppbar = '#ffffff';
const md2OnAppbarMuted = 'rgba(255, 255, 255, 0.7)';
const md2OnAppbarDark = '#000000';
const md2OnAppbarDarkMuted = 'rgba(0, 0, 0, 0.7)';

const md2AppbarContent = (isDarkTheme: boolean) =>
  isDarkTheme ? md2OnAppbarDark : md2OnAppbar;

const md2Corners = {
  extraSmall: 4,
  small: 16,
  medium: 4,
  large: 4,
  largeIncreased: 4,
  extraLarge: 4,
  extraLargeIncreased: 4,
  extraExtraLarge: 4,
};

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
  md2Appbar: {
    backgroundColor: md2Colors.light.primary,
  },
  md2AppbarDark: {
    backgroundColor: md2Colors.dark.primary,
  },
  // The preset's `body *` would stretch these to 1.5; MD2 runs them at 24/16.
  // MD2's `Title` is 20px where Paper 6's closest variant, titleLarge, is 22.
  md2Heading: {
    fontSize: 20,
  },
  md2Title: {
    color: md2OnAppbar,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '500',
  },
  md2TitleDark: {
    color: md2OnAppbarDark,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '500',
  },
  md2Subtitle: {
    color: md2OnAppbarMuted,
    fontSize: 14,
    lineHeight: 16,
  },
  md2SubtitleDark: {
    color: md2OnAppbarDarkMuted,
    fontSize: 14,
    lineHeight: 16,
  },
});

type DemoProps = {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  isMaterialYou: boolean;
  onToggleMaterialYou: () => void;
};

const Demo = ({
  isDarkTheme,
  onToggleTheme,
  isMaterialYou,
  onToggleMaterialYou,
}: DemoProps) => {
  const theme = useTheme();
  const [showSnack, setShowSnack] = React.useState(false);

  const toggleSnack = () => setShowSnack((visible) => !visible);

  return (
    <View>
      {/* `statusBarHeight: 47` leaves the frame's notch clear of the title. */}
      <Appbar.Header
        statusBarHeight={47}
        style={
          isMaterialYou
            ? undefined
            : isDarkTheme
              ? styles.md2AppbarDark
              : styles.md2Appbar
        }
      >
        <Appbar.Content
          color={isMaterialYou ? undefined : md2AppbarContent(isDarkTheme)}
          title={
            isMaterialYou ? (
              'react-native-paper'
            ) : (
              <View>
                <Text
                  style={isDarkTheme ? styles.md2TitleDark : styles.md2Title}
                >
                  react-native-paper
                </Text>
                <Text
                  style={
                    isDarkTheme ? styles.md2SubtitleDark : styles.md2Subtitle
                  }
                >
                  Read more in the docs
                </Text>
              </View>
            )
          }
        />
        <Appbar.Action
          color={isMaterialYou ? undefined : md2AppbarContent(isDarkTheme)}
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
          <Text
            style={isMaterialYou ? undefined : styles.md2Heading}
            variant={isMaterialYou ? 'headlineSmall' : 'titleLarge'}
          >
            Sign up to our newsletter!
          </Text>
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
            <Chip
              onPress={onToggleMaterialYou}
              selected={isMaterialYou}
              style={styles.chip}
            >
              Material You
            </Chip>
          </View>
          <Divider />
          <View style={styles.field}>
            <TextInput label="Outlined input" variant="outlined" />
          </View>
          <View style={styles.field}>
            <TextInput label="Flat input" />
          </View>
          <Button
            icon="send"
            mode="contained"
            onPress={toggleSnack}
            style={styles.field}
            uppercase={!isMaterialYou}
          >
            Sign me up
          </Button>
        </View>
      </ScrollView>
      {/* Anchored to the outer View rather than the scroll content: the
          source's container carries `marginBottom: -30`, so the box the
          Snackbar sits at the bottom of is 681px, not the 600px viewport. */}
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
  const [isMaterialYou, setIsMaterialYou] = React.useState(true);

  const base = isDarkTheme ? DarkTheme : LightTheme;
  const palette = isMaterialYou ? materialYouColors : md2Colors;
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      ...(isDarkTheme ? palette.dark : palette.light),
    },
    shapes: isMaterialYou
      ? base.shapes
      : { ...base.shapes, corner: { ...base.shapes.corner, ...md2Corners } },
  };

  return (
    <Provider theme={theme}>
      <Demo
        isDarkTheme={isDarkTheme}
        isMaterialYou={isMaterialYou}
        onToggleMaterialYou={() => setIsMaterialYou((value) => !value)}
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
            <LandingCodeSnippet code={standardReact} theme={grayTheme} />
          </pre>
        </div>
        <div className="c16bevq1">
          <h2>With react-native-paper</h2>
          <pre className="c11ps6c6">
            <LandingCodeSnippet code={withPaper} />
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
              <LandingCodeSnippet code={snippet} numbered />
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
