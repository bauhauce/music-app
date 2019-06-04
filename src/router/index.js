import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "recommend" */ 'views/recommend/Recommend'),
      children: [
        {
          path: ':id',
          component: () => import(/* webpackChunkName: "detail" */ 'views/detail/Detail')
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import(/* webpackChunkName: "rank" */ 'views/rank/Rank'),
      children: [
        {
          path: ':id',
          component: () => import(/* webpackChunkName: "detail" */ 'views/detail/Detail')
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ 'views/search/Search'),
      children: [
        {
          path: 'singer/:id',
          component: () => import(/* webpackChunkName: "singer" */ 'views/singer/Singer')
        },
        {
          path: 'album/:id',
          component: () => import(/* webpackChunkName: "album" */ 'views/singer/Album')
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkname: "user" */ 'views/user/User')
    }
  ]
})
