export default function GetStartedButtons() {
  return (
    <div className="paper-get-started-buttons">
      <a
        href="/docs/guides/getting-started"
        className="paper-get-started-button paper-get-started-button--primary"
      >
        Get started
      </a>
      <a
        href="https://snack.expo.dev/@react-native-paper/react-native-paper-example_v5"
        target="_blank"
        rel="noreferrer"
        className="paper-get-started-button paper-get-started-button--secondary"
      >
        Try on Snack
      </a>
    </div>
  );
}
