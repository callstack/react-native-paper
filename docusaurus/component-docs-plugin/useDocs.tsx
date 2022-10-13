// eslint-disable-next-line import/no-unresolved
import { usePluginData } from '@docusaurus/useGlobalData';

import { pluginName } from './config';

export interface ComponentDocsPluginData {
  docs: { [key in string]: PageDoc };
}

export interface PageDoc {
  filepath: string;
  title: string;
  description: string;
  link: string;
  data: Data;
  type: string;
  dependencies: string[];
  group?: string;
}

export interface Data {
  description: string;
  displayName?: string;
  props: { [key in string]: Prop };
}

export interface Prop {
  required: boolean;
  tsType: {
    name: string;
    raw?: string;
  };
  description: string;
  defaultValue: {
    value: string;
  };
}

function useDoc(withPath: string) {
  const { docs } = usePluginData(pluginName) as ComponentDocsPluginData;
  return docs[withPath];
}

export default useDoc;
