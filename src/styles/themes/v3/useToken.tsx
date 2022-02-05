import { get } from 'lodash';
import type { MD3Token, MD3Tokens, Theme } from '../../../types';
import { useTheme } from '../../../core/theming';
import { tokens } from './tokens';

export const tokenify = (theme: Theme) => {
  const tokensWithTheme = {
    ...tokens,
    md: {
      ...tokens.md,
      sys: {
        ...tokens.md.sys,
        color: theme.colors,
      },
    },
  } as MD3Tokens;

  return tokensWithTheme;
};

export default function useToken() {
  const theme = useTheme();

  return (tokenKey: MD3Token) => get(tokenify(theme), tokenKey);
}
