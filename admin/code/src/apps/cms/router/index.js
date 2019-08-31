/**
 * ========================
 * module_name:[总体框架路由]
 * module_author: zhangdandan
 * module_create_date: 2018/1/14
 * module_desc:
 * ========================
 */

/**
 * 主页
 */
import welcome from '../pages/dashboard/welcome.vue'

import main from '../pages/main.vue'

import cmsManage from './cmsManage.js'
import articleManage from './articleManage.js'
import checkManage from './checkManage.js'
// 公告管理
import noticeManage from './noticeManage.js'
import serviceManage from './serviceManage.js'
import other from './other.js'

let subRouter = [{
    path: '/welcome',
    name: 'welcome',
    component: welcome,
    meta: {
        requireAuth: false,
        title: '欢迎'
    }
}
]
subRouter = subRouter.concat(cmsManage)
subRouter = subRouter.concat(articleManage)
subRouter = subRouter.concat(checkManage)
subRouter = subRouter.concat(noticeManage)
subRouter = subRouter.concat(serviceManage)
subRouter = subRouter.concat(other)

var routes = [{
    path: '*',
    name: 'main',
    component: main,
    children: subRouter,
    meta: {
        requireAuth: false,
        title: '首页'
    }
}]
export default routes