<template>
  <div>
    <transition :name="direction">
      <slot></slot>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'animation-fade',
  props: {
    direction: {
      type: String,
      default: 'fade'
    }
  }
}
</script>

<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity .5s
.fade-enter, .fade-leave-to
  opacity: 0

.fade-up-enter-active, .fade-up-leave-active
  transition: all .5s
.fade-up-enter, .fade-up-leave-to
  opacity: 0
  transform: translateY(8rem)

.fade-left-enter-active, .fade-left-leave-active
  transition: all .5s
.fade-left-enter, .fade-left-leave-to
  opacity: 0
  transform: translateY(5rem)
</style>
