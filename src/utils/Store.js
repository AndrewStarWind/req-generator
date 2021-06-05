const LS_ITEM_NAME = 'req-gen-data'
class Store {
  static async getFromChromeStorage () {
    return new Promise((resolve) => {
      if (chrome?.storage) {
        try {
          return chrome.storage.local.get([LS_ITEM_NAME], (data) => {
            resolve(data[LS_ITEM_NAME])
          })
        } catch (err) {
          console.log(err)
        }
        return {}
      }
      resolve({})
    })
  }

  static async init () {
    let data = {}
    try {
      data = JSON.parse(localStorage.getItem(LS_ITEM_NAME)) || await Store.getFromChromeStorage() || {}
    } catch (err) {
      console.log(err)
    }

    Store._data = data
  }

  static async saveData () {
    localStorage.setItem(LS_ITEM_NAME, JSON.stringify(Store._data))
    if (chrome?.storage) {
      await new Promise(resolve => {
        chrome?.storage?.local?.set?.({ [LS_ITEM_NAME]: JSON.stringify(Store._data) }, resolve)
      })
    }
  }

  static getValue (requisite) {
    return Store._data[requisite]?.value || ''
  }

  static getHistory (requisite) {
    return Store._data?.[requisite]?.history || []
  }

  static clearHistory (requisite) {
    if (Store._data?.[requisite]?.history) {
      Store._data[requisite].history = []
    }
  }

  static setValue (requisite, value) {
    if (!Store._data[requisite]) {
      Store._data[requisite] = {
        value: '',
        history: []
      }
    }
    Store._data[requisite].value = value
    Store._data[requisite].history.push(value)
    Store.saveData()
  }
}

export default Store
