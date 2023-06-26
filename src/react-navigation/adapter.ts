const module = require('@react-navigation/native');

type NavigationLink = () => (
  name: string,
  params?: object
) => string | undefined;

function useV7LinkBuilder() {
  const tools = module.useLinkTools();
  return tools.buildHref;
}

/**
 * In React Navigation 7 `useLinkBuilder` was superseded by `useLinkTools`
 * https://reactnavigation.org/docs/7.x/upgrading-from-6.x/#the-uselinkto-and-uselinkbuilder-hooks-are-merged-into-uselinktools
 **/

export const useNavigationLink: NavigationLink =
  'useLinkTools' in module ? useV7LinkBuilder : module.useLinkBuilder;
