import JsonRpcInterface from "json-rpc-interface"
import { createMouseHandlers } from "./mouseHandlers.js"

const lspInitializeResponse = {
  serverInfo: {
    name: "Number Scrubber LSP Server",
    version: "1.0.0",
  },
  capabilities: {}, // no capabilities needed
}

export const startLanguageServer = (options = {}) => {
  const { inputStream: inputStreamParam, outputStream: outputStreamParam } = options
  const outputStream = outputStreamParam || process.stdout
  const inputStream = inputStreamParam || process.stdin

  const jsonRpc = new JsonRpcInterface({ inputStream, outputStream })
  const { onDragStart, onDragEnd } = createMouseHandlers(jsonRpc)

  jsonRpc.onRequest("initialize", () => lspInitializeResponse)

  jsonRpc.onRequest("numberScrubber/dragStart", onDragStart)

  jsonRpc.onNotification("numberScrubber/dragEnd", onDragEnd)

  jsonRpc.onRequest("shutdown", () => null)

  jsonRpc.onNotification("exit", () => process.exit(0))
}
