// @ts-ignore
import { useLinkTools, useLinkBuilder } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-native';

import { useNavigationLink } from '../adapter';

jest.mock('@react-navigation/native', () => ({
  useLinkBuilder: jest.fn().mockReturnValue(jest.fn()),
}));

describe('React Navigation adapter', () => {
  describe('when v6 is used', () => {
    it('should use useLinkBuilder() to create link', () => {
      let builder;

      renderHook(() => {
        builder = useNavigationLink();
        builder('routeKey');
      });

      expect(useLinkTools).toBeUndefined();
      expect(useLinkBuilder).toHaveBeenCalled();
      expect(builder).toHaveBeenCalledWith('routeKey');
    });
  });
});
