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

    /*
     * 默认替换的样式
     */
    defaultStyle: '<span style="color: red;font-weight: bold;background-color: lightgrey;padding: 3px;">%text</span>',

    /*
     * 上一个替换的单词
     */
    lasetSelected: null,

    /**
     * 初始化 绑定双击事件
     */
    init: function(){
        var this_ = this;
        document.addEventListener('dblclick', function(evt){
          var selectedText;
          if (document.activeElement) {
            var sel = window.getSelection();
            var selectedText = sel.toString();

            if(selectedText.length > 0) {

                this_.text = selectedText;
                this_.highLight();
                this_.text = null;
                this_.lasetSelected = selectedText;
            }
          }
        }, false);
    },

    /**
     * 对body中的关键词进行高亮替换
     */
    highLight: function(){
        // console.log(this.highLigitHtml(this.text));
        var htmlNew = document.body.innerHTML.replace(new RegExp(this.text, 'g'), this.highLigitHtml(this.text));
        htmlNew = this.removeHighlight(htmlNew);

        var bodyNew = document.createElement('body');
        bodyNew.innerHTML = htmlNew;

        var html = document.getElementsByTagName('html')[0];

        html.removeChild(document.body);
        html.appendChild(bodyNew);
    },

    /**
     * 移除上一次查询的关键词高亮
     *
     * @param  {string} htmlNew body里的html
     *
     * @return {string}         移除之后的body html
     */
    removeHighlight: function(htmlNew){
        return htmlNew.replace(new RegExp(this.highLigitHtml(this.lasetSelected), 'g'), this.lasetSelected);
    },

    /**
     * 将关键词转换成高亮的html标签
     *
     * @param  {string} text 关键词
     *
     * @return {string}      替换后的html
     */
    highLigitHtml: function(text){
        return this.defaultStyle.replace(/\%text/, text);
    }
}

qii404.init();

// end of file highLight.js
