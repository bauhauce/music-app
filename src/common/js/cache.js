import { serialize, deserialize } from 'common/js/util'

export const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

export const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

export const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function setStorage (key, list) {
  localStorage.setItem(key, serialize(list))
}

function addItem (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (arr.length > maxLen) {
    arr.pop()
  }
}

export function loadSearch () {
  return deserialize(localStorage.getItem(SEARCH_KEY)) || []
}

export function loadPlay () {
  return deserialize(localStorage.getItem(PLAY_KEY)) || []
}

export function loadFavorite () {
  return deserialize(localStorage.getItem(FAVORITE_KEY)) || []
}

export function saveSearch (query) {
  let searchList = loadSearch()
  addItem(searchList, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  setStorage(SEARCH_KEY, searchList)
  return searchList
}

export function savePlay (song) {
  let playList = loadPlay()
  addItem(playList, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  setStorage(PLAY_KEY, playList)
  return playList
}

export function saveFavorite (song) {
  let favoriteList = loadFavorite()
  addItem(favoriteList, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  setStorage(FAVORITE_KEY, favoriteList)
  return favoriteList
}

export function deleteSearch (index) {
  let list = loadSearch()
  list.splice(index, 1)
  setStorage(SEARCH_KEY, list)
  return list
}

export function deletePlay (index) {
  let list = loadPlay()
  list.splice(index, 1)
  setStorage(PLAY_KEY, list)
  return list
}

export function deleteFavorite (song) {
  let list = loadFavorite()
  const index = list.findIndex(item => {
    return song.id === item.id
  })
  list.splice(index, 1)
  setStorage(FAVORITE_KEY, list)
  return list
}
