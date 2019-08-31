export default{
    /**
     *
        * @param {Array} selection      本页列表选中的项
        * @param {Array} list           本页列表
        * @param {Array} selectedData   所有选中的项(跨页)
        *
        * 返回 所有选中的项
        */
    crossPageSelection(selection, list, selectedData) {
        if (selectedData.length == 0) {
            return selection
        }
        // 区分选中与未选中的项
        let unSelection = []
        list.forEach(item => {
            if (this.isHold(item, selection) == -1) {
                unSelection.push(item)
            }
        })
        // 去除未选中的项
        if (unSelection.length > 0) {
            let ind = -1
            for (let i = 0; i < unSelection.length; i++) {
                ind = -1
                ind = this.isHold(unSelection[i], selectedData)
                if (ind > -1) {
                    selectedData.splice(ind, 1)
                }
            }
        }
        // 添加选中的项
        if (selection.length > 0) {
            selection.forEach(item => {
                if (this.isHold(item, selectedData) == -1) {
                    selectedData.push(item)
                }
            })
        }
        return selectedData
    },
    /**
     *
     * @param {Array} list 本页列表(刚请求回来)
     * @param {Array} selectedData 所有选中的项(跨页)
     *
     * 返回
     */
    isSelectedAndSet(list, selectedData) {
        list.forEach((item, index) => {
            if (this.isHold(item, selectedData) > -1) {
                list[index]._checked = true
            }
        })
        return list
    },
    /**
     *
     * @param {Object} item     单个元素(对象)
     * @param {Array} list      列表是否包含单个元素
     *
     * 判断条件是对象(元素)的id
     *
     * 1.   包含 返回 下标
     * 2. 不包含 返回 -1
     */
    isHold(item, list) {
        for (let i = 0; i < list.length; i++) {
            if (item.id == list[i].id) {
                return i
            }
        }
        return -1
    }
}