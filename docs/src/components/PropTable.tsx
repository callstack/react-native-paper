import React from 'react';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import useDoc from '@site/component-docs-plugin/useDocs';

import Markdown from './Markdown';

const typeDefinitions = {
  IconSource:
    'https://github.com/callstack/react-native-paper/blob/main/src/components/Icon.tsx#L16',
  ThemeProp:
    'https://callstack.github.io/react-native-paper/docs/guides/theming#theme-properties',
  AccessibilityState:
    'https://reactnative.dev/docs/accessibility#accessibilitystate',
  'StyleProp<ViewStyle>': 'https://reactnative.dev/docs/view-style-props',
  'StyleProp<TextStyle>': 'https://reactnative.dev/docs/text-style-props',
};

const ANNOTATION_OPTIONAL = '@optional';
const ANNOTATION_INTERNAL = '@internal';
const ANNOTATION_EXTENDS = '@extends';

const renderBadge = (annotation: string) => {
  const [annotType, ...annotLabel] = annotation.split(' ');

  // eslint-disable-next-line prettier/prettier
  return `<span class="badge badge-${annotType.replace('@', '')} ">${annotLabel.join(' ')}</span>`;
};

const renderExtendsLink = (description: string) => {
  const extendsAttributes: { name: string; link?: string }[] = [];
  description
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
    <a key={prop.name} href={prop.link}>
      <code>
        ...
        {prop.name}
      </code>
    </a>
  ));
};

export default function PropTable({ link }: { link: string }) {
  const doc = useDoc(link);

  if (!doc || !doc.data || !doc.data.props) {
    return null;
  }

  const props = doc.data.props;

  for (const prop in props) {
    if (!props[prop].description) {
      props[prop].description = '';
    }

    // Remove @optional annotations from descriptions.
    if (props[prop].description.includes(ANNOTATION_OPTIONAL)) {
      props[prop].description = props[prop].description.replace(
        ANNOTATION_OPTIONAL,
        ''
      );
    }
    // Hide props with @internal annotations.
    if (props[prop].description.includes(ANNOTATION_INTERNAL)) {
      delete props[prop];
    }
  }

  return (
    <div>
      {Object.keys(props).map((key) => {
        let leadingBadge = '';
        let descriptionByLines = props[key].description.split('\n');

        // Find leading badge and put it next after prop name.
        if (descriptionByLines[0].includes('@')) {
          leadingBadge = descriptionByLines[0];
          descriptionByLines = descriptionByLines.slice(1);
        }
        descriptionByLines = descriptionByLines.map((line: string) => {
          // Replace annotations with styled badges.
          if (line.includes('@')) {
            const annotIndex = line.indexOf('@');
            // eslint-disable-next-line prettier/prettier
              return `${line.substr(0, annotIndex)} ${renderBadge(line.substr(annotIndex))}`;
          } else {
            return line;
          }
        });

        const description = descriptionByLines.join('\n');
        const tsType = props[key].tsType?.raw ?? props[key].tsType?.name;
        // @ts-ignore
        const tsTypeLink = typeDefinitions[tsType];

        return (
          <div key={key}>
            <h3>
              {key} {props[key].required ? '(required)' : ''}
              {leadingBadge && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: renderBadge(leadingBadge),
                  }}
                />
              )}
            </h3>
            <p>
              Type:{' '}
              {tsTypeLink ? (
                <a
                  href={tsTypeLink}
                  target={
                    tsTypeLink.startsWith(
                      'https://callstack.github.io/react-native-paper'
                    )
                      ? '_self'
                      : '_blank'
                  }
                  rel="noreferrer"
                >
                  <code>{tsType}</code>
                </a>
              ) : (
                <code>{tsType}</code>
              )}
            </p>
            {props[key].defaultValue && (
              <p>
                Default value: <code>{props[key].defaultValue.value}</code>
              </p>
            )}
            <Markdown content={description} />
          </div>
        );
      })}
      {renderExtendsLink(doc.description)}
    </div>
  );
}
