import React from 'react';

export default function ExtendsLink({
  name,
  link,
}: {
  name: string;
  link?: string;
}) {
  return (
    <div key={name} className="extends">
      <i>Extends: </i>
      <a key={name} href={link}>
        <code>
          ...
          {name}
        </code>
      </a>
    </div>
  );
}
