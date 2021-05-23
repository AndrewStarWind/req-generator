import { generateValue } from './helpers'
import { KPP_TYPES } from './constants'

const TYPE_CODE_GENERATORS = {
  [KPP_TYPES.registration]: () => '01',
  [KPP_TYPES.bigTaxPayer]: () => '50',
  [KPP_TYPES.branch]: () => {
    let type = generateValue(2)

    // let's make sure we didn't get org kpp
    while (['01', '50'].includes(type)) {
      type = generateValue(2)
    }
    return type
  },
  [KPP_TYPES.envd]: () => ['35', '77'][(Math.round(Math.random() * 10)) % 2]
}

const generate = (type) => type
  ? `${generateValue(4)}${TYPE_CODE_GENERATORS[type]()}${generateValue(3)}`
  : generateValue(9)

export {
  generate
}
