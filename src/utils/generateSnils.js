import { generateValue, addZero } from './helpers'

const CHECKSUM_FIRST_DIVIDER = 101
const CONTROL_DIGITS_DIVIDER = 100
const VALUE_LAST_INDEX = 9

const getControlSum = (value) => {
  // Считаем контрольную сумму ( сумма произведений цифры на( 10 - (позиция, на которой она стоит) ) )
  const snilsNum = value.substr(0, VALUE_LAST_INDEX)
  let ctrlDigs = 0

  for (let i = 1, j = VALUE_LAST_INDEX; i <= VALUE_LAST_INDEX; i++, j--) {
    ctrlDigs += parseInt(snilsNum.substr(i - 1, 1), 10) * j
  }

  // Посчитанную контрольную сумму надо взять по модулю 101 и после этого
  // по модулю 100( контрольная сумма для 100 должна быть 00 )
  return (ctrlDigs % CHECKSUM_FIRST_DIVIDER) % CONTROL_DIGITS_DIVIDER
}

const generate = () => {
  const value = generateValue(9)

  return value + addZero(getControlSum(value))
}

export {
  generate
}
