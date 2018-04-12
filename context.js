/**
 * Created on : 2016-11-30 14:39:32 星期三
 * Encoding   : UTF-8
 * Description: 后台脚本
 *
 * @author    @齐士博 <qii404.me>
 */

var qii404 = {

    /*
     * 右键菜单标题
     */
    menuContext: '高亮页面内容 %s',

    /*
     * 创建右键菜单标识
     */
    menuCreated: false,

    /*
     * 初始化
     */
    init: function() {
        this.bindRequest();
        this.bindCommand();
    },

    /*
     * 绑定接受content消息
     */
    bindRequest: function() {

        var this_ = this;

        chrome.extension.onRequest.addListener(function (request){

            console.log('receving content message', request);

            if (request['action'] === 'createMenu' && !this_.menuCreated) {
                this_.createHighlightMenu();
                this_.menuCreated = true;
            }
        });
    },

    /*
     * 绑定快捷键命令
     */
    bindCommand: function () {
        var this_ = this;
        chrome.commands.onCommand.addListener(function (command) {
            console.log('get command: ', command);

            switch (command)
            {
                case 'highlight':
                    this_.contentHighlight();
                    break;
            }
        });
    },

    /*
     * 创建右键菜单
     */
    createHighlightMenu: function() {
        console.log('creating menu...');

        var menuProperties = {
            'title' : this.menuContext,
            'contexts' : ['all'],
            'onclick' : this.contentHighlight
        };

        chrome.contextMenus.create(menuProperties);
    },

    /*
     * 被点击 告知content进行高亮操作
     */
    contentHighlight: function(clickData, tab)
    {
        console.log('telling content to highlight...');

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {'action': 'highlight'}, function(response) {
                response && console.log('background reveved from content...', response);
            });
        });
    }
}

qii404.init();

// end of file context.js
