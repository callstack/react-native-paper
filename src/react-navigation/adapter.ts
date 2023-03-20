import {
  // @ts-ignore: this hook is not available in React Navigation v7
  useLinkBuilder,
  // @ts-ignore: this hook is not available in React Navigation v6
  useLinkTools,
} from '@react-navigation/native';

function useV7LinkBuilder() {
  const tools = useLinkTools();
  return tools.buildHref;
}

type NavigationLink = () => (
  name: string,
  params?: object
) => string | undefined;

/**
 * In React Navigation 7 `useLinkBuilder` was superseded by `useLinkTools`
 * https://reactnavigation.org/docs/7.x/upgrading-from-6.x/#the-uselinkto-and-uselinkbuilder-hooks-are-merged-into-uselinktools
 **/

export const useNavigationLink: NavigationLink =
  typeof useLinkTools !== 'undefined' ? useV7LinkBuilder : useLinkBuilder;
