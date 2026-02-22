# AGENTS.md

This file provides guidelines for agentic coding agents working in this repository.

## Project Overview

This is an OpenCode plugin that intercepts the `/fork-last-message` command, copies the last assistant message from the current session, creates a new session, and inserts the message without sending it to the model.

## Build/Development Commands

```bash
# Install dependencies
npm install

# Type checking
npx tsc --noEmit

# No build step required - plugin is loaded directly by OpenCode

# No tests currently configured
```

## Code Style Guidelines

### TypeScript Configuration
- Strict mode enabled (`strict: true`)
- Target: ESNext
- Module: ESNext
- Module resolution: bundler
- No emit on type checking only

### Imports
- Use type-only imports where possible: `import type { Plugin } from "@opencode-ai/plugin"`
- Keep imports at top of file
- Group external imports first, then internal

### Formatting
- No explicit formatting configuration (Prettier/eslint not configured)
- Follow existing code style in index.ts
- Use consistent indentation (2 spaces in existing code)
- Use semicolons consistently

### Naming Conventions
- Constants: UPPERCASE_SNAKE_CASE (e.g., `FORK_LAST_MESSAGE_COMMAND`)
- Functions: camelCase (e.g., `getTextPart`)
- Variables: camelCase
- Types/Interfaces: PascalCase
- File names: camelCase or kebab-case (index.ts is main entry point)

### Type Safety
- Always provide explicit type annotations for function parameters
- Use type guards with `typeof` and `instanceof` checks
- Use optional chaining (`?.`) for safe property access
- Use nullish coalescing (`??`) for fallback values

### Error Handling
- Use try/catch blocks for async operations
- Log errors with `app.log()` using structured logging format:
  ```typescript
  await app.log({
    body: {
      service: "exec-plan-plugin",
      level: "error" | "warn" | "info",
      message: "Descriptive message",
      extra: { context: "value" }
    }
  })
  ```
- Throw `new Error("__EXEC_PLAN_COMMAND_HANDLED__")` to signal command handled
- Check for error instances: `error instanceof Error ? error.message : String(error)`

### Async/Await
- Use async/await consistently
- Check for null/undefined before accessing properties
- Use optional chaining: `messages.data?.id`

### Data Structures
- Check array length before iteration
- Use `Array.find()` for searching
- Use `Array.reverse()` with spread `[...arr].reverse()` to avoid mutation
- Type check array elements: `parts as Array<{ type: string; text?: string }>`

### Plugin Architecture
- Export plugin as default: `export default ForkLastMessagePlugin`
- Plugin returns object with lifecycle hooks: `config`, `command.execute.before`
- Use `client` from plugin context for API calls
- Use `app` from context for logging and UI operations

### Logging Levels
- `error`: For failures that prevent operation
- `warn`: For expected issues (no message found)
- `info`: For successful operations

### Code Organization
- Single file structure (index.ts)
- Define constants at top
- Helper functions before main export
- Export main plugin as named export and default

### Additional Notes
- No comments in existing code - follow this style unless explaining complex logic
- Plugin is loaded via opencode.json configuration
- No build output - TypeScript is used directly by OpenCode
- Use `noReply: true` when creating prompts to avoid triggering model response
