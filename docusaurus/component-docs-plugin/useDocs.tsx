// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { usePluginData } from '@docusaurus/useGlobalData';

const pluginName = 'component-docs-plugin';

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
  const pluginData = usePluginData(pluginName) as ComponentDocsPluginData;
  return pluginData?.docs?.[withPath];
}

export default useDoc;
