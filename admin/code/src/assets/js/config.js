import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Lockr from 'lockr'
import Cookies from 'js-cookie'
import _ from 'lodash'
import moment from 'moment'
import locale from 'moment/locale/zh-cn.js' // moment中文
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'

Vue.use(VueI18n)
Vue.use(Vuex)
Vue.config.lang = 'zh'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import 'font-awesome/css/font-awesome.css'

import constGlobal from 'assets/js/constGlobal'
import http from 'assets/js/http'
import global from 'assets/js/global'

const FastClick = require('fastclick')
FastClick.attach(document.body)

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'assets/css/theme/my-theme/index.less'
Vue.use(iView)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

var eventHub = new Vue()
window.eventHub = eventHub

const HOST = 'http://127.0.0.1:8088'
window.HOST = HOST
axios.defaults.baseURL = HOST
axios.defaults.timeout = 1000 * 15
axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/json'

const router = new VueRouter({
    base: '/', // APP
    routes: []
})
Vue.use(VueRouter)

router.beforeEach((to, from, next) => {
    window.eventHub.$emit('changeActiveName', to.meta.name)

    if (process.env.NODE_ENV == 'production') {
        global.isLogin()
    }

    NProgress.start()
    console.log('from: ', from, ' to==> ', to)
    next()
})

router.afterEach(transition => {
    NProgress.done()
    window.scrollTo(0, 0)
})

localStorage.setItem('logOffStatus', 0)

window.axios = axios
window._ = _
window.moment = moment
window.Lockr = Lockr
window.Cookies = Cookies
window.constGlobal = constGlobal
window.http = http.methods
window.common = global
window.$elementUI = ElementUI

export { router }
