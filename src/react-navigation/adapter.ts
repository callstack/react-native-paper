import {
  // @ts-ignore: this hook is not available in React Navigation v7
  useLinkBuilder,
  // @ts-ignore: this hook is not available in React Navigation v6
  useLinkTools,
} from '@react-navigation/native';

function useV6Link() {
  return useLinkBuilder();
}

function useV7Link() {
  const tools = useLinkTools();
  return tools.buildHref;
}

type NavigationLink = () => (
  name: string,
  params?: object
) => string | undefined;

export const useNavigationLink: NavigationLink =
  typeof useLinkTools !== 'undefined' ? useV7Link : useV6Link;
