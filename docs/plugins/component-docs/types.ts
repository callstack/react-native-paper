export type ComponentPageConfig = {
  source: string;
  component?: string;
  props?: string;
  propsSource?: string;
  title?: string;
};

export type ComponentProp = {
  defaultValue?: string;
  description: string;
  name: string;
  required: boolean;
  type: string;
};

export type ExtendsAttribute = {
  link: string;
  name: string;
};

export type ComponentDoc = {
  description: string;
  extendsAttributes: ExtendsAttribute[];
  props: ComponentProp[];
  title: string;
};
