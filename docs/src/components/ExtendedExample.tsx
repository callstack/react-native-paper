import React from 'react';

//@ts-ignore
import CodeBlock from '@theme/CodeBlock';
//@ts-ignore
import TabItem from '@theme/TabItem';
//@ts-ignore
import Tabs from '@theme/Tabs';

interface ExtendedExampleProps {
  extendedExamplesData: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

const ExtendedExample = ({ extendedExamplesData }: ExtendedExampleProps) => {
  const example = Object.values(extendedExamplesData)[0];

  if (!example) return null;

  const keys = Object.keys(example);

  return (
    <Tabs>
      {keys.map((key) => (
        <TabItem value={key} label={key} key={key}>
          <CodeBlock language="jsx">{example[key]}</CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
};

export default ExtendedExample;
