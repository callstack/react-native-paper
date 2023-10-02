import React from 'react';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import useDoc from '@site/component-docs-plugin/useDocs';

const ANNOTATION_EXTENDS = '@extends';

export default function ExtendsLink({
  componentLink,
}: {
  componentLink: string;
}) {
  const doc = useDoc(componentLink);

  const extendsAttributes: { name: string; link?: string }[] = [];
  doc?.description
    .split('\n')
    .filter((line: string) => {
      if (line.startsWith(ANNOTATION_EXTENDS)) {
        const parts = line.split(' ').slice(1);
        const link = parts.pop();
        extendsAttributes.push({
          name: parts.join(' '),
          link,
        });
        return false;
      }
      return true;
    })
    .join('\n');

  if (extendsAttributes.length === 0) {
    return null;
  }

  return extendsAttributes.map((prop) => (
    <div key={prop.name}>
      <i>Extends: </i>
      <a key={prop.name} href={prop.link}>
        <code>
          ...
          {prop.name}
        </code>
      </a>
    </div>
  ));
}
