declare module 'component-docs/dist/parsers/component.js' {
  type ComponentDoc = {
    title: string;
    description: string;
    data: {
      props: Record<
        string,
        {
          description?: string;
          required?: boolean;
        }
      >;
    };
  };

  const componentDocsParser: {
    default: (filePath: string, options: { root: string }) => ComponentDoc;
  };

  export default componentDocsParser;
}
