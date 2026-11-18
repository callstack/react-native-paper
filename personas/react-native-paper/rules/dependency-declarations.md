---
id: dependency-declarations
globs:
  - '**/*.json'
severity: blocker
enforcement: must
---

Dependencies must be declared explicitly and only where the package manager can resolve them.

- Declare every runtime dependency explicitly in the consuming package's `package.json`, even when it is already pulled in transitively, so consumers and tooling can see the contract clearly ([#4944](https://github.com/callstack/react-native-paper/pull/4944#discussion_r3237933377)).
