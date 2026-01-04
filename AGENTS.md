# Quartz Blog - Agent Guidelines

This document provides guidelines for agentic coding agents working on this Quartz blog repository.

## Build/Lint/Test Commands

### Primary Commands
- `npm run check` - Run TypeScript type checking and Prettier format check
- `npm run format` - Auto-format code with Prettier
- `npm test` - Run all tests using Node.js native test runner
- `npm run docs` - Build and serve documentation

### Running Single Tests
To run a specific test file:
```bash
tsx --test quartz/util/path.test.ts
```

Test files use the `*.test.ts` naming convention and are located alongside their source files.

### Build
- The build is managed through `quartz/bootstrap-cli.mjs`
- Configuration is in `quartz.config.ts`
- Output directory is configurable (default: `public/`)

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode enabled**: `strict: true`
- **No unused locals/parameters**: Enforced
- **ESNext target**: Modern JavaScript features
- **ESM modules**: Use `type: "module"`
- **JSX**: Uses `react-jsx` with Preact as import source

### Formatting (Prettier)
- **Line width**: 100 characters
- **Indentation**: 2 spaces
- **Semicolons**: Disabled
- **Trailing commas**: Always
- **Quote props**: As-needed

### Import Style
- External packages first, then internal modules
- Node built-ins use `node:` prefix:
  ```typescript
  import path from "node:path"
  import { describe, test } from "node:test"
  import assert from "node:assert"
  ```
- Use named imports where possible

### Naming Conventions
- **Variables/Functions**: camelCase (`isFilePath`, `slugifyFilePath`)
- **Components**: PascalCase (`Search`, `Date`)
- **Types/Interfaces**: PascalCase (`QuartzComponent`, `FilePath`)
- **Constants**: UPPER_SNAKE_CASE (`QUARTZ`)
- **Branded types**: Use nominal typing pattern:
  ```typescript
  type SlugLike<T> = string & { __brand: T }
  export type FilePath = SlugLike<"filepath">
  ```

### Type Safety
- Use type guards for runtime validation:
  ```typescript
  export function isFilePath(s: string): s is FilePath {
    const validStart = !s.startsWith(".")
    return validStart && _hasFileExtension(s)
  }
  ```
- Leverage TypeScript's discriminated unions and branded types
- Use `satisfies` keyword for type validation (especially for component constructors)

### Error Handling
- Use try/catch for async operations
- Provide context in error messages with helpful URLs
- Use `trace()` utility for fatal error logging
- Validate inputs with type guards before processing

### Component Guidelines
- Framework: Preact (React-like)
- Components use `class` attribute (not `className`)
- Component pattern with constructor:
  ```typescript
  export default ((userOpts?: Partial<Options>) => {
    const MyComponent: QuartzComponent = (props: QuartzComponentProps) => {
      return <div>{/* content */}</div>
    }
    MyComponent.css = style
    MyComponent.afterDOMLoaded = script
    return MyComponent
  }) satisfies QuartzComponentConstructor<Options>
  ```
- Components can attach: `css`, `beforeDOMLoaded`, `afterDOMLoaded`
- Import inline scripts with `// @ts-ignore` comment

### Plugin Architecture
- Three plugin types: transformers, filters, emitters
- Each plugin exports a function that returns a plugin instance
- Plugin instances must have a `name` property
- Transformers can provide: `textTransform`, `markdownPlugins`, `htmlPlugins`, `externalResources`
- Use the `BuildCtx` context for build-time data

### Testing Guidelines
- Use Node.js native test runner (`import test from "node:test"`)
- Use `assert` module for assertions
- Organize tests with `describe()` blocks
- Test files should be co-located with source files
- Test both happy path and edge cases
- Use helper functions to reduce duplication in assertions

### File Organization
- `quartz/util/` - Utility functions (path, lang, resources, etc.)
- `quartz/plugins/` - Plugins organized by type (transformers, filters, emitters)
- `quartz/components/` - UI components (pages and widgets)
- `quartz/processors/` - Build pipeline stages (parse, filter, emit)
- `quartz/i18n/` - Internationalization
- Test files: `*.test.ts` alongside source files

### Additional Patterns
- Use `clone()` utility when modifying Hast nodes to avoid mutation
- Path manipulation: prefer `joinSegments()` and `slugifyFilePath()` utilities
- Use `slugify` and `slugAnchor` for URL-safe strings
- Async operations: use `async/await` pattern
- Use `glob` utility for file discovery
- Performance: Use `PerfTimer` for measuring build performance
