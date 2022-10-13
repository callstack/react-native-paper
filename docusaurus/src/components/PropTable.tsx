import React from 'react';
// eslint-disable-next-line import/no-unresolved
import useDoc from '@site/component-docs-plugin/useDocs';

const typeDefinitions = {
  IconSource: '/docs/icons',
  Theme: '/docs/theming#theme-properties',
  AccessibilityState:
    'https://reactnative.dev/docs/accessibility#accessibilitystate',
  'StyleProp<ViewStyle>': 'https://reactnative.dev/docs/view-style-props',
  'StyleProp<TextStyle>': 'https://reactnative.dev/docs/text-style-props',
};

const ANNOTATION_OPTIONAL = '@optional';
const ANNOTATION_INTERNAL = '@internal';

export default function PropTable({ link }) {
  const doc = useDoc(link);
  const props = doc.data.props;

  for (const prop in props) {
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
        const tsType = props[key].tsType?.raw ?? props[key].tsType?.name;

        return (
          <div key={key}>
            <h3>
              {key} {props[key].required ? '(required)' : ''}
            </h3>
            <p>
              Type:{' '}
              {typeDefinitions[tsType] ? (
                <a
                  href={typeDefinitions[tsType]}
                  target={
                    typeDefinitions[tsType].startsWith('/') ? '_self' : '_blank'
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
            <p>{props[key].description}</p>
          </div>
        );
      })}
    </div>
  );
}
