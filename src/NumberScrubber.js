import JsonRpcInterface from "json-rpc-interface"

const lspInitializeResponse = {
  serverInfo: {
    name: "Number Scrubber LSP Server",
    version: "1.0.0",
  },
  capabilities: {}, // no capabilities needed
}

export const startLanguageServer = (options = {}) => {
  console.error("starting language server")
  const { inputStream: inputStreamParam, outputStream: outputStreamParam } = options
  const outputStream = outputStreamParam || process.stdout
  const inputStream = inputStreamParam || process.stdin

  const jsonRpc = new JsonRpcInterface({ inputStream, outputStream })

  jsonRpc.onRequest("initialize", () => {
    return lspInitializeResponse
  })

  jsonRpc.onRequest("numberScrubber/dragStart", ({ file, line, lineNum, colNum }) => {
    console.error("started dragging yo")
    return { scrubStarted: true }
  })

  jsonRpc.onNotification("numberScrubber/dragEnd", ({ file, line, lineNum, colNum }) => {
    console.error("ended dragging")
  })

  jsonRpc.onRequest("shutdown", () => {
    return null
  })

  jsonRpc.onNotification("exit", () => {
    process.exit(0)
  })
}
