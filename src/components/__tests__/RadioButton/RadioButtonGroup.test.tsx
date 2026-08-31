import { describe, expect, it } from '@jest/globals';

import { render } from '../../../test-utils';
import RadioButton from '../../RadioButton';

describe('RadioButtonGroup', () => {
  it('renders properly', async () => {
    const tree = (
      await render(
        <RadioButton.Group value="first" onValueChange={() => {}}>
          <RadioButton value="first" />
        </RadioButton.Group>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
