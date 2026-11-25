import { describe, expect, it } from '@jest/globals';

import { getAvatarImageSourceKey } from '../Avatar/utils';

describe('getAvatarImageSourceKey', () => {
  it('keys object sources by uri', () => {
    expect(getAvatarImageSourceKey({ uri: 'a.png' })).toBe('a.png');
  });

  it('keys array sources by their uris', () => {
    expect(
      getAvatarImageSourceKey([{ uri: 'a@1x.png' }, { uri: 'a@2x.png' }])
    ).toBe(getAvatarImageSourceKey([{ uri: 'a@1x.png' }, { uri: 'a@2x.png' }]));
    expect(getAvatarImageSourceKey([{ uri: 'a@1x.png' }])).not.toBe(
      getAvatarImageSourceKey([{ uri: 'b@1x.png' }])
    );
  });

  it('is stable for function sources', () => {
    expect(getAvatarImageSourceKey(() => null)).toBe('function');
    expect(getAvatarImageSourceKey(() => null)).toBe(
      getAvatarImageSourceKey(() => null)
    );
  });

  it('keys function sources by sourceKey when it is set', () => {
    expect(getAvatarImageSourceKey(() => null, 'user-1')).toBe('user-1');
    expect(getAvatarImageSourceKey(() => null, 'user-2')).not.toBe(
      getAvatarImageSourceKey(() => null, 'user-1')
    );
  });

  it('ignores sourceKey for uri sources', () => {
    expect(getAvatarImageSourceKey({ uri: 'a.png' }, 'user-1')).toBe('a.png');
  });

  it('uses the value for module ids', () => {
    expect(getAvatarImageSourceKey(1)).toBe(1);
  });
});
