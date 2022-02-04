import { get } from 'lodash';
import type { MD3Token } from '../../../types';
import { useTheme } from '../../../core/theming';
import { tokens } from './tokens';

export default function useToken() {
  const { colors } = useTheme();

  const tokensWithTheme = {
    ...tokens,
    md: {
      ...tokens.md,
      sys: {
        ...tokens.md.sys,
        color: colors,
      },
    },
  };

  return (tokenKey: MD3Token) => get(tokensWithTheme, tokenKey);
}
