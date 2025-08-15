import robot from "robotjs"
import { getNumberInfoAtIndex, sendEdit } from "./util.js"

const scrubSpeed = 1
const ticksPerSecond = 30
const tickInterval = Math.floor(1000 / ticksPerSecond)

export const createMouseHandlers = (jsonRpc) => {
  let updateIntervalId
  let isDragging = false

  const onDragStart = ({ file, line, lineNum, colNum }) => {
    if (isDragging) {
      return
    }

    const numberInfo = getNumberInfoAtIndex(line, colNum)
    if (!numberInfo) {
      return { startedScrub: false }
    }

    const { decimalPlaces, startIndex } = numberInfo
    const diffScaler = scrubSpeed / Math.pow(10, decimalPlaces)
    let currentValue = numberInfo.number
    let oldStr = numberInfo.numberStr
    const startPos = robot.getMousePos()

    updateIntervalId = setInterval(() => {
      const newPos = robot.getMousePos()
      const xDiff = newPos.x - startPos.x
      currentValue += xDiff * diffScaler
      const newStr = currentValue.toFixed(decimalPlaces)
      if (newStr !== oldStr) {
        sendEdit(jsonRpc, file, lineNum, startIndex, oldStr.length, newStr)
        oldStr = newStr
      }

      robot.moveMouse(startPos.x, newPos.y)
    }, tickInterval)

    isDragging = true

    return { scrubStarted: true }
  }

  const onDragEnd = () => {
    isDragging = false
    if (updateIntervalId != null) {
      clearInterval(updateIntervalId)
      updateIntervalId = null
    }
  }

  return { onDragStart, onDragEnd }
}
