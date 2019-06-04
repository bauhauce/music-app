<template>
  <div id="app">
    <m-header></m-header>
    <m-nav></m-nav>
    <animation-fade>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </animation-fade>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'views/top/Header'
import MNav from 'views/top/Nav'
import Player from 'views/player/Player'

export default {
  // 解决移动端无法autoplay问题
  // data () {
  //   return {
  //     stop: false,
  //     timer: null
  //   }
  // },
  // mounted () {
  //   let m = document.querySelector('#app')
  //   m.addEventListener('touchend', this.firstPlay)
  // },
  // methods: {
  //   firstPlay () {
  //     let music = document.querySelector('#music-audio')
  //     if (this.timer) {
  //       clearTimeout(this.timer)
  //     }
  //     this.timer = setTimeout(() => {
  //       music.play()
  //     }, 500)
  //     if (music.readyState === 4) {
  //       this.stop = true
  //     }
  //   }
  // },
  // watch: {
  //   stop () {
  //     let m = document.querySelector('#app')
  //     m.removeEventListener('touchend', this.firstPlay)
  //   }
  // },
  components: {
    MHeader,
    MNav,
    Player
  }
}
</script>

<style lang="stylus">
#app
  position: absolute
  top: 0
  right: 0
  bottom: 0
  left: 0
</style>
