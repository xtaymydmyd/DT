/**
 * ========================
 * module_name:[文章管理路由]
 * module_author: zhangdandan
 * module_create_date: 2018/1/14
 * module_desc:
 * ========================
 */

import buildEditor from '../pages/articleManage/buildEditor.vue'
import articleList from '../pages/articleManage/articleList.vue'
import articleDetaile from '../pages/articleManage/articleDetaile.vue'
let router = [{
    path: '/buildEditor',
    name: 'buildEditor',
    component: buildEditor,
    meta: {
        requireAuth: false,
        title: '新建／编辑',
        name: 'buildEditor'
    }
}, {
    path: '/articleList',
    name: 'articleList',
    component: articleList,
    meta: {
        requireAuth: false,
        title: '文章列表',
        name: 'articleList'
    }
},
{
    path: '/articleDetaile',
    name: 'articleDetaile',
    component: articleDetaile,
    meta: {
        requireAuth: false,
        title: '文章详情',
        name: 'articleDetaile'
    }
}
]

export default router