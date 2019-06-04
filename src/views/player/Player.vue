<template>
  <div v-show="playlist.length">
    <div class="wrap">
      <animation-fade direction="fade-up">
        <div class="normal" v-show="fullscreen">
          <div class="background" :style="{backgroundImage: `url(${coverImg})`}"></div>
          <div class="top">
            <i class="iconfont icon-pulldown" @click="handleDown"></i>
            <header>
              <h3 class="title">{{songName}}</h3>
              <p class="singer">{{singerName}}</p>
            </header>
          </div>
          <div class="center" @click="handleCenter">
            <animation-fade>
              <div class="cover" v-show="showCover">
                <img :src="coverImg" class="play" :class="classRotate">
              </div>
            </animation-fade>
            <animation-fade>
              <div class="lyric" v-show="!showCover" ref="lyric">
                <ul v-show="lyricList.length>0">
                  <li
                    class="lyric-item"
                    v-for="(item, index) of lyricList" :key="index"
                    :class="{active: index === currentLine}"
                    ref="lyricLine"
                  >{{item.text}}</li>
                </ul>
                <div class="no-lyric" v-if="lyricList.length===0">
                  <p>{{noLyric}}</p>
                </div>
              </div>
            </animation-fade>
          </div>
          <div class="bottom">
            <div class="progress-wrap">
              <span class="currentTime">{{formatTime(currentTime)}}</span>
              <m-progress :percent="percent" @percentChange="percentChange"></m-progress>
              <span class="totalTime">{{formatTime(totalTime)}}</span>
            </div>
            <div class="control-wrap">
              <i class="iconfont" :class="iconMode" @click="toggleMode"></i>
              <i class="iconfont icon-prev" :class="iconLoad" @click="handlePrev"></i>
              <i class="iconfont icon-mid" :class="[iconPlay, iconLoad]"  @click="togglePlay"></i>
              <i class="iconfont icon-next" :class="iconLoad" @click="handleNext"></i>
              <i class="iconfont" :class="iconLike(currentSong)" @click="toggleLike(currentSong)"></i>
            </div>
          </div>
        </div>
      </animation-fade>
      <div class="mini" v-show="!fullscreen" @click="handleUp">
        <div class="cover">
          <img :src="coverImg">
        </div>
        <div class="desc">
          <h4>{{songName}}</h4>
          <p>{{singerName}}</p>
        </div>
        <div class="control">
          <i class="iconfont" :class="iconPlay" @click.stop="togglePlay"></i>
          <i class="iconfont icon-list1" @click.stop="openPlaylist"></i>
        </div>
      </div>
      <animation-fade>
        <div class="background-wrap" v-show="showPlaylist"></div>
      </animation-fade>
      <animation-fade  direction="fade-up" mode="out-in">
        <div class="playlist-wrap" v-show="showPlaylist" @click="closePlaylist">
          <div class="playlist">
            <h4 class="list-title">
              <span @click.stop="toggleMode">
                <i class="iconfont" :class="iconMode"></i>
                {{textMode}}
                ({{this.sequenceList.length}})
              </span>
              <i class="iconfont icon-clear icon-right" @click.stop="handleClear"></i>
            </h4>
            <ul class="list-content">
              <li v-for="(item, index) of sequenceList" :key="item.id" @click.stop="handleSelect(index)">
                <i class="iconfont icon-left" :class="{'icon-listen': item.id===currentSong.id}"></i>
                <span>{{item.name}}</span>
                <i class="iconfont icon-close icon-right" @click.stop="handleDelete(index)"></i>
              </li>
            </ul>
            <div class="list-close" @click.stop="closePlaylist">关闭</div>
          </div>
        </div>
      </animation-fade>
      <audio
        class="audio"
        id="music-audio"
        :src="songUrl"
        ref="audio"
        autoplay="true"
        @timeupdate="updateTime"
        @ended="handleEnd"
        @canplay="handleReady"
      ></audio>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { mode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { lyricParse } from 'common/js/lyric'
import { getSongUrl, getLyric, getSongDetail } from 'api/player'
import { ERR_OK } from 'api/config'

import BScroll from 'better-scroll'

import MProgress from 'components/Progress'

export default {
  name: 'player',
  components: {
    MProgress
  },
  data () {
    return {
      showCover: true,
      songName: '',
      singerName: '',
      coverImg: '',
      songUrl: '',
      lyricList: [],
      currentLine: 0,
      lyricReady: false,
      currentTime: '',
      totalTime: '',
      percent: 0,
      songReady: false,
      showPlaylist: false,
      timer: {
        prev: null,
        next: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'playState',
      'fullscreen',
      'sequenceList',
      'playlist',
      'playMode',
      'currentIndex',
      'currentSong',
      'favorite'
    ]),
    iconPlay () {
      return this.playState ? 'icon-pause' : 'icon-play'
    },
    classRotate () {
      return this.playState ? 'play' : 'pause'
    },
    iconMode () {
      return this.playMode === mode.sequence ? 'icon-sequence' : (this.playMode === mode.loop ? 'icon-loop' : 'icon-random')
    },
    textMode () {
      return this.playMode === mode.sequence ? '顺序播放' : (this.playMode === mode.loop ? '单曲循环' : '随机播放')
    },
    noLyric () {
      return !this.lyricReady ? '歌词加载中' : '没有歌词'
    },
    iconLoad () {
      return this.songReady ? '' : 'icon-loading'
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (oldSong && newSong.id === oldSong.id) {
        return
      }
      this.$refs.audio.pause()
      this.currentTime = 0
      this.songName = this.currentSong.name
      this.singerName = this.currentSong.singerName
      this._getCoverImg(this.currentSong.id)
      this._getSongUrl(this.currentSong.id)
      this._getLyric(this.currentSong.id)
      this.savePlayHistory(this.currentSong)
    },
    playState (newState) {
      const audio = this.$refs.audio
      if (!this.songReady) {
        return
      }
      this.$nextTick(function () {
        newState ? audio.play() : audio.pause()
      })
    },
    playMode () {
      this.$refs.audio.loop = this.playMode === mode.loop
    },
    currentLine (newLine) {
      if (newLine > 6) {
        let ele = this.$refs.lyricLine[newLine - 6]
        this.scroll.scrollToElement(ele, 1000)
      } else {
        this.scroll.scrollTo(0, 0, 1000)
      }
    }
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.lyric, {
      click: true
    })
    document.addEventListener('touchStart', () => {
      this.$refs.audio.play()
    })
  },
  methods: {
    ...mapMutations({
      setFullscreen: 'SET_FULLSCREEN',
      setPlayState: 'SET_PLAY_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'selectItem',
      'deleteItem',
      'clearList',
      'saveFavorite',
      'deleteFavorite',
      'savePlayHistory'
    ]),
    handleSelect (index) {
      this.selectItem({
        list: this.sequenceList,
        index: index
      })
    },
    handleDelete (index) {
      this.deleteItem(index)
    },
    handleClear () {
      this.clearList()
      this.showPlaylist = false
    },
    handleCenter () {
      this.showCover = !this.showCover
    },
    handleDown () {
      this.setFullscreen(false)
    },
    handleUp () {
      this.setFullscreen(true)
    },
    togglePlay () {
      if (!this.songReady) {
        return
      }
      this.setPlayState(!this.playState)
    },
    handlePrev () {
      // this.$refs.audio.pause()
      // this.currentTime = 0
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      index = index < 0 ? this.playlist.length - 1 : index
      this.setCurrentIndex(index)
      if (!this.playState) {
        this.togglePlay()
      }
    },
    handleNext () {
      // this.$refs.audio.pause()
      // this.currentTime = 0
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      index = index === this.playlist.length ? 0 : index
      this.setCurrentIndex(index)
      if (!this.playState) {
        this.togglePlay()
      }
    },
    toggleMode () {
      let currentMode = (this.playMode + 1) % 3
      let list = this.sequenceList.slice()
      let currentId = this.currentSong.id
      let index = this.currentIndex
      if (currentMode === mode.random) {
        list = shuffle(list)
      }
      index = list.findIndex(item => {
        return item.id === currentId
      })
      this.setPlaylist(list)
      this.setCurrentIndex(index)
      this.setPlayMode(currentMode)
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
      this.totalTime = e.target.duration
      this.percent = this.currentTime / this.totalTime
      if (this.lyricList.length > 0) {
        this.updateLyric(this.currentTime * 1000)
      }
    },
    percentChange (percent) {
      if (this.songReady) {
        this.$refs.audio.currentTime = this.totalTime * percent
        this.setPlayState(true)
      }
    },
    handleEnd () {
      this.handleNext()
    },
    handleReady () {
      this.songReady = true
      if (this.playState) {
        this.$refs.audio.play()
      }
    },
    _getSongUrl (id) {
      this.songReady = false
      getSongUrl(id).then(res => {
        if (res.code === ERR_OK) {
          this.songUrl = res.data[0].url
        }
      })
    },
    _getLyric (id) {
      this.lyricList = []
      this.lyricReady = false
      getLyric(id).then(res => {
        if (res.code === ERR_OK) {
          if (res.nolyric) {
            this.lyricReady = true
          } else {
            const str = res.lrc.lyric
            this.lyricList = lyricParse(str)
          }
        }
      }).catch((e) => {
        this.lyricReady = true
        console.log('err', e)
      })
    },
    _getCoverImg (id) {
      if (this.currentSong.coverImg) {
        this.coverImg = this.currentSong.coverImg
      } else {
        getSongDetail(id).then(res => {
          if (res.code === ERR_OK) {
            this.coverImg = res.songs[0].al.picUrl
          }
        }).catch(() => {
          this.coverImg = ''
        })
      }
    },
    updateLyric (curTime) {
      const lastIndex = this.lyricList.length - 1
      if (curTime >= this.lyricList[lastIndex].time) {
        this.currentLine = lastIndex - 1
      } else {
        let index = this.lyricList.findIndex(item => {
          return curTime < item.time
        })
        this.currentLine = index - 1
      }
    },
    openPlaylist () {
      this.showPlaylist = true
    },
    closePlaylist () {
      this.showPlaylist = false
    },
    toggleLike (song) {
      if (!song) {
        return
      }
      this.isFavorite(song) ? this.deleteFavorite(song) : this.saveFavorite(song)
    },
    iconLike (song) {
      return this.isFavorite(song) ? 'icon-liked' : 'icon-like'
    },
    isFavorite (song) {
      if (!song) {
        return
      }
      let index = this.favorite.findIndex(item => {
        return song.id === item.id
      })
      return index >= 0
    },
    formatTime (time) {
      if (time) {
        let minute = Math.floor(time / 60)
        let second = this.padNum(Math.floor(time % 60))
        return minute + ':' + second
      } else {
        return '--:--'
      }
    },
    padNum (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrap
  z-index: 10
  .normal
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 10
    background: #999
    .background
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      opacity: .5
      filter: blur(30px)
      background-color: rgba(0,0,0,.8)
    .top
      position: absolute
      top: 0
      right: 0
      left: 0
      height: 1.5rem
      .iconfont
        position: absolute
        top: 0
        left: 0
        padding-left: .3rem
        line-height: 1.2rem
        font-size: .45rem
        color: #eee
      header
        text-align: center
        color: #eee
        .title
          margin: 0 auto
          padding-top: .2rem
          width: 80%
          line-height: .6rem
          font-size: .36rem
        .singer
          margin-top: .2rem
          line-height: .4rem
          font-size: .3rem
    .center
      position: absolute
      top: 1.5rem
      right: 0
      bottom: 3rem
      left: 0
      .cover
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: 70%
        height: 0
        padding-bottom: 70%
        border-radius: 50%
        border: .4rem solid rgba(100,100,100,.2)
        overflow: hidden
        img
          width: 100%
          border-radius: 50%
        .play
          animation: rotate 12s linear infinite
        .pause
          animation-play-state: paused
      .lyric
        position: absolute
        top: .5rem
        right: 0
        bottom: .5rem
        left: 0
        padding: 0 .2rem
        text-align: center
        overflow: hidden
        ul
          .lyric-item
            line-height: .6rem
            font-size: .32rem
          .active
            color: #eee
        .no-lyric
          position: absolute
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
    .bottom
      position: absolute
      right: 0
      bottom: 0
      left: 0
      padding-bottom: .5rem
      height: 2.5rem
      .progress-wrap
        height: .5rem
        display: flex
        justify-content: space-around
        align-items: center
        span
          margin: 0 .2rem
          color: #eee
      .control-wrap
        height: 2rem
        display: flex
        justify-content: space-around
        align-items: center
        .iconfont
          font-size: .8rem
          color: #fff
        .icon-mid
          font-size: 1rem
        .icon-liked
          color: red
        .icon-loading
          opacity: .3
  .mini
    position: absolute
    right: 0
    bottom: 0
    left: 0
    height: 1.6rem
    background: rgba(220, 220, 220, .8)
    z-index: 12
    .cover
      float: left
      padding: .15rem
      width: 1.3rem
      height: 1.3rem
      overflow: hidden
      img
        width:100%
    .desc
      float: left
      width: 45%
      height: 1.6rem
      display: flex
      flex-direction: column
      justify-content: center
      font-size: .28rem
      line-height: .5rem
      h4
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
      p
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
    .control
      float: right
      height: 1.6rem
      line-height: 1.6rem
      .iconfont
        font-size: .8rem
        margin-right: .3rem
  .background-wrap
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    background: rgba(0,0,0,.3)
    z-index: 20
  .playlist-wrap
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 20
    .playlist
      position: absolute
      right: 0
      bottom: 0
      left: 0
      background: #fff
      .list-title
        line-height: .8rem
        padding: 0 .2rem
        .icon-right
          float: right
      .list-content
        height: 8rem
        overflow: auto
        li
          line-height: .8rem
          padding: 0 .2rem
          overflow: hidden
          .icon-left
            float: left
            margin-right: .1rem
          span
            float: left
            width: 80%
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
          .icon-right
            float: right
      .list-close
        line-height: .8rem
        font-size: .36rem
        text-align: center
  // .audio
  //   display: none
@keyframes rotate
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>
