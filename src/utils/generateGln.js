import { generateWithHistory } from './helpers'

const generate = generateWithHistory.bind(null, 'GLN', () => {
  var base = Number(Math.random().toString().substr(2, 13));

  // Calculate check digit
  var total = ~~(base / 1000000000000 % 10) * 1;  // 1
  total += ~~(base / 100000000000 % 10) * 3;  // 2
  total += ~~(base / 10000000000 % 10) * 1;  // 3
  total += ~~(base / 1000000000 % 10) * 3;  // 4
  total += ~~(base / 100000000 % 10) * 1;  // 5
  total += ~~(base / 10000000 % 10) * 3;  // 6
  total += ~~(base / 1000000 % 10) * 1;  // 7
  total += ~~(base / 100000 % 10) * 3;  // 8
  total += ~~(base / 10000 % 10) * 1;  // 9
  total += ~~(base / 1000 % 10) * 3;  // 10
  total += ~~(base / 100 % 10) * 1;  // 11
  total += ~~(base / 10 % 10) * 3;  // 12

  var check_digit = Math.abs(total - Math.ceil(total / 10.0) * 10);
  var result = base.toString();

  return result.substr(0, 12) + check_digit.toString();
})

export {
  generate
}
