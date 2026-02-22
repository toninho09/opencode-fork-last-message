# Fork Last Message Plugin

OpenCode plugin that intercepts the `/fork-last-message` command, copies the last assistant message from the current session, creates a new session, and inserts the message without sending it to the model.

## Install (local)

```bash
mkdir -p .opencode/plugins
git clone <this-repo> .opencode/plugins/opencode-fork-last-message
```

## Usage

In OpenCode, run:

```
/fork-last-message
```

## How it works

- Reads the last assistant message from the current session.
- Creates a new session with a title based on the first 50 characters of the message.
- Uses `session.prompt` with `noReply: true` to insert the message without triggering a model response.

## Structure

- `index.ts`: plugin implementation.
- `opencode.json`: loads the local plugin.
- `package.json`: plugin dependencies.
