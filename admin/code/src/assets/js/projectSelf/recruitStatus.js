export default {
    /**
     * 获得状态名称
     * @param {Number} qualifiedStatus  是否合格(是否通过)
     * @param {Number} status  报名的状态
     * @param {Number} qualifiedType  不合格项(不合格时)
     */
    getStatusName(qualifiedStatus, status, qualifiedType) {
        return status == '-1' ? '已取消'
                : status == '1' ? '待体检'
                : (qualifiedStatus == '0'
                ? (qualifiedType == '1' ? '体检不通过'
                    : qualifiedType == '2' ? '政审不通过'
                    : qualifiedType == '3' ? '面试不通过'
                    : qualifiedType == '5' ? '筛选不通过'
                    : qualifiedType == '4' ? '复检不通过' : '')
                : (status == '2' ? '待政审'
                    : status == '3' ? '待面试'
                    : status == '4' ? '待筛选'
                    : status == '5' ? '待复检' : '正式录用'))
    },
    /**
     * 获得状态颜色
     * @param {Number} qualifiedStatus  是否合格(是否通过)
     * @param {Number} status  报名的状态
     */
    getStatusColor(qualifiedStatus, status) {
        // #cccccc 灰 已取消
        // #fc3a3a 红 不通过
        // #2979ff 蓝 待体检(政审,面试,筛选,复检)
        // #17d429 绿 正式录用
        return qualifiedStatus == '0' ? '#fc3a3a'
                : status == '-1' ? '#cccccc'
                : status == '1' ||
                    status == '2' ||
                    status == '3' ||
                    status == '4' ||
                    status == '5' ? '#2979ff' : '#17d429'
    }
}