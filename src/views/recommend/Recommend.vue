<template>
  <div>
    <scroll class="wrap" :data="scrollList">
      <div class="content">
        <div class="banner">
            <loading v-show="!bannerList.length"></loading>
            <swiper :options="swiperOption" ref="mySwiper" v-show="showBanner">
              <swiper-slide
                class="banner-item"
                v-for="item of bannerList"
                :key="item.id"
              >
                <img v-lazy="item.pic" alt="图片">
              </swiper-slide>
              <div class="swiper-pagination"  slot="pagination"></div>
            </swiper>
        </div>
        <div class="music-list">
          <h3>推荐歌单</h3>
          <loading v-show="!recommendList.length"></loading>
          <ul>
            <li class="list-item"
              v-for="item of recommendList"
              :key="item.id"
              @click="handleItemClick(item.id)"
            >
              <div class="cover">
                <img v-lazy="item.picUrl" alt="图片">
                <div class="count"><i class="iconfont icon-listen"></i><span>{{formatNum(item.playCount)}}</span></div>
              </div>
              <p class="desc">{{item.name}}</p>
            </li>
          </ul>
        </div>
        <div class="music-latest">
          <h3>最新音乐</h3>
          <loading v-show="!latestList.length"></loading>
          <ul>
            <li
              class="latest-item"
              v-for="(item, index) of latestList"
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
    </scroll>
    <animation-fade>
      <router-view></router-view>
    </animation-fade>
  </div>
</template>

<script>
import { getBanner, getRecommend, getLatest } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createLatestList } from 'common/js/song'
import { mapActions } from 'vuex'

export default {
  name: 'recommend',
  data () {
    return {
      swiperOption: {
        autoplay: 3000,
        loop: true,
        pagination: '.swiper-pagination',
        initialSlide: 1
      },
      bannerList: [],
      recommendList: [],
      latestList: []
    }
  },
  computed: {
    showBanner () {
      return this.bannerList.length
    },
    scrollList () {
      return this.recommendList.concat(this.latestList)
    }
  },
  mounted () {
    this._getBanner()
    this._getRecommend()
    this._getLatest()
  },
  methods: {
    ...mapActions([
      'selectPlay'
    ]),
    _getBanner () {
      getBanner().then(res => {
        if (res.code === ERR_OK) {
          this.bannerList = res.banners
        }
      })
    },
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommendList = res.result
        }
      })
    },
    _getLatest () {
      getLatest().then(res => {
        if (res.code === ERR_OK) {
          const list = res.result
          this.latestList = createLatestList(list)
        }
      })
    },
    handleItemClick (id) {
      this.$router.push(`/recommend/${id}`)
    },
    handleSelect (index) {
      this.selectPlay({
        list: this.latestList,
        index: index
      })
    },
    formatNum (num) {
      return Math.round(num / 10000) + '万'
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrap >>> .swiper-pagination-bullet-active
  background-color: #fff
.wrap
  position: absolute
  top: 1.52rem
  right: 0
  bottom: 0
  left: 0
  overflow: hidden
  .banner
    width: 100%
    height: 0
    padding-bottom: 38%
    background: #ccc
    .banner-item
      width: 100%
      height: 0
      padding-bottom: 38%
      img
        width: 100%
  .music-list
    h3
      padding-left: .2rem
      line-height: .66rem
      font-size: .36rem
      border-left: .05rem solid #f00
    ul
      display: flex
      flex-wrap: wrap
      justify-content: space-between
      .list-item
        width: 32%
        margin-bottom: .3rem
        .cover
          position: relative
          width: 100%
          height: 0
          padding-bottom: 100%
          img
            width: 100%
          .count
            position: absolute
            top: .12rem
            right: .12rem
            i
              font-size: .2rem
              color: #eee
            span
              font-size: .2rem
              padding-left: .1rem
              color: #eee
        .desc
          padding: .12rem
          font-size: .3rem
  .music-latest
    h3
      padding-left: .2rem
      line-height: .66rem
      font-size: .36rem
      border-left: .05rem solid #f00
    ul
      .latest-item
        position: relative
        margin-bottom: .2rem
        padding-left: .2rem
        border-bottom: .01rem solid #eee
        .song
          width: 80%
          line-height: .55rem
          font-size: .32rem
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
        .singer
          width: 80%
          line-height: .45rem
          font-size: .3rem
          color: #999
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
        .iconfont
          position: absolute
          top: .2rem
          right: .4rem
          font-size: .5rem
          color: #999
</style>
