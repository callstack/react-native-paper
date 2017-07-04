
import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import { rehydrate } from 'glamor';
import App from './../node_modules/component-docs/dist/templates/App';
import data from './app.data.json';

rehydrate(window.__GLAMOR__);

const root = document.getElementById('root');
const render = () => {
  try {
    ReactDOM.render(
      <App
        name={window.__INITIAL_PATH__}
        data={data}
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
