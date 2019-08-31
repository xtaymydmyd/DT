import http from 'assets/js/http.js'
import axios from 'axios'
import constGlobal from 'assets/js/constGlobal'
const commonFn = {
    j2s(obj) {
        return JSON.stringify(obj)
    },
    cloneJson(obj) {
        return JSON.parse(JSON.stringify(obj))
    },
    closeGlobalLoading() {
        setTimeout(() => {
            store.dispatch('showLoading', false)
        }, 0)
    },
    openGlobalLoading() {
        setTimeout(() => {
            store.dispatch('showLoading', true)
        }, 0)
    },
    // 删除左右两端的空格
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    toastMsg(msg, type) {
        var position = 'middle'
        switch (type) {
            case 'normal':
                $elementUI.Message(msg)
                break
            case 'success':
                $elementUI.Message({
                    message: msg,
                    type: 'success'
                })
                break
            case 'warning':
                $elementUI.Message({
                    message: msg,
                    type: 'warning'
                })
                break
            case 'error':
                $elementUI.Message.error(msg)
                break
            default:
                $elementUI.Message(msg)
                break
        }
    },
    checkEmpty: function(v) {
        return !!v.trim()
    },
    checkReg(v, reg) {
        return reg.test(v)
    },
    // 日期补0
    formatDateNum: function(value) {
        if (parseInt(value) < 10) {
            return '0' + parseInt(value)
        } else {
            return parseInt(value) + ''
        }
    },
    sessionSet(name, obj) {
        return sessionStorage.setItem(name, JSON.stringify(obj))
    },
    sessionGet(name) {
        return JSON.parse(sessionStorage.getItem(name))
    },

    isLogin() {
        let url = constGlobal.MainHost + '/isLogin'
        http.methods.apiGet(url).then(res => {
            if (res == 0) { // 0：未登录 ；1：已登录
                window.location.reload()
            }
        })
    },
    logout() {
        sessionStorage.removeItem('activeMenu')
        sessionStorage.removeItem('menuId')
        let url = constGlobal.MainHost + '/logout'
        window.location.href = url
    }
}

export default commonFn