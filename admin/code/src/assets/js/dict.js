import http from 'assets/js/http.js'
import constGlobal from 'assets/js/constGlobal'
const dictFn = {
    dict: null,
    /**
     * 得到数据字典的文本
     * @param key
     * @param val
     * @returns {*}
     */
    getDictText(key, val) {
        let list = dictFn.dict
        for (var i in list) {
            let dict = list[i]
            if (dict.dictCode == key) {
                for (var j in dict.dictItem) {
                    let dictDetail = dict.dictItem[j]
                    if (String(dictDetail.dictCode) == String(val)) {
                        return dictDetail.dictName
                    }
                }
            }
        }
        return ''
    },
    /**
     * 得到数据字典的列表
     * @param key
     * @returns {*}
     */
    getDictList(key) {
        let list = dictFn.dict
        for (var i in list) {
            let dict = list[i]
            console.log()
            if (dict.dictCode == key) {
                return dict.dictItem
            }
        }
        return ''
    },
    /**
     * 获取或有数据字典
     */
    queryAllDict: function () {
        dictFn.dict = JSON.parse(localStorage.getItem('dict'))
        console.log(dictFn.dict)

        if (dictFn.dict != null) {
            return
        }
        let url = constGlobal.HostPlatform + 'fireDictAdmin/getAllDict'
        http.methods.apiGet(url).then(res => {
            if (res.status == 0) {
                dictFn.dict = res.data
                localStorage.setItem('dict', JSON.stringify(res.data))
            } else {
                common.toastMsg('获取数据字典失败：' + res.message)
            }
        })
    }
}
export default dictFn