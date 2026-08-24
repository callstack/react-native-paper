import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../../test-utils';
import RadioButton from '../../RadioButton';
import { RadioButtonContext } from '../../RadioButton/RadioButtonGroup';

describe('RadioButton', () => {
  it('renders properly', async () => {
    const tree = (await render(<RadioButton value="first" />)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('uses the MD3 40dp state layer', async () => {
    await render(<RadioButton value="first" />);

    expect(screen.getByRole('radio')).toHaveStyle({
      width: 40,
      height: 40,
      borderRadius: 20,
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
