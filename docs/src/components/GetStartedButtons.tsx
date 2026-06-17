import { useColorMode } from '../rspress-compat/theme-common';

const baseButtonStyle = {
  alignItems: 'center',
  borderRadius: '999px',
  borderStyle: 'solid',
  borderWidth: '1px',
  display: 'inline-flex',
  fontSize: '0.95rem',
  fontWeight: 600,
  justifyContent: 'center',
  minHeight: '2.75rem',
  padding: '0 1.25rem',
  textDecoration: 'none',
  transition: 'transform 120ms ease, background-color 120ms ease',
};

export default function GetStartedButtons() {
  const isDarkTheme = useColorMode().colorMode === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        paddingBottom: '1rem',
      }}
    >
      <a
        href="/docs/guides/getting-started"
        style={{
          ...baseButtonStyle,
          backgroundColor: isDarkTheme ? '#d0bcff' : '#6750a4',
          borderColor: isDarkTheme ? '#d0bcff' : '#6750a4',
          color: isDarkTheme ? '#1d192b' : '#ffffff',
        }}
      >
        Get started
      </a>
      <a
        href="https://snack.expo.dev/@react-native-paper/react-native-paper-example_v5"
        target="_blank"
        rel="noreferrer"
        style={{
          ...baseButtonStyle,
          backgroundColor: 'transparent',
          borderColor: isDarkTheme ? '#938f99' : '#79747e',
          color: isDarkTheme ? '#e6e1e5' : '#49454f',
        }}
      >
        Try on Snack
      </a>
    </div>
  );
}
