import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../../test-utils';
import RadioButton from '../../RadioButton';
import { RadioButtonContext } from '../../RadioButton/RadioButtonGroup';

describe('RadioButton', () => {
  it('renders properly', async () => {
    const tree = (await render(<RadioButton value="first" />)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('provides a 48dp touch target in its layout', async () => {
    await render(<RadioButton value="first" />);

    expect(screen.getByRole('radio')).toHaveStyle({
      width: 48,
      height: 48,
      borderRadius: 24,
    });
  });

  it('preserves consumer layout styles on the touch target', async () => {
    await render(
      <RadioButton value="first" style={{ margin: 8, width: 56, height: 56 }} />
    );

    expect(screen.getByRole('radio')).toHaveStyle({
      margin: 8,
      width: 56,
      height: 56,
    });
  });

  describe('when RadioButton is wrapped by RadioButtonContext.Provider', () => {
    it('renders properly', async () => {
      const tree = (
        await render(
          <RadioButtonContext.Provider
            value={{ value: 'first', onValueChange: () => {} }}
          >
            <RadioButton value="first" />
          </RadioButtonContext.Provider>
        )
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('RadioButton with custom testID', () => {
    it('renders properly', async () => {
      const tree = (
        await render(<RadioButton value="first" testID={'custom:testID'} />)
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
