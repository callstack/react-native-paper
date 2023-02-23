const config = require('../docusaurus.config');

const { baseUrl } = config;

function generatePageMDX(doc, link) {
  const description = doc.description
    .replace(/<\/br>/g, '')
    .replace(/style="[a-zA-Z0-9:;.\s()\-,]*"/gi, '')
    .replace(/src="screenshots/g, `src="${baseUrl}screenshots`);

  const mdx = `
---
title: ${doc.title}
---

import PropTable from '@site/src/components/PropTable.tsx';

${description}

## Props

<PropTable link="${link}" />
`;

  return mdx.slice(1);
}

module.exports = generatePageMDX;
