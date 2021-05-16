const generateValue = (length) => {
  let value = Math.round(Math.random() * Math.pow(10, length)).toString()

  if (value.length < length) {
    while (value.length < length) {
      value = Math.round(Math.random() * 10).toString() + value
    }
  }
  return value
}

export {
  generateValue
}
