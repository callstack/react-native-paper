import componentDocs5x from '../src/data/componentDocs5x.json';
import componentDocs6x from '../src/data/componentDocs6x.json';

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
  '6.x': componentDocs6x,
};

function useDoc(withPath: string, versionName = '5.x') {
  return versionedDocs[versionName]?.docs?.[withPath];
}

export default useDoc;
