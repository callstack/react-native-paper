import * as React from 'react';

import { Switch } from 'react-native-paper';

import InteractiveExample, { ExampleRow, Labelled } from './InteractiveExample';

export const SwitchStatesExample = () => {
  const [on, setOn] = React.useState(true);
  const [off, setOff] = React.useState(false);

  return (
    <InteractiveExample title="Enabled">
      <ExampleRow>
        <Labelled label="selected">
          <Switch value={on} onValueChange={setOn} aria-label="Selected" />
        </Labelled>
        <Labelled label="unselected">
          <Switch value={off} onValueChange={setOff} aria-label="Unselected" />
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
  const [on, setOn] = React.useState(true);
  const [off, setOff] = React.useState(false);

  return (
    <InteractiveExample title="With icons in the handle">
      <ExampleRow>
        <Labelled label="selected">
          <Switch
            value={on}
            onValueChange={setOn}
            checkedIcon="check"
            uncheckedIcon="close"
            aria-label="Selected with icon"
          />
        </Labelled>
        <Labelled label="unselected">
          <Switch
            value={off}
            onValueChange={setOff}
            checkedIcon="check"
            uncheckedIcon="close"
            aria-label="Unselected with icon"
          />
        </Labelled>
      </ExampleRow>
    </InteractiveExample>
  );
};
