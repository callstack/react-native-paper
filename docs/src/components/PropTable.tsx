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

const renderBadge = (annotation: string) => {
  const [annotType, ...annotLabel] = annotation.split(' ');

  // eslint-disable-next-line prettier/prettier
  return `<span class="badge badge-${annotType.replace('@', '')} ">${annotLabel.join(' ')}</span>`;
};

export default function PropTable({
  componentLink,
  prop,
}: {
  componentLink: string;
  prop: string;
}) {
  const doc = useDoc(componentLink);

  if (!doc?.data?.props) {
    return null;
  }

  const props = doc.data.props;

  return (
    <div>
      {Object.keys(props).map((key) => {
        if (key !== prop) {
          return null;
        }
        let descriptionByLines = props[key].description.split('\n');

        // Slice leading badge - it's handled in `generatePageMDX`
        if (descriptionByLines[0].includes('@')) {
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
    </div>
  );
}
