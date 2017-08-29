'use strict'

/**
 * Symbols
 */
const NEWER = Symbol('newer')
const OLDER = Symbol('older')
const LENGTH = Symbol('length')
const HEAD = Symbol('head')
const ITEMS = Symbol('items')
const MAP_ENTRIES = Symbol('map_entries')

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

  next () {
    return this[OLDER]
  }

  prev () {
    return this[NEWER]
  }
}

/**
 * Map
 * @ignore
 */
class Map {

  constructor () {
    this[LENGTH] = 0
    this[HEAD] = undefined
    this[ITEMS] = {}
  }

  [MAP_ENTRIES] (fn) {
    let item = this[HEAD]
    let result = []

    while (item !== undefined) {
      result.push(fn(item, this))
      item = item.next()
    }

    return result
  }

  get length () {
    return this[LENGTH]
  }

  get (key) {
    let item = this[ITEMS][key]
    return item ? item.value : undefined
  }

  set (key, val) {
    let item = this[ITEMS][key]

    // Exists
    if (item) {
      item.value = val

    // New Entry
    } else {
      item = new Entry(key, val)
      item[OLDER] = this[HEAD]

      if (this[HEAD]) {
        this[HEAD][NEWER] = item
      }

      this[HEAD] = item
      this[ITEMS][key] = item
      this[LENGTH]++
    }

    return this
  }

  refresh (key) {
    let item = this[ITEMS][key]

    if (item) {
      let older = item[OLDER]
      let newer = item[NEWER]

      if (older) {
        older[NEWER] = newer
      }

      if (newer) {
        newer[OLDER] = older
      }

      item[OLDER] = this[HEAD]
      this[HEAD] = item

    // Not found
    } else {
      return false
    }

    return true
  }

  delete (key) {
    let item = this[ITEMS][key]

    if (item) {
      let older = item[OLDER]
      let newer = item[NEWER]

      if (item === this[HEAD]) {
        this[HEAD] = older
      }

      if (older) {
        older[NEWER] = newer
      }

      if (newer) {
        newer[OLDER] = older
      }

      delete this[ITEMS][key]
      this[LENGTH]--

    // Not found
    } else {
      return false
    }

    return true
  }

  map (fn) {
    return this[MAP_ENTRIES](({ key, value }) => fn(value, key, this))
  }

  forEach (fn) {
    this.map(fn)
  }

  reduce (fn, initialState) {
    let item = this[HEAD]
    let state

    if (!initialState) {
      // TODO
      throw new Error('reduce requires initial state')
    } else {
      state = initialState
    }

    while (item !== undefined) {
      state = fn(state, item.value, item.key, this)
      item = item.next()
    }

    return state
  }

  entries () {
    return this[MAP_ENTRIES](item => item.valueOf())
  }

  values () {
    return this[MAP_ENTRIES](({ key, value }) => value)
  }

  keys () {
    return this[MAP_ENTRIES](({ key, value }) => key)
  }
}

/**
 * Exports
 */
module.exports = Map
