<template>
  <div>
    <div class="wrap">
      <div class="header">
        <i class="iconfont icon-back" @click="handleBack"></i>
        <ul class="nav">
          <li class="nav-item"
            v-for="(item, index) of switchList"
            :key="index"
            :class="{active: index===switchIndex}"
            @click="handleSwitch(index)"
          >{{item}}</li>
        </ul>
      </div>
      <scroll class="content" :data="contentList">
        <div>
          <music-list
            v-for="(item, index) of contentList"
            :key="index"
            :list="item"
            v-show="index===switchIndex"
            @clear="clearList(index)"
          ></music-list>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import MusicList from 'components/MusicList'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'user',
  components: {
    MusicList
  },
  data () {
    return {
      switchList: [
        '我的收藏',
        '最近播放'
      ],
      switchIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'favorite',
      'playHistory'
    ]),
    contentList () {
      return [this.favorite, this.playHistory]
    }
  },
  methods: {
    ...mapActions([
      'deleteFavorite',
      'clearFavorite',
      'deletePlayHistory',
      'clearPlayHistory'
    ]),
    handleBack () {
      this.$router.back()
    },
    handleSwitch (index) {
      this.switchIndex = index
    },
    clearList (index) {
      if (index === 0) {
        this.clearFavorite()
      } else {
        this.clearPlayHistory()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrap
  position: absolute
  top: 0
  right: 0
  bottom: 0
  left: 0
  background: #fff
  .header
    position: relative
    line-height: .86rem
    height: .86rem
    background: red
    .iconfont
      position: absolute
      left: .2rem
      top: 0
      line-height: .86rem
      font-size: .45rem
      color: #fff
    .nav
      overflow: hidden
      display: flex
      justify-content: center
      height: .86rem
      .nav-item
        padding: 0 .6rem
        color: #fff
      .active
        border-bottom: .08rem solid #fff
  .content
    position: absolute
    top: .86rem
    right: 0
    bottom: 0
    left: 0
    overflow: hidden
    background: #eee
</style>
