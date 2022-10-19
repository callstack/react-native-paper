
import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import App from '/home/circleci/react-native-paper/docs/node_modules/component-docs/dist/templates/App.js';
import data from './app.data';
import '/home/circleci/react-native-paper/docs/node_modules/component-docs/dist/styles/reset.css';
import '/home/circleci/react-native-paper/docs/node_modules/component-docs/dist/styles/globals.css';

import '/home/circleci/react-native-paper/docs/assets/styles.css';

const root = document.getElementById('root');
const render = () => {
  try {
    ReactDOM.hydrate(
      <App
        name={window.__INITIAL_PATH__}
        data={data}
        github={"https://github.com/callstack/react-native-paper/edit/main/"}
        logo={"images/sidebar-logo.svg"}
        title={"[title] · React Native Paper"}
        colors={undefined}
        typeDefinitions={{"IconSource":"https://callstack.github.io/react-native-paper/icons.html","Theme":"https://callstack.github.io/react-native-paper/theming.html#theme-properties","AccessibilityState":"https://reactnative.dev/docs/accessibility#accessibilitystate","StyleProp<ViewStyle>":"https://reactnative.dev/docs/view-style-props","StyleProp<TextStyle>":"https://reactnative.dev/docs/text-style-props","ScrollViewProps['keyboardShouldPersistTaps']":"https://reactnative.dev/docs/scrollview#keyboardshouldpersisttaps"}}
      />,
      root
    );
  } catch (e) {
    ReactDOM.render(
      <RedBox error={e} />,
      root
    );
  }
};

if (module.hot) {
  module.hot.accept(() => {
    render();
  });
}

render();
