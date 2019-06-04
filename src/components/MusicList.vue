<template>
  <div>
    <h3 class="header" @click="playAll">
      <i class="iconfont icon-play-s"></i>
      <span>播放全部</span>
      <span class="count">(共{{list.length}}首)</span>
      <i class="iconfont icon-clear" @click.stop="handleClear"></i>
    </h3>
    <ul class="list" v-if="list.length">
      <li
        class="list-item"
        v-for="(item, index) of list"
        :key="item.id"
        @click="handleSelect(index)"
      >
        <h4 class="item-index">{{index+1}}</h4>
        <div class="item-desc">
          <h4 class="song">{{item.name}}</h4>
          <p class="singer">{{item.singerName}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'musicList',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    ...mapActions([
      'selectPlay'
    ]),
    playAll () {
      if (this.list.length === 0) {
        return
      }
      this.selectPlay({
        list: this.list,
        index: 0
      })
    },
    handleSelect (index) {
      this.selectPlay({
        list: this.list,
        index: index
      })
    },
    handleClear () {
      this.$emit('clear')
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
  line-height: .8rem
  font-size: .32rem
  .iconfont
    padding: 0 .2rem
  .count
    font-size: .25rem
    color: #999
  .icon-clear
    float: right
.list
  .list-item
    overflow: hidden
    line-height: 1rem
    .item-index
      float: left
      padding: 0 .2rem
      font-size: .36rem
    .item-desc
      margin-left: .8rem
      height: 1rem
      display: flex
      flex-direction: column
      justify-content: center
      .song
        line-height: .5rem
        font-size: .32rem
      .singer
        line-height: .3rem
        font-size: .25rem
        color: #999
</style>
