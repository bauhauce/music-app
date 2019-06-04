import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload'

import Loading from 'components/Loading'
import AnimationFade from 'components/AnimationFade'
import Scroll from 'components/Scroll'

import 'styles/reset.css'
import 'styles/iconfont.css'
import 'swiper/dist/css/swiper.css'

import 'common/js/rem.js'

Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  loading: require('common/image/m.png')
})

Vue.component('loading', Loading)
Vue.component('animation-fade', AnimationFade)
Vue.component('scroll', Scroll)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
