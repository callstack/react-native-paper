/* @flow */

import React from 'react';
import {
  createRouter,
} from '@exponent/ex-navigation';
import ExampleList, { examples } from './ExampleList';

const routes = Object.keys(examples)
  .map(id => ({ id, item: examples[id] }))
  .reduce((acc, { id, item }) => {
    const Comp = item;
    const Screen = props => <Comp {...props} />;

    Screen.route = {
      navigationBar: {
        title: Comp.title,
      },
    };

    return {
      ...acc,
      [id]: () => Screen,
    };
  }, {});

const Router = createRouter(() => ({
  home: () => ExampleList,
  ...routes,
}));

export default Router;
