---
id: tooling-alignment
globs:
  - '**/*.{js,json,yml}'
severity: minor
enforcement: must
---

Tooling in this repo should be configured so that a checkout alone determines the build environment and CI behaves exactly like a local machine. The example app must stay representative of what consumers experience.

- The package manager and its version must be pinned in committed repository metadata (for example via `yarn set version berry --yarn-path` or Corepack), not established by an extra CI step, so contributors and CI use the identical tool without manual setup. ([#4574](https://github.com/callstack/react-native-paper/pull/4574#discussion_r1886630207)) ([#4574](https://github.com/callstack/react-native-paper/pull/4574#discussion_r1886737353)) ([#4574](https://github.com/callstack/react-native-paper/pull/4574#discussion_r1886705407))
- CI must invoke the package manager the same way a contributor would locally: do not run package-manager version-switching commands in CI when the version is already declared in `package.json`. ([#4574](https://github.com/callstack/react-native-paper/pull/4574#discussion_r1886630207)) ([#4574](https://github.com/callstack/react-native-paper/pull/4574#discussion_r1886737353))
- The example `metro.config.js` must remain minimal and limited to monorepo concerns; reject aliases, resolver redirects, or bundler workarounds that would also be required by consumers. ([#4944](https://github.com/callstack/react-native-paper/pull/4944#discussion_r3237902206)) ([#4944](https://github.com/callstack/react-native-paper/pull/4944#discussion_r3239948033))
- Example `package.json` scripts must not duplicate interactive CLI shortcuts that the underlying tooling already provides from `start`; remove redundant platform-specific or web scripts and rely on the CLI's key prompts or explicit flags. ([#4944](https://github.com/callstack/react-native-paper/pull/4944#discussion_r3237929087))
