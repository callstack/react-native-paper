import { useLinkBuilder } from '@react-navigation/native';

export const useCompatibleLinkBuilder = () => {
  const builder = useLinkBuilder();

  if (typeof builder === 'function') {
    return builder;
  } else {
    return builder.buildHref;
  }
};
