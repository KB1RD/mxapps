import Vue from 'vue'
import VueRouter from 'vue-router'

import Linkback from '../views/Linkback'

import LoginDialog from '../views/login/LoginDialog'
import AccountSelector from '../views/login/AccountSelector'
import NewAccount from '../views/login/NewAccount'
import PasswordLogin from '../views/login/PasswordLogin'
import ConnectionWorking from '../views/login/ConnectionWorking'

import RoomList from '../views/RoomList'
import SidebarView from '../views/SidebarView'
import { state } from '../worker-link'

Vue.use(VueRouter)

const routes = [
  {
    path: '/_linkback/:token',
    component: Linkback
  },
  {
    path: '/',
    component: SidebarView,
    beforeEnter (to, from, next) {
      if (!state.channel) {
        return next({ path: '/login', query: { redirect_to: to.path } })
      }
      if (from.query.account && !to.query.account) {
        to.query.account = from.query.account
        next(to)
      } else {
        next()
      }
    },
    children: [
      { path: '', component: RoomList }
    ]
  },
  {
    path: '/login',
    component: LoginDialog,
    children: [
      { path: '', component: AccountSelector },
      { path: 'new', component: NewAccount },
      { path: 'pass', component: PasswordLogin },
      { path: 'to/:id', component: ConnectionWorking }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
