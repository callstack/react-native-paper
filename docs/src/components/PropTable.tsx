import Markdown from './Markdown';

const typeDefinitions: Record<string, string> = {
  IconSource:
    'https://github.com/callstack/react-native-paper/blob/main/components/Icon.tsx#L16',
  ThemeProp:
    'https://callstack.github.io/react-native-paper/docs/guides/theming#theme-properties',
  '(props: TextInputAccessoryProps) => React.ReactNode':
    'https://github.com/callstack/react-native-paper/blob/main/components/TextInput/TextInputIcon.tsx#L11',
  '(props: TextInputRenderProps) => React.ReactNode':
    'https://github.com/callstack/react-native-paper/blob/main/components/TextInput/TextInput.tsx#L168',
  'React.Ref<TextInputHandles>':
    'https://github.com/callstack/react-native-paper/blob/main/components/TextInput/TextInput.tsx#L172',
  AccessibilityState:
    'https://reactnative.dev/docs/accessibility#accessibilitystate',
  'StyleProp<ViewStyle>': 'https://reactnative.dev/docs/view-style-props',
  'StyleProp<TextStyle>': 'https://reactnative.dev/docs/text-style-props',
  TextProps: 'https://reactnative.dev/docs/text#props',
  AccessibilityProps:
    'https://reactnative.dev/docs/accessibility#accessibilityprops',
};

const renderBadge = (annotation: string) => {
  const [annotType, ...annotLabel] = annotation.split(' ');

  return `<span class="badge badge-${annotType.replace(
    '@',
    ''
  )} ">${annotLabel.join(' ')}</span>`;
};

type LegacyProp = {
  defaultValue?: {
    value: string;
  } | null;
  description: string;
  required: boolean;
  tsType?: {
    name: string;
    raw?: string;
  } | null;
};

type LegacyComponentDocs = Record<
  string,
  {
    data: {
      props: Record<string, LegacyProp>;
    };
  }
>;

type LegacyPropTableProps = {
  componentDocs: LegacyComponentDocs;
  componentLink: string;
  prop: string;
};

type GeneratedPropTableProps = {
  defaultValue?: string;
  description: string;
  type: string;
};

type PropTableProps = LegacyPropTableProps | GeneratedPropTableProps;

const renderPropDetails = ({
  defaultValue,
  description,
  type,
}: GeneratedPropTableProps) => {
  const tsTypeLink = typeDefinitions[type];

  return (
    <div>
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
            <code>{type}</code>
          </a>
        ) : (
          <code>{type}</code>
        )}
      </p>
      {defaultValue && (
        <p>
          Default value: <code>{defaultValue}</code>
        </p>
      )}
      <Markdown content={description} />
    </div>
  );
};

export default function PropTable(tableProps: PropTableProps) {
  if ('type' in tableProps) {
    return renderPropDetails(tableProps);
  }

  const doc = tableProps.componentDocs[tableProps.componentLink];

  if (!doc?.data?.props) {
    return null;
  }

  const prop = doc.data.props[tableProps.prop];

  if (!prop) {
    return null;
  }

  let descriptionByLines = prop.description.split('\n');

  // Slice leading badge - it's handled in `generatePageMDX`
  if (descriptionByLines[0].includes('@')) {
    descriptionByLines = descriptionByLines.slice(1);
  }

  const description = descriptionByLines
    .map((line) => {
      // Replace annotations with styled badges.
      if (!line.includes('@')) {
        return line;
      }

      const annotIndex = line.indexOf('@');

      return `${line.substr(0, annotIndex)} ${renderBadge(
        line.substr(annotIndex)
      )}`;
    })
    .join('\n');

  return renderPropDetails({
    defaultValue: prop.defaultValue?.value,
    description,
    type: prop.tsType?.raw ?? prop.tsType?.name ?? '',
  });
}
