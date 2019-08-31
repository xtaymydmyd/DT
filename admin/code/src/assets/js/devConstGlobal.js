let mainHost = process.env.mainHost
var devConstGlobal = {
    MainHost: 'http://fdfs.lechat.io:63808/',
    HostCMSSource: 'http://jieyun-test.oss-cn-beijing.aliyuncs.com/',
    // 图片上传
    // 组织结构管理
    HostContact: 'http://192.168.108.11:9919/orgContacts/',
    // 权限管理
    HostPrivilege: 'http://192.168.108.11:9918/privilege/',

    HostSource: 'http://jieyun-test.oss-cn-beijing.aliyuncs.com/',
    // HostSource: 'http://jieyun-test.oss-cn-beijing.aliyuncs.com/',
    HostFileUpload: 'http://192.168.100.200:8888/apps/file/',
    HostCMSAdmin: 'http://192.168.108.11:9820/cms/admin/',
    HostCheckAdmin: 'http://192.168.108.11:9822/unite/admin/',
    HostArticleManage: 'http://192.168.108.11:9820/cms/admin/',
    HostFiremanRecruitArticleManage: 'http://192.168.108.25:8889/fireRecruitCMS',
    fireRecruitManage: mainHost + '/fireRecruitManage/',
    websiteId: 'xfzl',

    Host: mainHost + '/apps/',
    ueditorDefault: 'static/ueditor1_4_3_3/'
}
export default devConstGlobal