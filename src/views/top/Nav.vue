<template>
  <div>
    <nav>
      <router-link tag="div" class="nav-item" to="/recommend">推荐</router-link>
      <router-link tag="div" class="nav-item" to="/rank">排行</router-link>
      <router-link tag="div" class="nav-item" to="search">搜索</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'mnav'
}
</script>

<style lang="stylus" scoped>
@import '~styles/varibles.styl'

nav
  display: flex
  justify-content: space-around
  align-items: center
  .nav-item
    font-size: $fontSize2
    margin-bottom: .1rem
    line-height: .56rem
    &.router-link-active
      font-weight: bold
      color: $color2
      border-bottom: 2px solid #f00
</style>
