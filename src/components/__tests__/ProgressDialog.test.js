/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import ProgressDialog from '../Dialog/ProgressDialog';
import PortalHost from '../Portal/PortalHost';

const fn = () => {};

it('renders visible progress dialog', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <ProgressDialog
          visible
          onDismiss={fn}
          size={48}
          text="Loading..."
          title="Progress Dialog"
        />
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible progress dialog with custom activity indicator color and style', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <ProgressDialog
          visible
          onDismiss={fn}
          size="small"
          text="Loading..."
          title="Progress Dialog"
          color="#BADA55"
          style={{
            backgroundColor: '#999',
          }}
        />
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible progress dialog', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <ProgressDialog
          onDismiss={fn}
          size="small"
          text="Loading..."
          title="Progress Dialog"
        />
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
