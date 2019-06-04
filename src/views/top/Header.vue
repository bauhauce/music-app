<template>
  <div>
    <header>
      <i class="iconfont icon-list2" @click="handleClick"></i>
      music</header>
  </div>
</template>

<script>
export default {
  name: 'mheader',
  methods: {
    handleClick () {
      this.$router.push('/user')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/varibles.styl'

header
  position: relative
  line-height: .86rem
  text-align: center
  font-size: $fontSize1
  background-color: $bgColor1
  color: $color1
  .iconfont
    position: absolute
    left: .2rem
    line-height: .86rem
    height: .86rem
    font-size: .5rem
</style>
