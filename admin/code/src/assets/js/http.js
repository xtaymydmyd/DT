import axios from 'axios'
const apiMethods = {
    methods: {
        apiGet(url, data) {
            return new Promise((resolve, reject) => {
                axios.get(url, data).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    http.handleError(error)
                    common.closeGlobalLoading()
                })
            })
        },
        apiPost(url, data) {
            return new Promise((resolve, reject) => {
                axios.post(url, data).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    http.handleError(error)
                })
            })
        },
        apiDelete(url, id) {
            return new Promise((resolve, reject) => {
                axios.delete(url + id).then(response => {
                    resolve(response.data)
                }, response => {
                    reject(response)
                    common.closeGlobalLoading()
                    common.toastMsg('请求超时，请检查网络', 'warn')
                })
            })
        },
        apiPut(url, id, obj) {
            return new Promise((resolve, reject) => {
                axios.put(url + id, obj).then(response => {
                    resolve(response.data)
                }, response => {
                    reject(response)
                    common.closeGlobalLoading()
                    common.toastMsg('请求超时，请检查网络', 'warn')
                })
            })
        },
        handelResponse(res, cb, errCb) {
            common.closeGlobalLoading()
            if (res.code === 200) {
                cb(res.data)
            } else {
                if (typeof errCb == 'function') {
                    errCb()
                }
                this.handleError(res)
            }
        },
        handleError(error) {
            console.log(error)
            var response = error.response
            var text = ''

            if (navigator.connection.type == 'none') { // app无网络连接时
                return
            }

            if (error.response) {
                var status = response.status
                var url = response.config.url
                if (url.indexOf('eventLog') >= 0) return

                switch (status) {
                    case 401:
                        text = '暂无权限，请稍后重试'
                        break
                    case 404:
                        text = '页面不存在，请稍后重试'
                        break
                    case 525 :
                        common.appLogOff() // 重新登录
                        break
                    default:
                        text = '系统服务异常，请稍后重试'
                }
            } else if (error.request) {
                text = (('' + error.message).indexOf('timeout') >= 0) ? '请求超时，请检查网络'
                        : ('' + error.message.indexOf('Error') >= 0) ? '网络异常，请检查网络' : ''
            } else {
                text = (('' + error).indexOf('timeout') >= 0) ? '请求超时，请检查网络'
                       : ('' + error.indexOf('Error') >= 0) ? '网络异常，请检查网络' : ''
            }

            if (text == '') return

            common.toastMsg(text, 'warn')
        },
        resetCommonData(data) {
            console.log('...')
        },
        reAjax(url, data) {
            return new Promise((resolve, reject) => {
                axios.post(url, data).then(response => {
                    resolve(response.data)
                }, response => {
                    reject(response)
                    common.toastMsg('请求超时，请检查网络', 'warn')
                })
            })
        }
    },
    computed: {
        showLoading() {
            return store.state.globalLoading
        }
    }
}

export default apiMethods