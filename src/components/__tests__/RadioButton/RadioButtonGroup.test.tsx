import * as React from 'react';

import { describe, expect, it } from '@jest/globals';

import { render } from '../../../test-utils';
import RadioButton from '../../RadioButton';
import { RadioButtonContext } from '../../RadioButton/RadioButtonGroup';
import type { RadioButtonContextType } from '../../RadioButton/RadioButtonGroup';

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

  it('keeps a stable context value when an unrelated parent prop changes', () => {
    const contexts: RadioButtonContextType[] = [];

    const Capture = ({ extra }: { extra: number }) => {
      contexts.push(React.useContext(RadioButtonContext));
      return <RadioButton value={`v${extra}`} />;
    };

    // New inline `onValueChange` on every render — `use-latest-callback` +
    // `useMemo` should keep the provided context object identical.
    const Parent = ({ extra }: { extra: number }) => (
      <RadioButton.Group value="first" onValueChange={() => {}}>
        <Capture extra={extra} />
      </RadioButton.Group>
    );

    const { rerender } = render(<Parent extra={1} />);
    rerender(<Parent extra={2} />);

    expect(contexts.length).toBe(2);
    expect(contexts[0]).toBe(contexts[1]);
  });
});
