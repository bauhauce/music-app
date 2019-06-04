<template>
  <div class="wrap">
    <div class="progress-bar" ref="progressBar" @click="handleClick">
      <div class="progress" ref="progress"></div>
      <span class="progress-btn" ref="progressBtn"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mprogress',
  data () {
    return {
      touch: {}
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.touchState) {
        const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.offsetWidth
        const offsetWidth = barWidth * newPercent
        this.offsetChange(offsetWidth)
      }
    }
  },
  methods: {
    offsetChange (offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px'
      this.$refs.progressBtn.style.left = offsetWidth + 'px'
    },
    touchStart (e) {
      this.touch.touchState = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    touchMove (e) {
      if (this.touch.touchState) {
        const deltaX = e.touches[0].pageX - this.touch.startX
        const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.offsetWidth
        const offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), barWidth)
        this.offsetChange(offsetWidth)
      }
    },
    touchEnd () {
      this.touch.touchState = false
      this.percentTriger()
    },
    handleClick (e) {
      this.offsetChange(e.offsetX)
      this.percentTriger()
    },
    percentTriger () {
      const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.offsetWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrap
  flex: 1
  .progress-bar
    width: 100%
    height: .1rem
    background: #fff
    position: relative
    .progress
      height: .1rem
      width: 0
      background: skyblue
    .progress-btn
      position: absolute
      left: 0
      top: -0.12rem
      width: .2rem
      height: .2rem
      border: .06rem solid #fff
      border-radius: 50%
      background: skyblue
</style>
