import componentDocsConfig from '../component-docs.config.ts';

type ComponentProp = {
  description?: string;
  required?: boolean;
};

export type ComponentDoc = {
  title: string;
  description: string;
  data: {
    props: Record<string, ComponentProp>;
  };
};

type ExtendsAttribute = {
  name: string;
  link: string;
};

const { customFields } = componentDocsConfig;

function renderBadge(annotation: string) {
  const [annotType, ...annotLabel] = annotation.split(' ');

  return `<span class="badge badge-${annotType.replace('@', '')} "><span class="badge-text">${annotLabel.join(' ')}</span></span>`;
}

function generateKnownIssues(componentName: string) {
  const componentKnownIssues = customFields.knownIssues[componentName];

  if (!componentKnownIssues) {
    return `<span />`;
  }

  const issues = Object.entries(componentKnownIssues)
    .map(([key, value]) => {
      return `
        <li key="${key}">
          <a href="${value}">${key}</a>
        </li>
    `;
    })
    .join('');

  return `
  ## Known Issues

  <details>
    <ul>
      ${issues}
    </ul>
  </details>
  `;
}

function generateMoreExamples(componentName: string) {
  const componentMoreExamples = customFields.moreExamples[componentName];

  if (!componentMoreExamples) {
    return `<span />`;
  }

  const links = Object.entries(componentMoreExamples)
    .map(([key, value]) => {
      return `
        <li key="${key}">
          <a href="${value}">${key}</a>
        </li>
    `;
    })
    .join('');

  return `
  ## More Examples
  <details>
    <summary>Toggle to grab more examples</summary>
    <ul>
      ${links}
    </ul>
  </details>
  `;
}

function generateThemeColors(
  componentName: string,
  themeColorsData: string | undefined
) {
  if (!themeColorsData) {
    return `<span />`;
  }
  return `
  ## Theme colors

  <ThemeColorsTable themeColorsData={${themeColorsData}} componentName="${componentName}" />
  `;
}

function generateScreenshots(screenshotData: string | undefined) {
  if (!screenshotData) {
    return `<span />`;
  }

  return `
  <ScreenshotTabs screenshotData={${screenshotData}}/>
  `;
}

function generatePropsTable(
  data: Record<string, ComponentProp>,
  link: string,
  extendsAttributes: ExtendsAttribute[]
) {
  const ANNOTATION_OPTIONAL = '@optional';
  const ANNOTATION_INTERNAL = '@internal';

  const props = Object.entries(data)
    .map(([prop, value]) => {
      if (!value.description) {
        value.description = '';
      }
      // Remove @optional annotations from descriptions.
      if (value.description.includes(ANNOTATION_OPTIONAL)) {
        value.description = value.description.replace(ANNOTATION_OPTIONAL, '');
      }
      // Hide props with @internal annotations.
      if (value.description.includes(ANNOTATION_INTERNAL)) {
        return;
      }

      let leadingBadge = '';
      let descriptionByLines = value.description?.split('\n');

      // Find leading badge and put it next after prop name.
      if (descriptionByLines?.[0].includes('@')) {
        leadingBadge = descriptionByLines[0];
      }

      return `
<div>

### ${prop} ${value.required ? '(required)' : ''} ${
        leadingBadge && renderBadge(leadingBadge)
      }

</div>
  
  <PropTable componentLink="${link}" prop="${prop}" />
  `;
    })
    .join('');

  return `
  ## Props
  ${
    extendsAttributes.length === 0
      ? `<span />`
      : `### ${extendsAttributes?.[0]?.name}`
  }
  ${extendsAttributes
    .map((attr) => {
      return `<ExtendsLink name="${attr.name}" link="${attr.link}" />`;
    })
    .join('')}

  ${props}
  `;
}

function generateExtendsAttributes(doc: ComponentDoc) {
  const ANNOTATION_EXTENDS = '@extends';

  const extendsAttributes: ExtendsAttribute[] = [];
  doc.description
    .split('\n')
    .filter((line) => {
      if (line.startsWith(ANNOTATION_EXTENDS)) {
        const parts = line.split(' ').slice(1);
        const link = parts.pop() ?? '';
        extendsAttributes.push({
          name: parts.join(' '),
          link,
        });
        return false;
      }
      return true;
    })
    .join('\n');

  return extendsAttributes;
}

function generateExtendedExamples(
  usage: string,
  extendedExamplesData: string | undefined
) {
  if (!extendedExamplesData) {
    return usage;
  }

  const data = JSON.parse(extendedExamplesData);
  const exampleHeader = Object.keys(data)[0];

  return `
  ${usage}

  ### ${exampleHeader}
  <ExtendedExample extendedExamplesData={${extendedExamplesData}} />
  `;
}

export default function generatePageMDX(doc: ComponentDoc, link: string) {
  const summaryRegex = /([\s\S]*?)## Usage/;

  const description = doc.description
    .replace(/<\/br>/g, '')
    .replace(/style="[a-zA-Z0-9:;.\s()\-,]*"/gi, '')
    .replace(/src="screenshots/g, 'src="/react-native-paper/screenshots')
    .replace(/\(\.\/Portal\)/g, '(./Portal/Portal)')
    .replace(/\(\.\.\/Portal\)/g, '(../Portal/Portal)')
    .replace(/@extends.+$/, '');

  const summaryMatch = summaryRegex.exec(description);
  const summary = summaryMatch ? summaryMatch[1] : '';
  const usage = description.replace(summary, '');

  const themeColorsData = JSON.stringify(customFields.themeColors[doc.title]);
  const screenshotData = JSON.stringify(customFields.screenshots[doc.title]);
  const extendedExamplesData = JSON.stringify(
    customFields.extendedExamples[doc.title]
  );

  const extendsAttributes = generateExtendsAttributes(doc);

  const mdx = `
---
title: ${doc.title}
---

import PropTable from '@docs/components/PropTable.tsx';
import ExtendsLink from '@docs/components/ExtendsLink.tsx';
import ThemeColorsTable from '@docs/components/ThemeColorsTable.tsx';
import ScreenshotTabs from '@docs/components/ScreenshotTabs.tsx';
import ExtendedExample from '@docs/components/ExtendedExample.tsx';

${summary}

${generateScreenshots(screenshotData)}

${generateExtendedExamples(usage, extendedExamplesData)}

${generatePropsTable(doc.data.props, link, extendsAttributes)}

${generateMoreExamples(doc.title)}

${generateThemeColors(doc.title, themeColorsData)}

${generateKnownIssues(doc.title)}
`;

  return mdx
    .slice(1)
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
}
