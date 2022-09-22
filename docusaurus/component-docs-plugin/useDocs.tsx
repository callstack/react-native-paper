import { usePluginData } from '@docusaurus/useGlobalData';

import { pluginName } from './config';

export interface ComponentDocsPluginData {
  pages: Page[];
}

export interface Page {
  file: string;
  type: string;
  doc: PageDoc;
  group?: string;
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

function useDoc(link: string) {
  const { pages } = usePluginData(pluginName) as ComponentDocsPluginData;
  const page = pages.find((page) => page.doc.link === link);
  return page;
}

export default useDoc;
