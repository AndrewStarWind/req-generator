import { describe, expect, it } from 'vitest'
import {
  STATUS, validateBin, validateGln, validateIin, validateInnOrg, validateInnPerson,
  validateInnUz, validateKpp, validateOgrn, validateOgrnip, validateOkpoIe, validateOkpoOrg,
  validatePinfl, validateSfr, validateSnils, validateUnp, validateUnpIe, validateUuid,
  type Validator
} from './index'

/** Меняет последнюю цифру - гарантированно портит контрольную сумму. */
const breakLastDigit = (value: string) => value.slice(0, -1) + ((Number(value.at(-1)) + 1) % 10)

const detail = (result: ReturnType<Validator>, name: string) => Object.fromEntries(result.details)[name]

// Реальные или эталонные номера с корректной контрольной суммой
const VALID: Array<[Validator, string]> = [
  [validateInnOrg, '7707083893'], // ИНН ПАО Сбербанк
  [validateInnPerson, '500100732259'],
  [validateOgrn, '1027700132195'], // ОГРН ПАО Сбербанк
  [validateOgrnip, '304500116000157'],
  [validateOkpoOrg, '00032537'], // ОКПО ПАО Сбербанк
  [validateSnils, '11223344595'],
  [validateGln, '4006381333931'], // пример EAN-13 из стандарта GS1
  [validateBin, '000740001307'],
  [validateIin, '850301450124'],
  [validateUnp, '100582333'],
  [validateUnpIe, 'AB1234563'],
  [validatePinfl, '31503850180015']
]

describe.each(VALID)('%s: %s', (validate, value) => {
  it(`принимает ${value}`, () => {
    expect(validate(value).status).toBe(STATUS.VALID)
  })

  it('отклоняет номер с испорченной контрольной цифрой', () => {
    const result = validate(breakLastDigit(value))
    expect(result.status).toBe(STATUS.INVALID)
    expect(result.message).toMatch(/ожидается/)
  })

  it('считает короткое значение неполным', () => {
    expect(validate(value.slice(0, -2)).status).toBe(STATUS.INCOMPLETE)
  })

  it('отклоняет слишком длинное значение', () => {
    expect(validate(value + '1').status).toBe(STATUS.INVALID)
  })

  it('пустая строка — пустой статус', () => {
    expect(validate('').status).toBe(STATUS.EMPTY)
  })
})

describe('нормализация', () => {
  it('игнорирует пробелы, дефисы и точки', () => {
    expect(validateSnils('112-233-445 95').status).toBe(STATUS.VALID)
    expect(validateInnOrg(' 77 07 08 38 93 ').status).toBe(STATUS.VALID)
    expect(validateOgrn('1.027.700.132.195').status).toBe(STATUS.VALID)
  })

  it('не зависит от регистра букв УНП', () => {
    expect(validateUnpIe('ab1234563').status).toBe(STATUS.VALID)
  })

  it('отклоняет посторонние символы', () => {
    expect(validateInnOrg('77070838a3')).toMatchObject({ status: STATUS.INVALID, message: 'Допустимы только цифры' })
  })
})

describe('ИНН', () => {
  it('сообщает ожидаемую контрольную цифру', () => {
    expect(validateInnOrg('7707083894').message).toBe('Контрольная цифра не совпадает: ожидается 3')
  })

  it('указывает, какая из двух контрольных цифр ИНН ИП неверна', () => {
    expect(validateInnPerson('500100732269').message).toMatch(/^11-я цифра/)
    expect(validateInnPerson('500100732258').message).toMatch(/^12-я цифра/)
  })

  it('расшифровывает регион', () => {
    expect(detail(validateInnOrg('7707083893'), 'Код региона')).toBe('77')
  })

  it('распознаёт иностранную организацию', () => {
    expect(validateInnOrg('9909274260').message).toMatch(/иностранной организации/)
  })

  it('предупреждает о несуществующем регионе 00', () => {
    expect(validateInnOrg('0012345673').status).toBe(STATUS.WARNING)
  })
})

describe('ОГРН / ОГРНИП', () => {
  it('предупреждает, если у ОГРН первая цифра от ОГРНИП', () => {
    // контрольная сумма верна, но 3 - признак ИП
    expect(validateOgrn('3027700132193').status).toBe(STATUS.WARNING)
  })

  it('предупреждает, если ОГРНИП начинается не с 3', () => {
    expect(validateOgrnip('104500116000150').status).toBe(STATUS.WARNING)
  })

  it('расшифровывает год и регион', () => {
    const result = validateOgrn('1027700132195')
    expect(detail(result, 'Год присвоения')).toBe('2002')
    expect(detail(result, 'Код региона')).toBe('77')
  })
})

describe('СНИЛС', () => {
  it('не проверяет контрольное число у номеров до 001-001-998', () => {
    expect(validateSnils('00100199800').status).toBe(STATUS.VALID)
  })
})

describe('КПП', () => {
  it('принимает буквы в позициях 5–6', () => {
    expect(validateKpp('7736AB001').status).toBe(STATUS.VALID)
  })

  it('отклоняет буквы в других позициях', () => {
    expect(validateKpp('77A601001').status).toBe(STATUS.INVALID)
  })

  it('расшифровывает причину постановки', () => {
    expect(detail(validateKpp('773601001'), 'Причина постановки')).toMatch(/по месту нахождения/)
  })
})

describe('ОКПО', () => {
  it('различает длину юрлица и ИП', () => {
    expect(validateOkpoOrg('0003253700').status).toBe(STATUS.INVALID)
    expect(validateOkpoIe('00032537').status).toBe(STATUS.INCOMPLETE)
  })
})

describe('ИИН / БИН', () => {
  it('расшифровывает дату рождения и пол', () => {
    const result = validateIin('850301450124')
    expect(detail(result, 'Дата рождения')).toBe('01.03.1985')
    expect(detail(result, 'Пол')).toBe('женский')
  })

  it('предупреждает о дате рождения в будущем', () => {
    expect(validateIin('921120650002').status).toBe(STATUS.WARNING)
  })

  it('отклоняет несуществующую дату', () => {
    // 31.02.1985: контрольная сумма верна, но такой даты нет
    expect(validateIin('850231450124').message).toBe('Несуществующая дата рождения: 31.02.1985')
  })

  it('БИН: отклоняет тип не из 4–6', () => {
    expect(validateBin('850301450124').message).toMatch(/5-я цифра/)
  })

  it('БИН: расшифровывает тип', () => {
    expect(detail(validateBin('000740001307'), 'Тип')).toBe('юрлицо-резидент')
  })

  it('БИН: год регистрации 1995–1999 относит к XX веку', () => {
    expect(detail(validateBin('980340000012'), 'Регистрация')).toBe('03.1998')
    expect(detail(validateBin('000740001307'), 'Регистрация')).toBe('07.2000')
  })
})

describe('УНП', () => {
  it('УНП ИП: отклоняет недопустимую вторую букву', () => {
    expect(validateUnpIe('AZ1234567').message).toMatch(/буква из ABCEHKMOPT/)
  })

  it('УНП ИП: отклоняет буквы после второй позиции', () => {
    expect(validateUnpIe('A1B456789').status).toBe(STATUS.INVALID)
  })

  it('УНП юрлица: только цифры', () => {
    expect(validateUnp('AB1234563').message).toBe('Допустимы только цифры')
  })
})

describe('ПИНФЛ', () => {
  it('расшифровывает дату рождения', () => {
    expect(detail(validatePinfl('31503850180015'), 'Дата рождения')).toBe('15.03.1985')
  })

  it('предупреждает о дате рождения в будущем', () => {
    // 15.03.2099
    expect(validatePinfl('61503990180015').status).toBe(STATUS.WARNING)
  })
})

describe('проверки только формата', () => {
  it('СФР и ИНН UZ принимают любые цифры нужной длины', () => {
    expect(validateSfr('1234567890').status).toBe(STATUS.VALID)
    expect(validateInnUz('212345678').status).toBe(STATUS.VALID)
  })

  it('ИНН UZ не начинается с 0', () => {
    expect(validateInnUz('012345678').status).toBe(STATUS.WARNING)
  })
})

describe('UUID', () => {
  it('принимает UUID в фигурных скобках и любом регистре', () => {
    expect(validateUuid('{3F2504E0-4F89-41D3-9A0C-0305E82C3301}').status).toBe(STATUS.VALID)
  })

  it('отклоняет неверную группировку', () => {
    expect(validateUuid('3f2504e04-f89-41d3-9a0c-0305e82c3301').status).toBe(STATUS.INVALID)
  })
})

describe('признаки валидатора', () => {

  it('normalize: UUID сохраняет дефисы, остальные — нет', () => {
    expect(validateSnils.normalize('112-233-445 95')).toBe('11223344595')
    expect(validateUuid.normalize('{3F2504E0-4F89-41D3-9A0C-0305E82C3301}')).toBe('3f2504e0-4f89-41d3-9a0c-0305e82c3301')
  })
})
