<template>
  <div>
    <div class="wrap">
      <div class="search-wrap">
        <i class="iconfont icon-search1"></i>
        <input
          class="search"
          type="text"
          placeholder="搜索歌曲"
          v-model="query"
        >
        <i class="iconfont icon-close-s" v-show="query" @click="handleClose"></i>
      </div>
      <div class="search-query">
        <dl class="hot">
            <dt class="hot-title">热门搜索</dt>
            <dd
              class="hot-item"
              v-for="(item, index) of hotList"
              :key="index"
              @click="handleSearch(item.first)"
            >{{item.first}}</dd>
          </dl>
          <div class="history">
            <h3 class="history-title">搜索历史 <i class="iconfont icon-clear" @click="handleClear"></i></h3>
            <scroll class="history-content" :data="searchHistory">
              <ul>
                <li
                  class="history-item"
                  v-for="(item, index) of searchHistory"
                  :key="index"
                  @click="handleSearch(item)"
                >
                  {{item}}
                  <i class="iconfont icon-close" @click.stop="handleDelete(index)"></i>
                </li>
              </ul>
            </scroll>
          </div>
      </div>
      <div class="search-content" v-show="query">
        <div class="search-suggest" v-show="!searchState.start">
          <ul>
            <li class="suggest-item keyword" @click="handleSearch(query)">搜索"{{query}}"</li>
            <li class="suggest-item"
              v-for="(item, index) of suggestList"
              :key="index"
              @click="handleSearch(item.keyword)"
            >{{item.keyword}}</li>
          </ul>
        </div>
        <scroll class="search-result" v-show="searchState.start" :data="resultList">
          <div class="result-content">
            <p v-show="!searchState.result&&resultList.length===0">搜索中...</p>
            <p v-show="noResult">暂无搜索结果</p>
            <dl class="match" v-show="noMatch">
              <dt>最佳匹配</dt>
              <dd class="result-item match-item" v-if="matchList.album" @click="handleMatchAlbum(matchList.album[0].id)">
                <div class="cover">
                  <img :src="optimizeImg(matchList.album[0].picUrl)">
                </div>
                <div class="desc">
                  <h4>专辑：{{matchList.album[0].name}}</h4>
                  <p>{{matchList.album[0].artist.name}}</p>
                </div>
                <i class="iconfont icon-ahead"></i>
              </dd>
              <dd class="result-item match-item" v-if="matchList.artist" @click="handleMatchSinger(matchList.artist[0].id)">
                <div class="cover">
                  <img :src="optimizeImg(matchList.artist[0].img1v1Url)">
                </div>
                <div class="desc">
                  <h4>歌手：{{matchList.artist[0].name}}</h4>
                </div>
                <i class="iconfont icon-ahead"></i>
              </dd>
            </dl>
            <ul class="song">
              <li
                class="result-item song-item"
                v-for="(item, index) of resultList"
                :key="item.id"
                @click="handleSelect(index)"
              >
                <div class="desc">
                  <h4 class="song-name">{{item.name}}</h4>
                  <p class="singer-name">{{item.singerName}}</p>
                </div>
                <i class="iconfont icon-play-s"></i>
              </li>
            </ul>
          </div>
        </scroll>
      </div>
    </div>
    <animation-fade>
      <router-view></router-view>
    </animation-fade>
  </div>
</template>

<script>
import { getHot, getSearchSuggest, getSearchMatch, getSearchResult } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSearchList } from 'common/js/song'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'search',
  data () {
    return {
      hotList: [],
      query: '',
      suggestList: [],
      matchList: {},
      resultList: [],
      searchState: {
        start: false,
        result: false,
        suggestReady: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
    noResult () {
      return this.searchState.result && this.resultList.length === 0 && !this.noMatch
    },
    noMatch () {
      return this.matchList.album || this.matchList.artist
    }
  },
  watch: {
    query () {
      if (!this.searchState.suggestReady) {
        return
      }
      if (this.query === '') {
        this.suggestList = []
      } else {
        let timer = null
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          this._getSearchSuggest(this.query)
        }, 300)
      }
    }
  },
  mounted () {
    this._getHot()
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
    _getHot () {
      getHot().then(res => {
        if (res.code === ERR_OK) {
          this.hotList = res.result.hots
        }
      })
    },
    _getSearchSuggest (query) {
      this.searchState.start = false
      if (!this.query) {
        return
      }
      getSearchSuggest(query).then(res => {
        if (res.code === ERR_OK) {
          this.suggestList = res.result.allMatch
        }
      })
    },
    handleSearch (keyword) {
      this.query = keyword
      this.searchState.suggestReady = false
      this.searchState.start = true
      this.searchState.result = false
      this.matchList = {}
      this.resultList = []
      this._getSearchMatch(keyword)
      this._getSearchResult(keyword)
      this.saveSearchHistory(keyword)
    },
    _getSearchMatch (keyword) {
      getSearchMatch(keyword).then(res => {
        if (res.code === ERR_OK) {
          this.matchList = res.result
        }
      })
    },
    _getSearchResult (keyword) {
      getSearchResult(keyword).then(res => {
        if (res.code === ERR_OK) {
          if (res.result.songs) {
            const list = res.result.songs
            this.resultList = createSearchList(list)
          } else {
            this.resultList = []
          }
          this.searchState.result = true
          this.searchState.suggestReady = true
        }
      }).catch(() => {
        this.resultList = []
        this.searchState.result = true
        this.searchState.suggestReady = true
      })
    },
    handleClose () {
      this.query = ''
    },
    handleSelect (index) {
      this.selectPlay({
        list: this.resultList,
        index: index
      })
    },
    handleDelete (index) {
      this.deleteSearchHistory(index)
    },
    handleClear () {
      this.clearSearchHistory()
    },
    handleMatchSinger (id) {
      this.$router.push(`/search/singer/${id}`)
    },
    handleMatchAlbum (id) {
      this.$router.push(`/search/album/${id}`)
    },
    optimizeImg (src) {
      return src + '?param=140y140&type=webp'
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrap
  position: absolute
  top: 1.52rem
  right: 0
  bottom: 0
  left: 0
  .search-wrap
    position: relative
    margin: .4rem .2rem
    line-height: .6rem
    border-radius: .08rem
    background-color: #eee
    .icon-search1
      position: absolute
      top: .04rem
      left: .1rem
      color: #666
    .search
      width: 100%
      text-indent: .6rem
      background-color: #eee
    .icon-close-s
      position: absolute
      top: .04rem
      right: .1rem
      color: #666
  .search-query
    position: absolute
    top: 1.4rem
    right: 0
    bottom: 0
    left: 0
    overflow: auto
    .hot
      padding: 0 .2rem
      overflow: hidden
      .hot-title
        line-height: .5rem
        font-size: .3rem
        color: #999
      .hot-item
        float: left
        margin-right: .2rem
        margin-bottom: .2rem
        padding: .16rem
        border: .01rem solid #ccc
        border-radius: .08rem
    .history
      position: absolute
      top: 3.5rem
      right: 0
      bottom: 0
      left: 0
      .history-title
        padding: 0 .2rem
        line-height: 1rem
        font-size: .3rem
        color: #999
        .iconfont
          float: right
          margin-right: .2rem
      .history-content
        position: absolute
        top: 1rem
        right: 0
        bottom: 0
        left: 0
        overflow: hidden
        padding: 0 .2rem
        .history-item
          line-height: 1rem
          fong-size: .3rem
          border-bottom: .01rem solid #eee
          .iconfont
            float: right
            margin-right: .2rem
  .search-content
    position: absolute
    top: 1.4rem
    right: 0
    bottom: 0
    left: 0
    // overflow: hidden
    background: #fff
    .search-suggest
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      p
        line-height: .8rem
        font-size: .36rem
        color: #333
        border-bottom: .01rem solid #eee
      ul
        padding: 0 .3rem
        .suggest-item
          line-height: .8rem
          font-size: .36rem
          color: #333
          border-bottom: .01rem solid #eee
        .keyword
          color: red
    .search-result
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      padding: 0 .3rem
      overflow: hidden
      .result-item
        position: relative
        height: 1.2rem
        color: #333
        border-bottom: .01rem solid #eee
        .cover
          float: left
          width: 1rem
          height: 1rem
          padding: .1rem 0
          margin-right: .4rem
          img
            width: 100%
        .desc
          float: left
          display: flex
          flex-direction: column
          justify-content: center
          width: 70%
          height: 1.2rem
          h4
            line-height: .5rem
            font-size: .32rem
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
          p
            line-height: .36rem
            font-size: .25rem
            color: #999
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
        .iconfont
          position: absolute
          top: 50%
          right: .2rem
          transform: translateY(-50%)
          font-size: .5rem
          color: #999
</style>
