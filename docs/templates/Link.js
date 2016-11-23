/* @flow */

import React, { Component } from 'react';
import { history } from './Router';

type Props = {
  to: string;
}

export default class Router extends Component<void, Props, void> {
  props: Props;

  _handleClick = event => {
    event.preventDefault();
    const path = `${this.props.to}.html`;
    try {
      if (history) {
        history.push(path);
      } else {
        throw new Error('');
      }
    } catch (e) {
      if (!e.message.startsWith("Failed to execute 'pushState' on 'History'")) {
        // Google Chrome throws for file URLs
        throw e;
      }
      const { pathname } = window.location;
      if (pathname.endsWith('/')) {
        window.location.pathname = `${pathname}/${path}`;
      } else {
        const parts = pathname.split('/');
        parts.pop();
        window.location.pathname = `${parts.join('/')}/${path}`;
      }
    }
  }

  render() {
    const { to, ...rest } = this.props;
    return (
      <a
        {...rest}
        href={`${to}.html`}
        onClick={this._handleClick}
      />
    );
  }
}
