const config = require('../docusaurus.config');

const { baseUrl, customFields } = config;

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

function generateThemeColors(componentName, data) {
  if (!data) {
    return `<span />`;
  }
  return `
  ## Theme colors

  <ThemeColorsTable data={${data}} componentName="${componentName}" />
  `;
}

function generatePageMDX(doc, link) {
  const description = doc.description
    .replace(/<\/br>/g, '')
    .replace(/style="[a-zA-Z0-9:;.\s()\-,]*"/gi, '')
    .replace(/src="screenshots/g, `src="${baseUrl}screenshots`)
    .replace(/@extends.+$/, '');

  const data = JSON.stringify(customFields.themeColors[doc.title]);

  const mdx = `
---
title: ${doc.title}
---

import PropTable from '@site/src/components/PropTable.tsx';
import ThemeColorsTable from '@site/src/components/ThemeColorsTable.tsx';

${description}

${generateMoreExamples(doc.title)}

## Props

<PropTable link="${link}" />

${generateThemeColors(doc.title, data)}
`;

  return mdx.slice(1);
}

module.exports = generatePageMDX;
