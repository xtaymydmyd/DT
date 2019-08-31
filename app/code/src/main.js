import Vue from 'vue'
import App from '@/App'
import MpvueRouterPatch from 'mpvue-router-patch'
Vue.use(MpvueRouterPatch)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App
})

app.$mount()

import http from '@/utils/http'
Vue.prototype.$http = http

const HOST = 'https://www.zqkjfw.com/'
Vue.prototype.$host = HOST


export default {
  // 这个字段走 app.json
  config: {
    pages: [
      
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'mpvue demo',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    }
  }
}
