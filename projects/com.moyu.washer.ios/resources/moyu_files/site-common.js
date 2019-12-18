/**
 *top-footer
 */
$('header').ready(function() {
    var _top = "<div class='container'><div class='navbar-header'><button class='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='#bs-navbar' aria-controls='bs-navbar' aria-expanded='false'><span class='sr-only'>Toggle navigation</span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span></button><a href='#'><img class='logo' src='./Public/images/logo.png'></a></div><nav id='bs-navbar' class='collapse navbar-collapse'><ul class='nav navbar-nav'><li class='active'><a href='index.html'>首页</a></li><li class='active'><a href='index.html'>摩鱼洗衣机</a></li><li class='nav-outside'></li><!--<li class='active'><a href='accessories.html'>配件</a></li><li class='active'><a href='serve.html'>服务</a></li>--><li class='active'><a href='team.html'>团队</a></li><li class='active'><a href='media.html'>媒体</a></li><li class='active'><a href='download.html'>下载</a></li><li class='active'><a href='about.html'>关于我们</a></li></ul></nav></div>";
    var _son_nav = "<div class='son-nav'><ul><li><a href='index.html' class='checked'>概念</a></li><li><a href='moyu_story.html' data-tag='story'>理念</a></li><li><a href='moyu_function.html' class=''>功能</a></li><li><a href='moyu_system.html' class=''>智能系统</a></li><li><a href='moyu_structure.html' class=''>结构</a></li><li><a href='#' class=''>参数</a></li><li><a href='#' class=''>说明书</a></li></ul></div>";
    var _footer = "<img src='./Public/images/footer.png?v=123' width='100%'>";
    $('header').html(_top);
    $('.nav-outside').html(_son_nav);
    $('.footer').html(_footer);
});


/**
*/
function browserRedirect() {

    var sUserAgent = navigator.userAgent.toLowerCase();

    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";

    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";

    var bIsMidp = sUserAgent.match(/midp/i) == "midp";

    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";

    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";

    var bIsAndroid = sUserAgent.match(/android/i) == "android";

    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";

    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";


    var domain  = window.location.host;

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        if(domain === 'moyu.haijiacp.com')
        {
            // window.location.href = 'http://m.moyu.haijiacp.com/';
        }
    } else {
        
         window.location = 'http://moyu.haijiacp.com/';
    }
}

browserRedirect();


(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();

