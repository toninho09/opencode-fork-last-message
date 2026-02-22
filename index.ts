import type { Plugin } from "@opencode-ai/plugin"

const EXEC_PLAN_COMMAND = "exec-plan"

function getTextPart(parts: Array<{ type: string; text?: string }>): string | null {
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const part = parts[index]
    if (part?.type === "text" && typeof part.text === "string" && part.text.trim()) {
      return part.text
    }
  }

  return null
}

export const ExecPlanPlugin: Plugin = async ({ client }) => {
  return {
    config: async (opencodeConfig) => {
      opencodeConfig.command ??= {}
      opencodeConfig.command[EXEC_PLAN_COMMAND] = {
        template: "",
        description: "Create a new session with the last message",
      }
    },
    "command.execute.before": async (input, output) => {
      if (input.command !== EXEC_PLAN_COMMAND) {
        return
      }

      const app = client.app

      try {
        const sessionID = input.sessionID
        const messages = await client.session.messages({
          path: { id: sessionID },
        })

        const lastMessage = [...(messages.data || [])].reverse().find((message) => {
          return message?.info?.role === "assistant"
        })

        const lastText = lastMessage?.parts
          ? getTextPart(lastMessage.parts as Array<{ type: string; text?: string }>)
          : null

        if (!lastText) {
          await app.log({
            body: {
              service: "exec-plan-plugin",
              level: "warn",
              message: "No assistant text message found to copy",
              extra: { sessionID },
            },
          })
          throw new Error("__EXEC_PLAN_COMMAND_HANDLED__")
        }

        const newSession = await client.session.create({
          body: {
            title: "Exec plan",
          },
        })

        if (!newSession.data) {
          await app.log({
            body: {
              service: "exec-plan-plugin",
              level: "error",
              message: "Failed to create new session",
            },
          })
          throw new Error("__EXEC_PLAN_COMMAND_HANDLED__")
        }

        await client.session.prompt({
          path: { id: newSession.data.id },
          body: {
            noReply: true,
            parts: [{ type: "text", text: lastText }],
          },
        })

        await app.log({
          body: {
            service: "exec-plan-plugin",
            level: "info",
            message: "Created new session with last message",
            extra: { sourceSessionID: sessionID, newSessionID: newSession.data.id },
          },
        })

        await client.tui.openSessions()
        await client.tui.showToast({
          body: {
            message: "New session created. Select to open.",
            variant: "success",
          },
        })
      } catch (error) {
        await app.log({
          body: {
            service: "exec-plan-plugin",
            level: "error",
            message: "Failed to execute /exec-plan",
            extra: {
              error: error instanceof Error ? error.message : String(error),
            },
          },
        })
      }

      throw new Error("__EXEC_PLAN_COMMAND_HANDLED__")
    },
  }
}

export default ExecPlanPlugin
