import * as React from 'react';

import { Switch } from 'react-native-paper';

import InteractiveExample, { ExampleRow, Labelled } from './InteractiveExample';

export const SwitchStatesExample = () => {
  const [first, setFirst] = React.useState(true);
  const [second, setSecond] = React.useState(false);

  return (
    <InteractiveExample title="Enabled">
      <ExampleRow>
        <Labelled label={first ? 'selected' : 'unselected'}>
          <Switch
            value={first}
            onValueChange={setFirst}
            aria-label="First switch"
          />
        </Labelled>
        <Labelled label={second ? 'selected' : 'unselected'}>
          <Switch
            value={second}
            onValueChange={setSecond}
            aria-label="Second switch"
          />
        </Labelled>
      </ExampleRow>
    </InteractiveExample>
  );
};

export const SwitchDisabledExample = () => (
  <InteractiveExample title="Disabled">
    <ExampleRow>
      <Labelled label="selected">
        <Switch value disabled aria-label="Disabled and selected" />
      </Labelled>
      <Labelled label="unselected">
        <Switch value={false} disabled aria-label="Disabled and unselected" />
      </Labelled>
    </ExampleRow>
  </InteractiveExample>
);

export const SwitchIconsExample = () => {
  const [first, setFirst] = React.useState(true);
  const [second, setSecond] = React.useState(false);

  return (
    <InteractiveExample title="With icons in the handle">
      <ExampleRow>
        <Labelled label={first ? 'selected' : 'unselected'}>
          <Switch
            value={first}
            onValueChange={setFirst}
            checkedIcon="check"
            uncheckedIcon="close"
            aria-label="First switch with icons"
          />
        </Labelled>
        <Labelled label={second ? 'selected' : 'unselected'}>
          <Switch
            value={second}
            onValueChange={setSecond}
            checkedIcon="check"
            uncheckedIcon="close"
            aria-label="Second switch with icons"
          />
        </Labelled>
      </ExampleRow>
    </InteractiveExample>
  );
};
