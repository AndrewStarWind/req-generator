import { describe, expect, it } from 'vitest'
import { invalid, STATUS, warning } from './common'
import { ALPHANUMERIC, defineValidator } from './define'

// Учебный реквизит: 4 цифры, последняя - сумма первых трёх по модулю 10
const sumChecksum = (value: string) => [...value.slice(0, 3)].reduce((s, d) => s + Number(d), 0) % 10

const validate = defineValidator({
  length: 4,
  checksums: [{ expected: sumChecksum }],
  checks: [
    (value) => value.charAt(0) === '9' ? invalid('Девятка в начале запрещена') : null,
    (value) => value.charAt(0) === '0' ? warning('Ноль в начале подозрителен') : null
  ],
  details: (value) => [['Первая цифра', value.charAt(0)]],
  validMessage: 'Корректный'
})

describe('defineValidator — общая цепочка проверок', () => {
  it.each([
    ['', STATUS.EMPTY, ''],
    ['12a', STATUS.INVALID, 'Допустимы только цифры'],
    ['12', STATUS.INCOMPLETE, 'Введено 2 из 4'],
    ['12345', STATUS.INVALID, 'Слишком длинный: 5 символов вместо 4'],
    ['1235', STATUS.INVALID, 'Контрольная цифра не совпадает: ожидается 6'],
    ['9010', STATUS.INVALID, 'Девятка в начале запрещена'],
    ['0123', STATUS.WARNING, 'Ноль в начале подозрителен'],
    ['1236', STATUS.VALID, 'Корректный'],
    ['1-2 3.6', STATUS.VALID, 'Корректный']
  ])('%j → %s «%s»', (raw, status, message) => {
    expect(validate(raw)).toMatchObject({ status, message })
  })

  it('расшифровка есть у корректного значения и у предупреждения, но не у ошибки', () => {
    expect(validate('1236').details).toEqual([['Первая цифра', '1']])
    expect(validate('0123').details).toEqual([['Первая цифра', '0']])
    expect(validate('9010').details).toEqual([])
  })


  it('pattern проверяет структуру', () => {
    const v = defineValidator({
      length: 3,
      charset: ALPHANUMERIC,
      pattern: { regex: /^[A-Z]\d\d$/, message: 'Буква и две цифры' },
      validMessage: 'ok'
    })
    expect(v('1AB')).toMatchObject({ status: STATUS.INVALID, message: 'Буква и две цифры' })
    expect(v('a12')).toMatchObject({ status: STATUS.VALID })
  })

  it('несколько контрольных цифр, позиция-диапазон и условие when', () => {
    const v = defineValidator({
      length: 4,
      checksums: [
        { expected: () => 1, at: 2, label: '3-я цифра' },
        { expected: () => '23', at: [2, 4], label: 'Хвост', when: (value) => value.charAt(0) !== '0' }
      ],
      validMessage: 'ok'
    })
    expect(v('0010').message).toBe('ok')
    expect(v('0000').message).toBe('3-я цифра не совпадает: ожидается 1')
    expect(v('1010').message).toBe('Хвост не совпадает: ожидается 23')
  })

  it('expected === null — номер невозможен', () => {
    const v = defineValidator({ length: 2, checksums: [{ expected: () => null }], validMessage: 'ok' })
    expect(v('12').message).toMatch(/не может существовать/)
  })
})
