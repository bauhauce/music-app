import * as types from './mutation-types'

const mutations = {
  [types.SET_PLAY_STATE] (state, flag) {
    state.playState = flag
  },
  [types.SET_FULLSCREEN] (state, flag) {
    state.fullscreen = flag
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.DELETE_SEQUENCE_LIST] (state, index) {
    state.sequenceList.splice(index, 1)
  },
  [types.CLEAR_SEQUENCE_LIST] (state) {
    state.sequenceList = []
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  [types.DELETE_PLAYLIST] (state, index) {
    state.playlist.splice(index, 1)
  },
  [types.CLEAR_PLAYLIST] (state) {
    state.playlist = []
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.playMode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_SEARCH_HISTORY] (state, list) {
    state.searchHistory = list
  },
  [types.SET_PLAY_HISTORY] (state, list) {
    state.playHistory = list
  },
  [types.SET_FAVORITE] (state, list) {
    state.favorite = list
  }
}

export default mutations
