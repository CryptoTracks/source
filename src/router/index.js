import Vue from 'vue'
import Router from 'vue-router'
import Tunes from '@/components/Tunes'
import Tune from '@/components/Tune'
import Home from '@/components/Home'
import Library from '@/components/Library'
import WTF from '@/components/WTF'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/tunes',
      name: 'Tunes',
      component: Tunes,
      props: (route) => ({ address: route.query.address })
    },
    {
      path: '/tunes/new',
      name: 'Tune',
      component: Tune
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/library',
      name: 'Library',
      component: Library
    },
    {
      path: '/wtf',
      name: 'WTF',
      component: WTF
    }
  ]
})
