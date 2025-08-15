export const sendEdit = (jsonRpc, file, lineNum, startIndex, length, newStr) => {
  const editMsg = {
    edit: {
      changes: {
        [file]: [
          {
            range: {
              start: { line: lineNum, character: startIndex },
              end: { line: lineNum, character: startIndex + length },
            },
            newText: newStr,
          },
        ],
      },
    },
  }
  return jsonRpc.sendRequest("workspace/applyEdit", editMsg)
}

const number_regex = /[-]?[0-9]*[.]?[0-9]+/g

export const getNumberInfoAtIndex = (line, index) => {
  let numberStr, startIndex
  for (const match of line.matchAll(number_regex)) {
    if (match.index <= index && index <= match.index + match[0].length) {
      numberStr = match[0]
      startIndex = match.index
      break
    }
  }
  if (numberStr == null) {
    return null
  }

  let decimalIndex = numberStr.indexOf(".")
  let decimalPlaces = decimalIndex < 0 ? 0 : numberStr.length - 1 - decimalIndex
  const number = Number.parseFloat(numberStr)
  return { number, numberStr, decimalPlaces, startIndex }
}
