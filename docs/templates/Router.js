/* @flow */

import React, { Component } from 'react';
import createHistory from 'history/createBrowserHistory';

type Route = {
  name: string;
  component: any;
  props: Object;
}

type Props = {
  name: string;
  routes: Array<Route>;
}

type State = {
  name: string;
}

export let history: any;

try {
  history = createHistory();
} catch (e) {
  history = null;
}

export default class Router extends Component<void, Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: history ? this._parse(history.location.pathname) : props.name,
    };
  }

  state: State;

  componentDidMount() {
    this._unlisten = history.listen(location =>
      this.setState({
        name: this._parse(location.pathname),
      })
    );
  }

  componentWillUnmount() {
    this._unlisten();
  }

  props: Props;

  _parse = pathname => pathname.split('/').pop().split('.')[0] || 'index';

  _unlisten: Function;

  render() {
    const route = this.props.routes.find(r => r.name === this.state.name);

    if (route) {
      return React.createElement(route.component, {
        ...route.props,
        name: this.state.name,
      });
    }

    return null;
  }
}
