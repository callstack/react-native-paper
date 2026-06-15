import { useActiveDocContext } from '@docusaurus/plugin-content-docs/client';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { usePluginData } from '@docusaurus/useGlobalData';

import componentDocs5x from '../src/data/componentDocs5x.json';

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
  tsType?: {
    name: string;
    raw?: string;
  } | null;
  description: string;
  defaultValue?: {
    value: string;
  } | null;
}

const versionedDocs: { [versionName: string]: ComponentDocsPluginData } = {
  '5.x': componentDocs5x,
};

function useDoc(withPath: string) {
  const activeDocContext = useActiveDocContext(undefined);
  const pluginData = usePluginData(pluginName) as ComponentDocsPluginData;
  const versionName = activeDocContext.activeVersion?.name;
  const versionedDoc = versionName
    ? versionedDocs[versionName]?.docs?.[withPath]
    : undefined;

  return versionedDoc ?? pluginData?.docs?.[withPath];
}

export default useDoc;
