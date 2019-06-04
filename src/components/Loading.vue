<template>
  <div>
    <div class="load-wrap">
      <div class="loading"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style lang="stylus" scoped>
.load-wrap
  margin: 0 auto
  padding: 1rem 0
  width: .6rem
  height: .6rem
  .loading
    width: 100%
    height: 100%
    border: .06rem solid #999
    border-left-color: transparent
    border-right-color: transparent
    border-radius: 50%
    animation: load 1s linear infinite
@keyframes load {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}
</style>
