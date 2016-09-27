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
     * 高亮css类
     */
    highlightClass: 'qii404-highlight',

    /*
     * 点击事件
     */
    clickEvent: null,

    /**
     * 初始化 绑定双击事件
     */
    init: function(){
        this.bindClick();
    },

    /*
     * 遍历节点进行高亮
     */
    mapNode: function(node, keyWord) {

        if (node.nodeType === 3) {
            if (node.data.replace(/(\s)/g, '') != '') {
                this.highlight(node, keyWord);
            }
        }

        else if (
            (node.nodeType === 1) &&
            node.childNodes &&
            !/(script|style)/i.test(node.tagName) &&
            !(node.tagName === 'SPAN' && node.className === this.highlightClass)
        ) {
            for (var i = 0; i < node.childNodes.length; i++) {
                this.mapNode(node.childNodes[i], keyWord);
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
     * 取消所有高亮
     */
    removeHighlight: function() {
        var highlights = document.querySelectorAll('span.' + this.highlightClass);

        for (var i=0; i< highlights.length; i++) {
            var highlightNode = highlights[i];
            var parentNode    = highlightNode.parentNode;

            parentNode.replaceChild(highlightNode.firstChild, highlightNode);
            parentNode.normalize();
        }
    },

    /*
     * 初始化正则
     */
    initRegex: function(keyWord) {
        return RegExp(keyWord, 'i');
    },

    /*
     * 创建高亮的新元素节点
     */
    createHighlightNode: function() {
        var node = document.createElement('span');
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

        var highlights = e.srcElement.querySelectorAll('span.' + this.highlightClass);

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
     * 绑定双击事件
     */
    bindClick: function () {

        var this_ = this;

        document.body.addEventListener('dblclick', function(e){

            if (e.srcElement.className == this_.highlightClass) {
                return false;
            }

            if (document.activeElement) {
                var selectedText = window.getSelection().toString();

                if(selectedText.length > 0 && selectedText.replace(/(\s)/g, '') != '') {
                    console.log(selectedText);
                    this_.clickEvent = e;
                    this_.removeHighlight();

                    this_.mapNode(document.body, selectedText);
                    this_.selectText();
                }
            }
        }, false);
    }
}

qii404.init();

// end of file highLight.js
