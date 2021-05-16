const WEIGHT_DIVIDER = 11;
const weightsStartValues = {
  FIRST: 1,
  SECOND: 3,
};
const CHECKSUM_DIVIDER = 11;
const BAD_CHECKSUM = 10;

const okpoCheckSum = (value, start) => {
  let sum = 0;
  let weight = start;
  const len = value.length;

  for (let i = 0; i < len; i++, weight++) {
    weight %= WEIGHT_DIVIDER;
    if (weight === 0) {
      weight++;
    }
    sum += parseInt(value.charAt(i), 10) * weight;
  }
  return sum % CHECKSUM_DIVIDER;
};

const generateValue = (isIE) => {
  const desiredLength = isIE ? 9 : 7;
  let value = Math.round(Math.random() * Math.pow(10, desiredLength)).toString();

  if (value.length < desiredLength) {
    while (value.length < desiredLength) {
      value = '0' + value;
    }
  }
  return value;
};

const generate = (isIE) => {
  const value = generateValue(isIE);

  let checksum = okpoCheckSum(value, weightsStartValues.FIRST);

  if (checksum === BAD_CHECKSUM) {
    checksum = okpoCheckSum(value, weightsStartValues.SECOND) % 10;
  }
  return value + checksum;
};

export {generate};
