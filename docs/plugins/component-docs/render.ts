import path from 'node:path';

import type { ComponentDoc, ComponentProp } from './types.ts';

type CustomFields = {
  extendedExamples: Record<string, unknown>;
  knownIssues: Record<string, Record<string, string>>;
  moreExamples: Record<string, Record<string, string>>;
  screenshots: Record<string, unknown>;
  themeColors: Record<string, unknown>;
};

const renderBadge = (type: string, label: string) =>
  `<span class="badge badge-${type}"><span class="badge-text">${label}</span></span>`;

const extractLeadingBadges = (description: string) => {
  const badges: string[] = [];
  const lines = description.split('\n');

  while (lines[0]?.startsWith('@')) {
    const match = /^@(\S+)\s+(.+)$/.exec(lines[0]);

    const type = match?.[1];
    const label = match?.[2];

    if (!type || !label || type === 'optional') {
      lines.shift();
      continue;
    }

    badges.push(renderBadge(type, label));
    lines.shift();
  }

  return {
    badges,
    description: lines
      .join('\n')
      .replace(/@optional\b/g, '')
      .replace(/@(supported|renamed)\s+([^\n]+)/g, (_, type, label) =>
        renderBadge(type, label)
      )
      .trim(),
  };
};

const renderProp = (prop: ComponentProp) => {
  if (prop.description.includes('@internal')) {
    return '';
  }

  const { badges, description } = extractLeadingBadges(prop.description);

  return `
### ${prop.name}${prop.required ? ' (required)' : ''}${badges.length ? ` ${badges.join(' ')}` : ''}

<PropTable
  type={${JSON.stringify(prop.type)}}
  description={${JSON.stringify(description)}}
  ${prop.defaultValue ? `defaultValue={${JSON.stringify(prop.defaultValue)}}` : ''}
/>
`;
};

const renderLinkList = (
  title: string,
  links: Record<string, string> | undefined
) => {
  if (!links) {
    return '';
  }

  return `
## ${title}

<details>
  <summary>Toggle to grab more examples</summary>
  <ul>
    ${Object.entries(links)
      .map(([label, href]) => `<li><a href="${href}">${label}</a></li>`)
      .join('\n    ')}
  </ul>
</details>
`;
};

const resolveRelativeLinks = (
  content: string,
  routePath: string,
  routes: ReadonlySet<string>
) =>
  content.replace(
    /\]\((?!https?:\/\/|mailto:|#|\/)([^)\s]+)([^)]*)\)/g,
    (_link, href: string, suffix: string) => {
      const [pathname, hash = ''] = href.split('#');
      const resolvedPath = path.posix.resolve(
        path.posix.dirname(routePath),
        pathname
      );
      const directoryPage = `${resolvedPath}/${path.posix.basename(
        resolvedPath
      )}`;
      const target = routes.has(resolvedPath)
        ? resolvedPath
        : routes.has(directoryPage)
          ? directoryPage
          : undefined;

      if (!target) {
        throw new Error(
          `Unable to generate docs for ${routePath}: relative link ${href} does not match a component page`
        );
      }

      return `](${target}${hash ? `#${hash}` : ''}${suffix})`;
    }
  );

export const renderComponentPage = (
  doc: ComponentDoc,
  customFields: CustomFields,
  routePath: string,
  routes: ReadonlySet<string>
) => {
  const summaryMatch = /([\s\S]*?)## Usage/.exec(doc.description);
  const summary = summaryMatch?.[1] ?? '';
  const usage = summaryMatch
    ? doc.description.slice(summary.length)
    : doc.description;
  const screenshot = customFields.screenshots[doc.title];
  const extendedExample = customFields.extendedExamples[doc.title];
  const extendedExampleTitle =
    extendedExample && typeof extendedExample === 'object'
      ? Object.keys(extendedExample)[0]
      : undefined;
  const themeColors = customFields.themeColors[doc.title];

  const content = `
---
title: ${doc.title}
---

import PropTable from '@docs/components/PropTable.tsx';
import ExtendsLink from '@docs/components/ExtendsLink.tsx';
import ThemeColorsTable from '@docs/components/ThemeColorsTable.tsx';
import ScreenshotTabs from '@docs/components/ScreenshotTabs.tsx';
import ExtendedExample from '@docs/components/ExtendedExample.tsx';

${summary}

${screenshot ? `<ScreenshotTabs screenshotData={${JSON.stringify(screenshot)}} />` : ''}

${usage}

${
  extendedExample
    ? `${extendedExampleTitle ? `### ${extendedExampleTitle}\n\n` : ''}<ExtendedExample extendedExamplesData={${JSON.stringify(extendedExample)}} />`
    : ''
}

## Props

${doc.extendsAttributes
  .map(
    (attribute) =>
      `<ExtendsLink name={${JSON.stringify(attribute.name)}} link={${JSON.stringify(attribute.link)}} />`
  )
  .join('\n')}

${doc.props.map(renderProp).join('\n')}

${renderLinkList('More Examples', customFields.moreExamples[doc.title])}

${
  themeColors
    ? `## Theme colors

<ThemeColorsTable themeColorsData={${JSON.stringify(themeColors)}} componentName={${JSON.stringify(doc.title)}} />`
    : ''
}

${renderLinkList('Known Issues', customFields.knownIssues[doc.title])}
`
    .slice(1)
    .replaceAll('</br>', '<br />')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');

  return resolveRelativeLinks(content, routePath, routes);
};
