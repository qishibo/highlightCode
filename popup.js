// 初始化popup展示
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "init_switch"}, function(data) {
        console.log('init switch', data);
        if (data == undefined) {
            document.getElementById('desc-extra').innerHTML = '抱歉，在该页面无法获得操作权限';
            return;
        }
        document.getElementById('radio').checked = (data.switch == 1) ? false : true;
    });
});


// 点击时设置开关
document.getElementById("radio").onclick = function () {
    var switch_opt = document.getElementById('radio').checked;

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggle_switch", "switch": switch_opt});
    });
}
