/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import ListDialog from '../Dialog/ListDialog';
import PortalHost from '../Portal/PortalHost';

const fn = () => {};

const createData = (length: number, selected: Array<number>) =>
  Array.from({ length }, (_, i) => ({
    id: `id-${i}`,
    label: `label-${i}`,
    checked: selected.includes(i),
  }));

it('renders single select list dialog without actions', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <ListDialog
          visible
          onDismiss={fn}
          actions={[]}
          data={createData(4, [0])}
          onChange={fn}
          title="Single select list dialog"
        />
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders single select list dialog with actions', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <ListDialog
          visible
          onDismiss={fn}
          actions={[
            { text: 'Cancel', onPress: fn },
            { text: 'Ok', onPress: fn },
          ]}
          data={createData(4, [0])}
          onChange={fn}
          title="Single select list dialog"
        />
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders multi select list dialog with actions', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <ListDialog
          visible
          onDismiss={fn}
          actions={[{ text: 'Ok', onPress: fn }]}
          data={createData(4, [0, 1, 3])}
          onChange={fn}
          title="Multi select list dialog"
          multiselect
        />
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
