## Cross-Project Context Efficiency

- For new and existing medium or large codebases, prefer using `graphify` early to build or refresh a reusable project map before broad architecture work.
- For day-to-day coding, debugging, refactoring, and code search, prefer `semble` for targeted retrieval before opening many files manually.
- Use both together when useful: `graphify` for whole-project understanding, then `semble` to fetch the exact files, symbols, and snippets needed for the current task.
- For tiny projects or one-off files, skip these tools unless the user asks; normal search is usually cheaper.

## Ponytail Usage

- Use Ponytail-style minimalism for backend code, utilities, bug fixes, refactors, scripts, config changes, and small features: prefer YAGNI, standard library, native platform features, existing dependencies, and the smallest correct diff.
- For frontend, UX, and visual design work, use Ponytail only in `lite` spirit: keep implementation lean, but do not reduce polish, accessibility, layout quality, interaction quality, or the intended design ambition.
- Avoid Ponytail `ultra` behavior unless the user explicitly asks for extreme simplification, bloat removal, or a Ponytail audit.
- Never simplify away trust-boundary validation, security, accessibility basics, data-loss prevention, or behavior the user explicitly requested.
