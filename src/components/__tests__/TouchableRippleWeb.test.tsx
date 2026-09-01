import { Text } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
// The bare specifier resolves to .native under the jest preset, so the web file
// needs the extension or it never runs. There is still no DOM here, so this only
// pins the props it computes.
import TouchableRipple from '../TouchableRipple/TouchableRipple.tsx';

describe('TouchableRipple (web file)', () => {
  it('drops a button role but keeps the name when no touch handler is passed', async () => {
    await render(
      <TouchableRipple testID="plain" role="button" aria-label="Add item">
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    const plain = screen.getByTestId('plain');

    expect(plain).toHaveProp('role', 'none');
    expect(plain).toHaveProp('accessible', true);
    expect(plain).toHaveProp('aria-label', 'Add item');
  });

  it('keeps a state bearing role when no touch handler is passed', async () => {
    await render(
      <TouchableRipple testID="readonly" role="checkbox" aria-checked>
        <Text>Read only</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('readonly')).toHaveProp('role', 'checkbox');
  });

  it('keeps the button role on a disabled control', async () => {
    await render(
      <TouchableRipple testID="off" role="button" disabled onPress={() => {}}>
        <Text>Disabled</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('off')).toHaveProp('role', 'button');
  });
});
