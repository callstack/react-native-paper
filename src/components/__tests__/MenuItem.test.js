import * as React from 'react';
import renderer from 'react-test-renderer';
import Menu from '../Menu/Menu.tsx';

it('renders menu item', () => {
  const tree = renderer
    .create(
      <>
        <Menu.Item leadingIcon="redo" onPress={() => {}} title="Redo" />
        <Menu.Item leadingIcon="undo" onPress={() => {}} title="Undo" />
        <Menu.Item
          leadingIcon="content-cut"
          onPress={() => {}}
          title="Cut"
          disabled
        />
        <Menu.Item
          leadingIcon="content-copy"
          onPress={() => {}}
          title="Copy"
          disabled
        />
        <Menu.Item onPress={() => {}} title="Paste" />
      </>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
