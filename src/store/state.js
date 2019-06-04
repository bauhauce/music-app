import { mode } from 'common/js/config'
import * as cache from 'common/js/cache'

const search = cache.loadSearch()
const favorite = cache.loadFavorite()
const play = cache.loadPlay()

const state = {
  playState: false,
  fullscreen: false,
  sequenceList: [],
  playlist: [],
  playMode: mode.sequence,
  currentIndex: -1,
  searchHistory: search,
  favorite: favorite,
  playHistory: play
}

export default state
