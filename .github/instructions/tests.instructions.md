---
applyTo: '**/*.{test,spec}.{ts,tsx,js,jsx}'
---

# Test Review Instructions

- Check that tests verify public behavior, including rendered output, interaction, callbacks, and warnings. Flag assertions about private properties, context internals, or exact internal style values.
- Test internal helpers directly only when their logic is complex enough to justify separate coverage.
- Prefer accessibility queries, then test IDs for public interaction or content.
- Check that test titles describe user-facing behavior.
- Check coverage of happy paths, edge cases, and error states.
- Flag unnecessary mocking.
