/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import { theme } from './ThemeProvider';

export default function withTheme<T>(Comp: ReactClass<T>): ReactClass<T> {

  const name = Comp.displayName || Comp.name;

  return class extends Component {

    static displayName = `Themed${name}`;

    static contextTypes = {
      [theme]: PropTypes.object,
    };

    render() {
      return <Comp theme={this.context[theme]} {...this.props} />;
    }
  };
}
