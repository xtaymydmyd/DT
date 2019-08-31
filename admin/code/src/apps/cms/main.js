import { router } from 'assets/js/config'

import Vue from 'vue'

import filter from './filter'
import routes from './router'
import store from './store'
import App from './App.vue'

import locales from './locale'
Object.keys(locales).forEach(lang => {
    Vue.locale(lang, locales[lang])
})

/** ******************项目使用的插件************************/
// 抽屉弹出框
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)

// 拷贝
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

/** ******************************************/

router.addRoutes(routes)

window.router = router
window.store = store

const bus = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
window.bus = bus

