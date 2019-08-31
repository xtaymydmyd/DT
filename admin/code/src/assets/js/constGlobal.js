import devConstGlobal from 'assets/js/devConstGlobal.js'

var mainHost = ''
var mainSource = ''

mainHost = process.env.mainHost
mainSource = process.env.mainSource

let NODE_ENV = process.env.NODE_ENV
const prodConstGlobal = {
    MainHost: mainHost,
    // 图片上传
    HostSource: mainSource + '/',
    HostFileUpload: mainHost + '/apps/file/',
    HostPrivilege: mainHost + '/privilege/',
    HostContact: mainHost + '/orgContacts/',
    HostFile: mainHost + '/',

    HostCMSAdmin: mainHost + '/cms/admin/',
    HostCheckAdmin: mainHost + '/unite/admin/',
    HostArticleManage: mainHost + '/cms/admin/',
    HostFiremanRecruitArticleManage: mainHost + '/fireRecruitCMS',
    fireRecruitManage: mainHost + '/fireRecruitManage/',

    Host: mainHost + '/apps/',
    ueditorDefault: 'static/ueditor1_4_3_3/',
    websiteId: 'xfzl'

}
let constGlobal = (NODE_ENV == 'production') ? prodConstGlobal : devConstGlobal
export default constGlobal