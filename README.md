# Exec Plan Plugin (template)

OpenCode plugin that intercepts the `/exec-plan` command, copies the last assistant message from the current session, creates a new session, and inserts the message without sending it to the model.

## Install (local)

```bash
mkdir -p .opencode/plugins
git clone <this-repo> .opencode/plugins/opencode-exec-plan
```

## Usage

In OpenCode, run:

```
/exec-plan
```

## How it works

- Reads the last assistant message from the current session.
- Creates a new session with the title "Exec plan".
- Uses `session.prompt` with `noReply: true` to insert the message without triggering a model response.

## Structure

- `index.ts`: plugin implementation.
- `opencode.json`: loads the local plugin.
- `package.json`: plugin dependencies.
