/**
 * Created on : 2016-04-15 18:49:33 星期五
 * Encoding   : UTF-8
 * Description:
 * chrome拓展 双击选中某个词语 页面内其他相同词语自动高亮
 * 码农看代码福利 哈哈
 *
 * @author    @小齐炖博士 <shibo1@staff.weibo.com>
 */

var qii404 = {

    highlightClass: 'qii404-highlight',

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
     * 绑定双击事件
     */
    bindClick: function () {

        var this_ = this;

        document.body.addEventListener('dblclick', function(){
          if (document.activeElement) {
            var selectedText = window.getSelection().toString();

            if(selectedText.length > 0) {
                console.log(selectedText);
                this_.mapNode(document.body, selectedText);
            }
          }
        }, false);
    }
}

qii404.init();

// end of file highLight.js
