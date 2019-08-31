/**
 * ========================
 * module_name:[审枋管理路由]
 * module_author: zhangdandan
 * module_create_date: 2018/1/14
 * module_desc:
 * ========================
 */

import checkIndex from '../pages/checkManage/index.vue'
let router = [{
    path: '/checkIndex',
    name: 'checkIndex',
    component: checkIndex,
    meta: {
        requireAuth: false,
        title: '审核管理',
        name: 'checkIndex'
    }
}
]

export default router