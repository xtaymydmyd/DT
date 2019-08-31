/**
 * ========================
 * module_name:[服务管理]
 * module_author: zhangdandan
 * module_create_date: 201/08/28
 * module_desc:
 * ========================
 */
import mchManage from '../pages/propertyPayManage/mchManage.vue'
import feeItemManage from '../pages/propertyPayManage/feeItemManage.vue'

var concats = [
    {
        path: '/mchManage',
        name: 'mchManage',
        component: mchManage,
        meta: {
            requireAuth: false,
            title: '收费单位管理',
            name: 'mchManage'
        }
    }, {
        path: '/feeItemManage',
        name: 'feeItemManage',
        component: feeItemManage,
        meta: {
            requireAuth: false,
            title: '收费项目管理',
            name: 'feeItemManage'
        }
    }
]

export default concats