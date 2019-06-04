export const playState = state => state.playState

export const fullscreen = state => state.fullscreen

export const sequenceList = state => state.sequenceList

export const playlist = state => state.playlist

export const playMode = state => state.playMode

export const currentIndex = state => state.currentIndex

export const currentSong = state => state.playlist[state.currentIndex]

export const searchHistory = state => state.searchHistory

export const favorite = state => state.favorite

export const playHistory = state => state.playHistory
