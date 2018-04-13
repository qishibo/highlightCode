/**
 * Created on : 2016-04-15 18:49:33 星期五
 * Encoding   : UTF-8
 * Description:
 * chrome拓展 双击选中某个词语 页面内其他相同词语自动高亮
 * 码农看代码福利 哈哈
 *
 * @author    @齐士博 <qii404.me>
 */

var qii404 = {

    /*
     * 自定义高亮标签
     */
    highlightTag: 'qii',

    /*
     * 高亮css类
     */
    highlightClass: 'qii404-highlight',

    /*
     * 开关设置存储key
     */
    switchKey: 'qii404-highlight-switch',

    /*
     * 点击事件
     */
    clickEvent: null,

    /**
     * 初始化 绑定事件
     */
    init: function() {
        this.bindClick();
        this.createMenu();
        this.bindMenuMsg();
    },

    /*
     * 绑定点击事件
     */
    bindClick: function () {
        this.singleClick();
        this.doubleClick();
    },

    /**
     * 创建右键菜单
     */
    createMenu: function() {
        chrome.extension.sendRequest({"action": "createMenu"});
    },

    /*
     * 高亮开关是否打开
     */
    stillHighlight: function () {
        return localStorage.getItem(this.switchKey) == 1 ? false : true;
    },

    /**
     * 绑定右键菜单点击时的操作
     */
    bindMenuMsg: function() {

        var this_ = this;

        chrome.runtime.onMessage.addListener(function(request, sender, response) {

                // 高亮消息
                if (request.action === 'highlight') {
                    // 后台发送消息，如果未高亮则高亮，否则取消高亮 实现toggle
                    var highlights = document.querySelectorAll(this_.highlightTag + '.' + this_.highlightClass);
                    // 已经高亮
                    if (highlights.length > 0) {
                        this_.removeHighlight();
                        return;
                    }

                    // 高亮开关已关闭 返回
                    // if (!this_.stillHighlight()) return;

                    // 进行高亮操作
                    var selectedText = window.getSelection().toString();

                    console.log(selectedText);

                    if(selectedText.length > 0 && selectedText.replace(/(\s)/g, '') != '') {
                        this_.mapToHighlight(document.body, selectedText);
                    }
                }

                // 初始化 popup
                else if (request.action === 'init_switch') {
                    response({switch: localStorage.getItem(this_.switchKey)});
                }

                // 开关切换
                else if (request.action === 'toggle_switch') {
                    localStorage.setItem(this_.switchKey, request.switch ? 0 : 1);
                }
        });
    },

    /*
     * 遍历节点进行高亮
     */
    mapToHighlight: function(node, keyWord) {

        if (node.nodeType === 3) {
            if (node.data.replace(/(\s)/g, '') != '') {
                this.highlight(node, keyWord);
            }
        }

        else if (
            (node.nodeType === 1) &&
            node.childNodes &&
            !/(script|style)/i.test(node.tagName) &&
            !(node.tagName === this.highlightTag.toUpperCase() && node.className === this.highlightClass)
        ) {
            for (var i = 0; i < node.childNodes.length; i++) {
                this.mapToHighlight(node.childNodes[i], keyWord);
            }
        }
    },

    /*
     * 根据node进行关键词高亮
     */
    highlight: function(node, keyWord) {

        var match = node.data.match(this.initRegex(keyWord));

        if (match === null) {
            return false;
        }

        var newNode = node.splitText(match.index);

        newNode.splitText(match[0].length);

        var highlightNode = this.createHighlightNode()
        highlightNode.appendChild(newNode.cloneNode(true));

        newNode.parentNode.replaceChild(highlightNode, newNode);
    },

    /*
     * 初始化正则
     */
    initRegex: function(keyWord) {

        // 针对特殊字符的转义
        keyWord = keyWord.replace(/(\^|\$|\.|\*|\?|\(|\)|\+|\\)/ig, "\\$1");

        return RegExp(keyWord, 'i');
    },

    /*
     * 创建高亮的新元素节点
     */
    createHighlightNode: function() {
        var node = document.createElement(this.highlightTag);
        node.className = this.highlightClass;

        return node;
    },

    /*
     * 选择文字
     */
    selectText: function() {
        var e = this.clickEvent;

        var clickX = e.clientX;
        var clickY = e.clientY;

        var highlights = e.srcElement.querySelectorAll(this.highlightTag + '.' + this.highlightClass);

        for (var i = 0; i < highlights.length; i++) {
            var rect = highlights[i].getBoundingClientRect();
            if (rect.left) {
                if (
                    (clickX >= rect.left) &&
                    (clickX <= rect.right) &&
                    (clickY >= rect.top) &&
                    (clickY <= rect.bottom)
                ) {
                    this.selectNode(highlights[i]);
                    break;
                }
            }
        }
    },

    /*
     * 选中文字
     */
    selectNode: function(node) {
        selection = window.getSelection();
        range     = document.createRange();

        range.selectNodeContents(node);

        selection.removeAllRanges();
        selection.addRange(range);
    },

    /*
     * 取消所有高亮
     */
    removeHighlight: function() {
        var highlights = document.querySelectorAll(this.highlightTag + '.' + this.highlightClass);

        for (var i=0; i< highlights.length; i++) {
            var highlightNode = highlights[i];
            var parentNode    = highlightNode.parentNode;

            parentNode.replaceChild(highlightNode.firstChild, highlightNode);
            parentNode.normalize();
        }
    },

    /*
     * 绑定单击事件
     */
    singleClick: function() {

        var this_ =  this;
        document.body.addEventListener('click', function(e) {
            this_.removeHighlight();
        });
    },

    /*
     * 双击绑定
     */
    doubleClick: function() {

        var this_ = this;

        document.body.addEventListener('dblclick', function(e) {

            // 高亮开关已关闭 返回
            if (!this_.stillHighlight()) return;

            if (e.srcElement.className == this_.highlightClass) {
                return false;
            }

            if (document.activeElement) {
                var selectedText = window.getSelection().toString();

                if(selectedText.length > 0 && selectedText.replace(/(\s)/g, '') != '') {
                    console.log(selectedText);
                    this_.clickEvent = e;
                    // this_.removeHighlight();

                    this_.mapToHighlight(document.body, selectedText);
                    this_.selectText();
                }
            }
        }, false);
    }
}

qii404.init();

// end of file highLight.js
