import Store from './Store'

/**
 * Generates random digits string with specified length
 *
 * @param {number} length
 * @return {string}
 */
const generateValue = (length) => {
  let value = Math.floor(Math.random() * Math.pow(10, length)).toString()

  while (value.length < length) {
    value = Math.floor(Math.random() * 10).toString() + value
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

const addZero = (number) => number < 10 ? ('0' + number) : +number

/**
 * Generates item with history
 *
 * @param {*} id
 * @param {*} generateFunc
 * @return {*}
 */
const generateWithHistory = (id, generateFunc) => {
  const history = Store.getHistory(id)
  let value = generateFunc()

  while (history.includes(value)) {
    value = generateFunc()
  }
  Store.setValue(id, value)
  return value
}

export {
  generateValue,
  generateDate,
  addZero,
  generateWithHistory
}
