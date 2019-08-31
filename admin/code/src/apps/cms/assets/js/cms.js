
const cms = {
    currentDocument: null,
    timerSave: 1000,
    stopsave: 0,
    startdrag: 0,

    /**
     * 初始化
     */
    init: function() {
        this.initDraggable()
        this.initContainer()
        this.gridSystemGenerator()
        this.removeElm()
    },
    initDraggable: function() {
        var _this = this
        $('.sidebar-nav .lyrow').draggable({
            connectToSortable: '.container-bar',
            helper: 'clone',
            handle: '.drag',
            start: function(e, t) {
                var date = new Date()
                t.helper[0].id = date.getTime()
                if (!this.startdrag) this.stopsave++
                this.startdrag = 1
            },
            drag: function(e, t) {
                t.helper.width(400)
            },
            stop: function(e, t) {
                _this.componentAddId()
                $('.container-bar .column').sortable({
                    opacity: 0.35,
                    connectWith: '.column',
                    start: function(e, t) {
                        if (!this.startdrag) this.stopsave++
                        this.startdrag = 1
                    },
                    stop: function(e, t) {
                        if (this.stopsave > 0) this.stopsave--
                        this.startdrag = 0
                    }
                })
                if (this.stopsave > 0) this.stopsave--
                this.startdrag = 0
            }
        })
    },
    /**
     * 为每个组件增加id
     */
    componentAddId() {
        var _this = this
        var cons = $('.container-bar div[componentId]')
        for (var i = 0; i < cons.length; i++) {
            if ($(cons[i])[0].id == '') {
                var date = new Date()
                $(cons[i])[0].dataId = date.getTime()
                this.initJs($(cons[i])[0].attributes.componentid.nodeValue, $(cons[i])[0].id)
            }
        }
    },
    /**
     * 初始化js
     */
    initJs(componentid, id) {
        var _this = this
        if (!componentid) {
            return
        }
        setTimeout(function() {
            switch (componentid) {
                case '1':
                    _this.initSwiper(id)
                    break
                case 2:
                    break
                default:
            }
        })
    },
    initSwiper(id) {
        var mySwiper = new Swiper('#' + id + ' .swiper-container', {
            nextButton: '#' + id + '  .swiper-button-next',
            prevButton: '#' + id + '  .swiper-button-prev',
            pagination: '#' + id + '  .swiper-pagination',
            paginationType: 'fraction',
            freeMode: true,
            loop: true,
            autoplay: 100000
        })
    },
    initTag(name) {

    },
    initTable(name) {

    },
    /**
     * 初始化页面内容
     */
    initContainer: function() {
        $('.container-bar, .container-bar .column').sortable({
            connectWith: '.column',
            opacity: 0.35,
            handle: '.drag',
            start: function(e, t) {
                if (!this.startdrag) this.stopsave++
                this.startdrag = 1
            },
            stop: function(e, t) {
                if (this.stopsave > 0) this.stopsave--
                this.startdrag = 0
            }
        })
    },
    /**
     * 修改布局比例
     */
    gridSystemGenerator() {
        $('.lyrow .preview input').bind('keyup', function() {
            var e = 0
            var t = ''
            var n = $(this).val().split(' ', 12)
            $.each(n, function(n, r) {
                e = e + parseInt(r)
                t += '<div class="span' + r + ' column"></div>'
            })
            if (e == 12) {
                $(this).parent().next().children().html(t)
                $(this).parent().prev().show()
            } else {
                $(this).parent().prev().hide()
            }
        })
    },
    /**
     * 删除元素
     */
    removeElm() {
        $('.container-bar').delegate('.remove', 'click', function(e) {
            e.preventDefault()
            $(this).parent().remove()
        })
    }
}

export default cms