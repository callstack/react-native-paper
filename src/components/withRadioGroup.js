/* @flow */

import * as React from 'react';
import { Subscriber } from 'react-broadcast';
import { channel } from './RadioGroup';

type Props = {
  value: string,
};

/**
 * withRadioGroup connects context provided by RadioGroup to wrapped component
 * **Usage**
 * ```js
 *
 * const Radio = withRadioGroup(RadioButton);
 *
 * export default class MyComponent extends Component {
 *   state = {
 *     value: 'first',
 *   };
 *
 *   render() {
 *     return(
 *       <RadioGroup
 *         onValueChange={value => this.setState({ value })}
 *         value={this.state.value}
 *       >
 *         <View>
 *           <Radio value="first" />
 *         </View>
 *         <View>
 *           <Radio value="second" />
 *         </View>
 *       </RadioGroup>
 *     )
 *   }
 * }
 *```
 */

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
