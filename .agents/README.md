# Agent Instructions

For code review behavior, use:

- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`

These files are the source of truth because they are also consumed by GitHub Copilot code review.

## Project knowledge

- `CONTEXT.md` — glossary of the terms this project uses for Material Design
  concepts. Reach for it when a term is ambiguous, and add to it when a new
  one is settled.
- `adr/` — decision records. One per decision that is hard to reverse,
  surprising without context, and the result of a real trade-off.
