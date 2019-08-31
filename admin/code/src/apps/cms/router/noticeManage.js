/**
 * ========================
 * module_name:[通知公告管理]
 * module_author: zhangdandan
 * module_create_date: 201/08/28
 * module_desc:
 * ========================
 */
import Index from '../pages/noticeManage/index.vue'
import Detail from '../pages/noticeManage/detail.vue'

var concats = [
    {
        path: '/noticeManageIndex',
        name: 'noticeManageIndex',
        component: Index,
        meta: {
            requireAuth: false,
            title: '公告管理',
            name: 'noticeManageIndex'
        }
    }, {
        path: '/noticeDetail',
        name: 'noticeDetail',
        component: Detail,
        meta: {
            requireAuth: false,
            title: '公告详情',
            name: 'noticeDetail'
        }
    }
]

export default concats