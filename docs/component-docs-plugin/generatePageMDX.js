const config = require('../docusaurus.config');

const { baseUrl, customFields } = config;

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

  const mdx = `
---
title: ${doc.title}
---

import PropTable from '@site/src/components/PropTable.tsx';
import ThemeColorsTable from '@site/src/components/ThemeColorsTable.tsx';
import ScreenshotTabs from '@site/src/components/ScreenshotTabs.tsx';

${summary}

${generateScreenshots(doc.title, screenshotData)}

${usage}

${generateMoreExamples(doc.title)}

## Props

<PropTable link="${link}" />

${generateThemeColors(doc.title, themeColorsData)}

${generateKnownIssues(doc.title)}
`;

  return mdx.slice(1);
}

module.exports = generatePageMDX;
