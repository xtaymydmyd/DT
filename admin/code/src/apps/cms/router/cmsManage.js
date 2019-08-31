/**
 * ========================
 * module_name:[组织结构管理]
 * module_author: zhangdandan
 * module_create_date: 2018/4/28
 * module_desc:
 * ========================
 */
import index from '../pages/cmsManage/index.vue'
import cmsPageInfo from '../pages/cmsManage/pageInfo.vue'
import cmsContent from '../pages/cmsManage/cmsContent.vue'

var concats = [
    {
        path: '/index',
        name: 'index',
        component: index,
        meta: {
            requireAuth: false,
            title: '页面管理',
            name: 'index'
        }
    }, {
        path: '/cmsPageInfo',
        name: 'cmsPageInfo',
        component: cmsPageInfo,
        meta: {
            requireAuth: false,
            title: '页面基本信息',
            name: 'cmsPageInfo'
        }
    }, {
        path: '/cmsContent',
        name: 'cmsContent',
        component: cmsContent,
        meta: {
            requireAuth: false,
            title: '页面内容',
            name: 'cmsContent'
        }
    }
]

export default concats