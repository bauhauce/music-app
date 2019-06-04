import * as types from './mutation-types'
import { mode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import * as cache from 'common/js/cache'

export function selectPlay ({ state, commit }, { list, index }) {
  commit(types.SET_PLAY_STATE, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  let curList = list.slice()
  const curId = list[index].id
  if (state.playMode === mode.random) {
    curList = shuffle(curList)
    index = curList.findIndex(item => {
      return item.id === curId
    })
  }
  commit(types.SET_PLAYLIST, curList)
  commit(types.SET_CURRENT_INDEX, index)
}

export function selectItem ({ state, commit }, { list, index }) {
  commit(types.SET_PLAY_STATE, true)
  commit(types.SET_SEQUENCE_LIST, list)
  let curList = list.slice()
  const curId = list[index].id
  if (state.playMode === mode.random) {
    curList = shuffle(curList)
    index = curList.findIndex(item => {
      return item.id === curId
    })
  }
  commit(types.SET_PLAYLIST, curList)
  commit(types.SET_CURRENT_INDEX, index)
}

export function deleteItem ({ state, commit }, index) {
  const curId = state.sequenceList[index].id
  commit(types.DELETE_SEQUENCE_LIST, index)
  if (state.playMode === mode.random) {
    index = state.playlist.findIndex(item => {
      return item.id === curId
    })
  }
  commit(types.DELETE_PLAYLIST, index)
  if (index < state.currentIndex) {
    commit(types.SET_CURRENT_INDEX, state.currentIndex - 1)
  }
}

export function clearList ({ commit }) {
  commit(types.CLEAR_SEQUENCE_LIST)
  commit(types.CLEAR_PLAYLIST)
  commit(types.SET_PLAY_STATE, false)
  commit(types.SET_FULLSCREEN, false)
  commit(types.SET_CURRENT_INDEX, -1)
}

export function saveSearchHistory ({ commit }, query) {
  let list = cache.saveSearch(query)
  commit(types.SET_SEARCH_HISTORY, list)
}

export function deleteSearchHistory ({ commit }, index) {
  let list = cache.deleteSearch(index)
  commit(types.SET_SEARCH_HISTORY, list)
}

export function clearSearchHistory ({ commit }) {
  localStorage.removeItem(cache.SEARCH_KEY)
  commit(types.SET_SEARCH_HISTORY, [])
}

export function savePlayHistory ({ commit }, song) {
  let list = cache.savePlay(song)
  commit(types.SET_PLAY_HISTORY, list)
}

export function deletePlayHistory ({ commit }, index) {
  let list = cache.deletePlay(index)
  commit(types.SET_PLAY_HISTORY, list)
}

export function clearPlayHistory ({ commit }) {
  localStorage.removeItem(cache.PLAY_KEY)
  commit(types.SET_PLAY_HISTORY, [])
}

export function saveFavorite ({ commit }, song) {
  let list = cache.saveFavorite(song)
  commit(types.SET_FAVORITE, list)
}

export function deleteFavorite ({ commit }, song) {
  let list = cache.deleteFavorite(song)
  commit(types.SET_FAVORITE, list)
}

export function clearFavorite ({ commit }) {
  localStorage.removeItem(cache.FAVORITE_KEY)
  commit(types.SET_FAVORITE, [])
}
