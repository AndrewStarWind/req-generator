import { generateWithHistory } from './helpers'

const generate = generateWithHistory.bind(null, 'SFR', () => {
  let result = ''
  let sum = 0
  for (let index = 1; index < 10; index++) {
    const number = Math.floor(Math.random() * 10)
    result += number.toString()
    const multiplication = number * (index % 2 === 1 ? 2 : 1)
    sum += (multiplication <= 9) ? multiplication : (multiplication - 9)
  }
  const lastNumber = (sum % 10 === 0) ? 0 : (10 - sum % 10)
  result += lastNumber.toString()
  return result
})

export {
  generate
}
