import { generateValue } from './helpers'

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHABET_FOR_SECOND_LETTER = 'ABCEHKMOPT'

const WEIGHTS = [29, 23, 19, 17, 13, 7, 5, 3]
const BAD_CHECKSUM = 10
const CHECKSUM_DIVIDER = 11
const MAX_NUMBER = 9

const getControlSum = (value) => {
  let controlSum = 0
  let currentSymbol

  for (let index = 0; index < value.length; index++) {
    // вычисляем численное значение символа в разряде
    currentSymbol = ALPHABET.indexOf(value.charAt(index))

    // если это буква
    if (currentSymbol > MAX_NUMBER) {
      // второй символ
      if (index === 1) {
        // численное значение для второго разряда
        currentSymbol = ALPHABET_FOR_SECOND_LETTER.indexOf(value.charAt(index))

        // со второго символа букв быть не может
      } else if (index > 1) {
        // если буква не в первом и втором разряде, то УНП невалидный
        controlSum = false
        break
      }
    }
    controlSum += currentSymbol * WEIGHTS[index]
  }
  if (controlSum !== false) {
    // контрольная сумма - остаток от деления на 11
    controlSum %= CHECKSUM_DIVIDER

    // если контрольная сумма равна 10, то УНП невалидный
    return controlSum !== BAD_CHECKSUM ? controlSum : false
  }
  return false
}

const generateOrg = () => {
  const value = generateValue(8)
  const controlSum = getControlSum(value)

  return controlSum !== false ? (value + controlSum) : generateOrg()
}

const generateIE = () => {
  const firstLetter = ALPHABET_FOR_SECOND_LETTER[
    Math.floor(Math.random() * 10 % 6)
  ]
  const secondLetter = ALPHABET_FOR_SECOND_LETTER[
    Math.floor(Math.random() * 10 % ALPHABET_FOR_SECOND_LETTER.length)
  ]
  const value = `${firstLetter}${secondLetter}${generateValue(6)}`
  const controlSum = getControlSum(value)

  return controlSum !== false ? (value + controlSum) : generateIE()
}

const generate = (isIE) => isIE ? generateIE() : generateOrg()

export {
  generate
}
