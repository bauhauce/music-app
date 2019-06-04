<template>
  <div>
    <div class="wrap">
      <header><i class="iconfont icon-back" @click="handleBack"></i></header>
      <div class="cover" :style="{backgroundImage: `url(${listCover})`}">
        <h3 class="title">{{listName}}</h3>
      </div>
      <div class="list">
        <h3>歌曲列表</h3>
        <loading v-show="!playlist.length"></loading>
        <ul>
          <li class="list-item"
            v-for="(item, index) of playlist"
            :key="item.id"
            @click="handleSelect(index)"
          >
            <h4 class="song">{{item.name}}</h4>
            <p class="singer">{{item.singerName}}</p>
            <i class="iconfont icon-play-s"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getSingerDetail } from 'api/detail'
import { ERR_OK } from 'api/config'
import { createPlaylist } from 'common/js/song'

import { mapActions } from 'vuex'

export default {
  name: 'singer',
  data () {
    return {
      listCover: '',
      listName: '',
      playlist: []
    }
  },
  mounted () {
    this._getSingerDetail(this.$route.params.id)
  },
  methods: {
    ...mapActions([
      'selectPlay'
    ]),
    handleBack () {
      this.$router.back()
    },
    _getSingerDetail (id) {
      getSingerDetail(id).then(res => {
        if (res.code === ERR_OK) {
          this.listCover = res.artist.picUrl
          this.listName = res.artist.name
          const list = res.hotSongs
          this.playlist = createPlaylist(list)
        }
      })
    },
    handleSelect (index) {
      this.selectPlay({
        list: this.playlist,
        index: index
      })
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
  overflow: auto
  z-index: 1
  background: #eee
  header
    position: fixed
    width: 100%
    background: rgba(20, 20, 20, .5)
    z-index: 2
    .iconfont
      position: relative
      line-height: .86rem
      padding-left: .3rem
      font-size: .5rem
      color: #eee
  .cover
    position: relative
    padding-top: .86rem
    width: 100%
    height: 5rem
    background-size: cover
    background-position: center center
    .title
      position: absolute
      left: .4rem
      bottom: .2rem
      line-height: .6rem
      font-size: .4rem
      color: #fff
  .list
    h3
      padding-left: .2rem
      line-height: .6rem
      font-size: .32rem
      background: #ddd
    ul
      .list-item
        position: relative
        padding: .12rem .4rem
        border-bottom: .01rem solid #eee
        .song
          line-height: .55rem
          font-size: .32rem
        .singer
          line-height: .45rem
          font-size: .3rem
          color: #999
        .iconfont
          position: absolute
          top: .2rem
          right: .4rem
          font-size: .5rem
          color: #999
</style>
