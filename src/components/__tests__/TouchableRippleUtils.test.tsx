import { PlatformColor } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import color from 'color';

import { tokens } from '../../theme/tokens';
import { getRippleColorFromContent } from '../TouchableRipple/utils';

const stateOpacity = tokens.md.sys.state.opacity;

describe('getRippleColorFromContent', () => {
  it('defaults to the content color at the pressed-state opacity', () => {
    expect(getRippleColorFromContent({ contentColor: '#123456' })).toBe(
      color('#123456').alpha(stateOpacity.pressed).rgb().string()
    );
  });

  it('returns undefined when the content color is not a plain string', () => {
    expect(
      getRippleColorFromContent({
        contentColor: PlatformColor('?attr/colorPrimary'),
      })
    ).toBeUndefined();
  });
});
