/**
 * Generates random digits string with specified length
 *
 * @param {number} length
 * @return {string}
 */
const generateValue = (length) => {
  let value = Math.round(Math.random() * Math.pow(10, length)).toString()

  while (value.length < length) {
    value = Math.round(Math.random() * 10).toString() + value
  }
  return value
}

/**
 * Genarates random date within range
 *
 * @param {Date} start
 * @param {Date} end
 * @return {Date}
 */
const generateDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export {
  generateValue,
  generateDate
}
