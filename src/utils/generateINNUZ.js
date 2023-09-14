import { generateValue, generateWithHistory, getRandomInt } from './helpers'

const IE_INN_LENGTH = 14
const ORG_INN_LENGTH = 9

const CONTROL_DIGITS_DIVIDER = 10
const CONTROL_WEIGHT = [7, 3, 1]

// организации начинаются с двойки.
const ENTITY_PREFIXES = ['0', '1', '2', '3', '8', '9']

// ИП начинаются с особых цифр, подбираются из таблицы по полу и дате рождения (1-6).
const IE_PREFIXES = ['1', '2', '3', '4', '5', '6']

const getIECheckSum = (value) => {
  const result = []

  // перемножаем на весовую функцию 731 по очереди на каждое число.
  for (let i = 0; i < value.length; i++) {
    const number = parseInt(value[i], 10)
    const weight = CONTROL_WEIGHT[i % CONTROL_WEIGHT.length]
    const multipliedNumber = number * weight

    result.push(multipliedNumber)
  }

  // суммируем все полученные числа
  const sumOfNumbers = result.reduce((acc, number) => acc + number, 0)

  // сумму делим по модулю на контрольное число
  const controlNumber = sumOfNumbers % CONTROL_DIGITS_DIVIDER

  // полученное контрольное число должно совпадать с последним символом.
  return String(controlNumber)
}

const generateOrg = () => {
  const firstDigit = ENTITY_PREFIXES[getRandomInt(ENTITY_PREFIXES.length - 1)]

  return `${firstDigit}${generateValue(ORG_INN_LENGTH - 1)}`
}

const generateIE = () => {
  const firstDigit = IE_PREFIXES[getRandomInt(IE_PREFIXES.length - 1)]
  const otherSymbols = generateValue(IE_INN_LENGTH - 2)
  const value = `${firstDigit}${otherSymbols}`

  return value + getIECheckSum(value)
}

const generate = (isIE) => generateWithHistory(
  isIE ? 'INNUZIE' : 'INNUZ',
  isIE ? generateIE : generateOrg
)

export {
  generate
}
