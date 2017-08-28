'use strict'

/**
 * Symbols
 */
const NEWER = Symbol('newer')
const OLDER = Symbol('older')

/**
 * Entry
 * @ignore
 */
class Entry {

  constructor (key, value) {
    this.key = key
    this.value = value
    this[NEWER] = undefined
    this[OLDER] = undefined
  }
}

/**
 * Map
 * @ignore
 */
class Map {

  constructor () {
    this.length = 0
    this.head = undefined
    this.items = {}
  }

  get (key) {
    let item = this.items[key]
    return item ? item.value : undefined
  }

  set (key, val) {
    let item = this.items[key]

    // Exists
    if (item) {
      item.value = val

    // New Entry
    } else {
      item = new Entry(key, val)
      item[OLDER] = this.head

      if (this.head) {
        this.head[NEWER] = item
      }

      this.head = item
      this.items[key] = item
      this.length++
    }

    return true
  }

  refresh (key) {
    let item = this.items[key]

    if (item) {
      let older = item[OLDER]
      let newer = item[NEWER]

      if (older) {
        older[NEWER] = newer
      }

      if (newer) {
        newer[OLDER] = older
      }

      item[OLDER] = this.head
      this.head = item

    // Not found
    } else {
      return false
    }

    return true
  }

  delete (key) {
    let item = this.items[key]

    if (item) {
      let older = item[OLDER]
      let newer = item[NEWER]

      if (older) {
        older[NEWER] = newer
      }

      if (newer) {
        newer[OLDER] = older
      }

      delete this.items[key]
      this.length--

    // Not found
    } else {
      return false
    }

    return true
  }
}

/**
 * Exports
 */
module.exports = Map
