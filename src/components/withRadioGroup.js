/* @flow */

import * as React from 'react';
import { Subscriber } from 'react-broadcast';
import { channel } from './RadioGroup';

type Props = {
  value: string,
};

function withRadioGroup(
  Component: React.ComponentType<any>
): React.ComponentType<any> {
  return class extends React.Component<Props> {
    render() {
      const { value } = this.props;

      return (
        <Subscriber channel={channel}>
          {context => (
            <Component
              {...this.props}
              checked={value === context.value}
              onPress={context.onValueChange.bind(null, value)}
            />
          )}
        </Subscriber>
      );
    }
  };
}

export default withRadioGroup;
