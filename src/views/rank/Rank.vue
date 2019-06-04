<template>
  <div>
    <scroll class="wrap" :data="scrollList">
      <div class="content">
        <div class="netease-list">
          <h3 class="list-title">云音乐官方榜</h3>
          <loading v-show="!neteaseList.length"></loading>
          <ul>
            <li
              class="list-item"
              v-for="list of neteaseList"
              :key="list.id"
              @click="handleListClick(list.id)"
            >
              <div class="cover">
                <img v-lazy="list.coverImgUrl" alt="图片">
              </div>
              <ul class="content" >
                <li
                  class="item"
                  v-for="(item, index) of list.tracks"
                  :key="index"
                >
                  {{formatName(index, item.first, item.second)}}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="other-list">
          <h3 class="list-title">更多热门榜单</h3>
          <loading v-show="!otherList.length"></loading>
          <ul>
            <li
              class="list-item"
              v-for="list of otherList"
              :key="list.id"
              @click="handleListClick(list.id)"
            >
              <div class="cover">
                <img v-lazy="list.coverImgUrl" alt="图片">
              </div>
              <p class="desc">{{list.name}}</p>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <animation-fade>
      <router-view></router-view>
    </animation-fade>
  </div>
</template>

<script>
import { getRank } from 'api/rank'
import { ERR_OK } from 'api/config'

export default {
  name: 'rank',
  data () {
    return {
      neteaseList: [],
      otherList: []
    }
  },
  computed: {
    scrollList () {
      return this.neteaseList.concat(this.otherList)
    }
  },
  mounted () {
    this._getRank()
  },
  methods: {
    _getRank () {
      getRank().then(res => {
        if (res.code === ERR_OK) {
          const list = res.list
          this.neteaseList = list.filter(item => {
            return item.tracks.length > 0
          })
          this.otherList = list.filter(item => {
            return item.tracks.length === 0
          })
          this.otherList.length = 18
        }
      })
    },
    handleListClick (id) {
      this.$router.push(`/Rank/${id}`)
    },
    formatName (index, first, second) {
      return `${index + 1}. ${first} - ${second}`
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
  overflow: hidden
  .netease-list
    padding: 0 .12rem
    .list-title
      line-height: .8rem
      font-size: .35rem
    .list-item
      overflow: hidden
      margin-bottom: .2rem
      padding: .12rem 0
      border-bottom: .01rem solid #ccc
      .cover
        float: left
        width: 2.2rem
        height: 2.2rem
        border-radius: .08rem
        overflow: hidden
        img
          width: 100%
      .content
        margin-left: 2.5rem
        line-height: 0.7rem
        .item
          font-size: .32rem
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
  .other-list
    padding: 0 .12rem
    .list-title
      line-height: .8rem
      font-size: .35rem
    ul
      display: flex
      justify-content: space-between
      flex-wrap: wrap
      .list-item
        width: 30%
        margin-bottom: 2%
        .cover
          width: 100%
          height: 0
          padding-bottom: 100%
          border-radius: .08rem
          overflow: hidden
          img
            width: 100%
        .desc
          padding: .1rem
</style>
