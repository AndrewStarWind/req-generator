const copyTextToClipboard = (text) => {
  navigator.clipboard.writeText(text)
}

export {
  copyTextToClipboard
}
