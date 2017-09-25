
import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import App from '/home/travis/build/callstack/react-native-paper/docs/node_modules/component-docs/dist/templates/App.js';
import Layout from '/home/travis/build/callstack/react-native-paper/docs/node_modules/component-docs/dist/templates/Layout.js';
import data from './app.data.json';

const root = document.getElementById('root');
const render = () => {
  try {
    ReactDOM.render(
      <App
        name={window.__INITIAL_PATH__}
        data={data}
        layout={Layout}
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
    setTimeout(render);
  });
}

render();
