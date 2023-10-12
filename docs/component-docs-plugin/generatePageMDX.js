const config = require('../docusaurus.config');

const { baseUrl, customFields } = config;

function renderBadge(annotation) {
  const [annotType, ...annotLabel] = annotation.split(' ');

  // eslint-disable-next-line prettier/prettier
  return `<span class="badge badge-${annotType.replace('@', '')} "><span class="badge-text">${annotLabel.join(' ')}</span></span>`;
}

function generateKnownIssues(componentName) {
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

function generateMoreExamples(componentName) {
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

function generateThemeColors(componentName, themeColorsData) {
  if (!themeColorsData) {
    return `<span />`;
  }
  return `
  ## Theme colors

  <ThemeColorsTable themeColorsData={${themeColorsData}} componentName="${componentName}" />
  `;
}

function generateScreenshots(componentName, screenshotData) {
  if (!screenshotData) {
    return `<span />`;
  }

  return `
  <ScreenshotTabs screenshotData={${screenshotData}} baseUrl="${baseUrl}"/>
  `;
}

function generatePropsTable(data, link, extendsAttributes) {
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

function generateExtendsAttributes(doc) {
  const ANNOTATION_EXTENDS = '@extends';

  const extendsAttributes = [];
  doc?.description
    .split('\n')
    .filter((line) => {
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

  return extendsAttributes;
}

function generatePageMDX(doc, link) {
  const summaryRegex = /([\s\S]*?)## Usage/;

  const description = doc.description
    .replace(/<\/br>/g, '')
    .replace(/style="[a-zA-Z0-9:;.\s()\-,]*"/gi, '')
    .replace(/src="screenshots/g, `src="${baseUrl}screenshots`)
    .replace(/@extends.+$/, '');

  const summary = summaryRegex.exec(description)
    ? summaryRegex.exec(description)[1]
    : '';
  const usage = description.replace(summary, '');

  const themeColorsData = JSON.stringify(customFields.themeColors[doc.title]);
  const screenshotData = JSON.stringify(customFields.screenshots[doc.title]);

  const extendsAttributes = generateExtendsAttributes(doc);

  const mdx = `
---
title: ${doc.title}
---

import PropTable from '@site/src/components/PropTable.tsx';
import ExtendsLink from '@site/src/components/ExtendsLink.tsx';
import ThemeColorsTable from '@site/src/components/ThemeColorsTable.tsx';
import ScreenshotTabs from '@site/src/components/ScreenshotTabs.tsx';

${summary}

${generateScreenshots(doc.title, screenshotData)}

${usage}

${generatePropsTable(doc.data.props, link, extendsAttributes)}

${generateMoreExamples(doc.title)}

${generateThemeColors(doc.title, themeColorsData)}

${generateKnownIssues(doc.title)}
`;

  return mdx.slice(1);
}

module.exports = generatePageMDX;
