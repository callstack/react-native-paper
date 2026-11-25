---
id: testing-standards
globs:
  - '**/*.{test,spec}.{ts,tsx,js,jsx}'
  - '**/__tests__/**/*.{ts,tsx,js,jsx}'
severity: major
enforcement: must
---

Assert a deprecation through an observable effect such as its console warning, and import Jest's functions from `@jest/globals` rather than relying on global types.

- A test that checks deprecated behaviour asserts an observable effect such as a console warning, not internal styles. ([#4958](https://github.com/callstack/react-native-paper/pull/4958#discussion_r3294238619))
- Jest's functions are imported explicitly from `@jest/globals` rather than relying on global type declarations. ([#4921](https://github.com/callstack/react-native-paper/pull/4921#discussion_r3225972191))
