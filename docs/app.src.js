import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import { rehydrate } from 'glamor';
import App from './templates/App';
import pages from './dist/app.data.json'; // eslint-disable-line import/no-unresolved

rehydrate(window.__GLAMOR__);

const root = document.getElementById('root');
const render = () => {
  try {
    ReactDOM.render(
      <App
        pages={pages}
        name={window.__INITIAL_PATH__}
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
