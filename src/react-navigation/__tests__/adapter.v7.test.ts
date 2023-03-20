// @ts-ignore
import { useLinkTools, useLinkBuilder } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-native';

import { useNavigationLink } from '../adapter';

jest.mock('@react-navigation/native', () => ({
  useLinkTools: jest.fn().mockReturnValue({ buildHref: jest.fn() }),
}));

describe('React Navigation adapter', () => {
  describe('when v7 is used', () => {
    it('should use useLinkTools() to create link', () => {
      let builder;

      renderHook(() => {
        builder = useNavigationLink();
        builder('routeKey');
      });

      expect(useLinkTools).toHaveBeenCalled();
      expect(useLinkBuilder).toBeUndefined();
      expect(builder).toHaveBeenCalledWith('routeKey');
    });
  });
});
