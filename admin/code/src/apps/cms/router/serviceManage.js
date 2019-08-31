/**
 * ========================
 * module_name:[服务管理]
 * module_author: zhangdandan
 * module_create_date: 201/08/28
 * module_desc:
 * ========================
 */
import serviceList from '../pages/serviceManage/serviceList.vue'
import serviceDetail from '../pages/serviceManage/serviceDetail.vue'

var concats = [
    {
        path: '/serviceList',
        name: 'serviceList',
        component: serviceList,
        meta: {
            requireAuth: false,
            title: '服务列表',
            name: 'serviceList'
        }
    }, {
        path: '/serviceDetail',
        name: 'serviceDetail',
        component: serviceDetail,
        meta: {
            requireAuth: false,
            title: '服务详情',
            name: 'serviceDetail'
        }
    }
]

export default concats