var basePath = $("base").attr("href");
/**
 * 获取地理位置信息 Object { ret: 1, start: -1, end: -1, country: "中国", province: "浙江",
 * city: "宁波", district: "", isp: "", type: "", desc: "" } function.js:12:5
 */
var address_info = null;
$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',
		function(_result) {
			if (remote_ip_info.ret == '1') {
				// alert('国家：' + remote_ip_info.country + '<BR>省：' +
				// remote_ip_info.province + '<BR>市：' + remote_ip_info.city +
				// '<BR>区：' + remote_ip_info.district + '<BR>ISP：' +
				// remote_ip_info.isp + '<BR>类型：' + remote_ip_info.type +
				// '<BR>其他：' + remote_ip_info.desc);
				address_info = remote_ip_info;
			} else {
				address_info = null;
			}
		}).fail(function(e) {
	console.log("get address info :" + e.status);
});
/**
 * 获取ip，地址 浏览器信息 Object { Ip: "36.22.59.2", Isp: "浙江省宁波市北仑区 电信", Browser: "Gecko
 * based", OS: "Windows NT", QueryResult: 1 }
 */
var ip_info = null;
$.getScript("http://pv.sohu.com/cityjson?ie=utf-8",function(){
    ip_info = {};
    ip_info.Ip = returnCitySN.cip;//ip
    ip_info.Region = returnCitySN.cid;//地区id
    ip_info.RegionName = returnCitySN.cname;//地区名
	ip_info.Browser = BrowserType();//修改浏览器信息
	ip_info.OS = detectOS();//修改系统信息
}).fail(function(e){
	console.log("get browser info :" + e.status);
});

/**
 * ActionCode
 */
var positionPoint = 1;// 定位到此
var code = {
	"UNLOGIN":-1000,//未登录
	"LOGIN" : -1,//已登录
	"WRONG" : 0,// 错误
	"RIGHT" : 1,// 正确
	"WARNING" : 2,//警告
	/**
	 * //修改失败
	 */
	"EDIT_WRONG" : 40000,
	/**
	 * //修改成功
	 */
	"EDIT_RIGHT" : 40001
};
/**
 * 刷新当前页面
 */
function reloadPage() {
	window.location.href = window.location.href;
}
/**
 * 各种正则表达式规则 使用方法为 regexps.username.test("username") return true or false
 * 
 * @username 用户名检查
 * @password 密码检查
 */
regexps = {
	"nickname" : /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,25}$/,
	"username" : /^[a-zA-Z]\w{4,15}$/,
	"password" : /^\w{5,16}$/,
	"name" : /^([\u4E00-\u9FFF]){2,15}|([a-z]+( [a-z]+|$))+$/,
	"tel" : /^\d{3,4}-?\d{7,8}$/,
	"phone" : /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/,
	"url" : /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
};

/**
 * 字符串转义 若想 < > 等符号 以字符串形式显示 则使用此函数,并且不需要反转
 */
function html_encode(str) {
	var s = "";
	if (str.length == 0)
		return "";
	s = str.replace(/&/g, "&gt;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/ /g, "&nbsp;");
	s = s.replace(/\'/g, "&#39;");
	s = s.replace(/\"/g, "&quot;");
	// s = s.replace(/\n/g, "<br/>");
	return s;
}
/**
 * 字符串转义反转 若需要将被转义的 <>以HTML代码显示 则需要反转
 */
function html_decode(str) {
	var s = "";
	if (str.length == 0)
		return "";
	s = str.replace(/&gt;/g, "&");
	s = s.replace(/&lt;/g, "<");
	s = s.replace(/&gt;/g, ">");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/&#39;/g, "\'");
	s = s.replace(/&quot;/g, "\"");
	// s = s.replace(/<br>/g, "\n");
	return s;
}
/**
 * @param str
 *            要编码的字符串
 * @param chars
 *            要转换的字符 字符数组 chars = ['<','>','/','\'','\"'];
 */
function html_encode_optional(str, chars) {
	var objreg = {
		"&" : /&/g,
		"<" : /</g,
		">" : />/g,
		" " : / /g,
		"\'" : /\'/g,
		"\"" : /\"/g
	};
	var objstr = {
		"&" : "&amp;",
		"<" : "&lt;",
		">" : "&gt;",
		" " : "&nbsp;",
		"\'" : "&#39;",
		"\"" : "&quot;"
	};
	for (var i = 0; i < chars.length; i++) {
		if ("&" == chars[i]) {
			str = str.replace(objreg[chars[i]], objstr[chars[i]]);
			chars[i] = "";
			break;
		}
	}
	for (var i = 0; i < chars.length; i++) {
		if (chars[i] != null && chars[i] != "")
			str = str.replace(objreg[chars[i]], objstr[chars[i]]);
	}
	return str;
}
/**
 * 获取地址栏参数值
 * 
 * @param {参数名}
 *            name
 */
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return decodeURI(r[2]);
	return null;
}

function checkLoginTimeout(recode) {
	if (code.UNLOGIN == recode) {
		window.location.reload(true);
	}
}

/**
 * 在目标之后插入消息框
 * @type 0 错误 1 正确  2 警告 3 信息 
 */
function msg_alert(target,message,type){
	var ms = {
		m0 : '<div class="alert alert-danger">',
		m1 : '<div class="alert alert-success">',
		m2 : '<div class="alert alert-warning">',
		m3 : '<div class="alert alert-info">'
	};
	if(type>=0 &&type<=3){
		var ele = ms['m'+type]+message+'</div>';
		if(typeof target == 'object')target.append($(ele).attr("id",'temp_msg'+type));
		setTimeout(function(){
			$("#temp_msg"+type).remove();
		}, 2000);
	}
}

/**
 * 提交表单
 * 
 * @param url
 *            目标地址
 * @param data
 *            对象数据{"key":"value",..}
 * @param callback
 *            回调方法function(a){}
 * @param init
 *            初始方法function(){}用于提交前处理
 */
function submit_form(url, data, callback, init) {
	var result = {};
	var contin = true;//继续执行
	if (typeof init == 'function'){
		var tcontin = init();
		if(tcontin === false)contin = false; 
	}
	if(contin)
	$.ajax({
		url : url,
		type : 'post',
		dataType : 'json',
		data : data
	}).done(function(o) {
		result = o;
	}).fail(function(e) {
		result = $.extend(result, e);
		result.status = code.SYSERO;
	}).always(function() {
		callback(result);
	});
}
/**
 * 判断浏览器
 * 
 * @returns {String}
 */
function BrowserType() {
	var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
	var isOpera = userAgent.indexOf("Opera") > -1; // 判断是否Opera浏览器
	var isIE = userAgent.indexOf("compatible") > -1
			&& userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器
	var isEdge = userAgent.indexOf("Edge") > -1; // 判断是否IE的Edge浏览器
	var isFF = userAgent.indexOf("Firefox") > -1; // 判断是否Firefox浏览器
	var isSafari = userAgent.indexOf("Safari") > -1
			&& userAgent.indexOf("Chrome") == -1; // 判断是否Safari浏览器
	var isChrome = userAgent.indexOf("Chrome") > -1
			&& userAgent.indexOf("Safari") > -1; // 判断Chrome浏览器

	if (isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if (fIEVersion == 7) {
			return "IE7";
		} else if (fIEVersion == 8) {
			return "IE8";
		} else if (fIEVersion == 9) {
			return "IE9";
		} else if (fIEVersion == 10) {
			return "IE10";
		} else if (fIEVersion == 11) {
			return "IE11";
		} else {
			return "0"
		}// IE版本过低
	}// isIE end
	if (isEdge) {
		return "Edge";
	}
	if (isFF) {
		return "FireFox";
	}
	if (isOpera) {
		return "Opera";
	}
	if (isSafari) {
		return "Safari";
	}
	if (isChrome) {
		return "Chrome";
	}
	
}// myBrowser() end
/**
 * 判断操作系统
 * @returns {String}
 */
function detectOS() {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform.indexOf("Win") == 0);
    var isMac = (navigator.platform.indexOf("Mac") == 0);
    if (isMac) return "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Windows2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WindowsXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Windows2003";
        var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WindowsVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Windows7";
        var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
        if(isWin10) return "Windows10";
    }
    return "other";
}

/**
 * 提交表单 同步锁定
 * 
 * @param url
 *            目标地址
 * @param data
 *            对象数据{"key":"value",..}
 * @param callback
 *            回调方法function(result){ result.status;},
 * @param init
 *            初始方法用于提交前处理
 */
function submit_form_async(url, data, callback, init) {
	var result = {};
	var contin = true;//继续执行
	if (typeof init == 'function'){
		var tcontin = init();
		if(tcontin === false)contin = false; 
	}
	if(contin)
	$.ajax({
		url : url,
		type : 'post',
		async : false,
		dataType : 'json',
		data : data
	}).done(function(o) {
		result = o;
	}).fail(function(e) {
		result = $.extend(result, e);
		result.status = code.SYSERO;
	}).always(function() {
		callback(result);
	});
}

/**
 * @param time
 *            毫秒数 计算已过毫秒数,返回 n 秒前 或 n 分钟前 或 n 小时前 或 n 天前 或 n 月前 或 n 年前,的字符串
 */
function math_last_time(time) {
	if (typeof time == "number") {
		var lastTime = time / 1000;// 计算秒数
		if (lastTime <= 0)
			return "0 秒前";
		if (lastTime < 60)
			return Math.ceil(lastTime) + " 秒前";
		lastTime = lastTime / 60;// 计算分钟数
		if (lastTime < 60)
			return Math.ceil(lastTime) + " 分钟前";
		lastTime = lastTime / 60;// 计算小时数
		if (lastTime < 24)
			return Math.ceil(lastTime) + " 小时前";
		lastTime = lastTime / 24;// 计算天数
		if (lastTime < 30)
			return Math.ceil(lastTime) + " 天前";
		lastTime = lastTime / 30;// 计算月数
		if (lastTime < 12)
			return Math.ceil(lastTime) + " 月前";
		lastTime = lastTime / 12;// 计算年数
		return Math.ceil(lastTime) + " 年前";
	}
}

/**
 * 获取 cookie
 */
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
/**
 * 删除 cookie
 * 
 * @param name
 *            名字
 */
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
// 使用示例
// setCookie("name", "hayden");
// alert(getCookie("name"));
// 如果需要设定自定义过期时间
// 那么把上面的setCookie 函数换成下面两个函数就ok;
// 程序代码
/**
 * 这是有设定过期时间的使用示例： s20是代表20秒 h是指小时，如12小时则是：h12 d是天数，30天则：d30
 * setCookie("name","hayden","s20");
 */
function setCookie(name, value, time) {
	var strsec = getsec(time);
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec * 1);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}
/**
*@param str 计算毫秒数, str 第一位为时间类型 s 秒 m 分  h 小时 d 天 第二位开始为数值 如  s5 即 5000毫秒
*/
function getsec(str) {
	var str1 = str.substring(1, str.length) * 1;
	var str2 = str.substring(0, 1);
	if (str2 == "s") {
		return str1 * 1000;
		return str1 * 60 * 1000;
	} else if (str2 == "h") {
		return str1 * 60 * 60 * 1000;
	} else if (str2 == "d") {
		return str1 * 24 * 60 * 60 * 1000;
	}
}
/**
 * 针对 输入框输入小数矫正 0.0
 */
var price_keyup = function(){
	//处理错误输入
	var price = this.value;
	if(!/^(\d+)$|^(\d+\.\d+)$|^(\d+\.)$/.test(price)){
		this.value = this.value.substring(0,this.value.length-1);
	}
};
/**
 * 针对 输入框矫正输入后失去焦点 0.0
 */
var price_blur = function(){
	var price = this.value;
	if(price.lastIndexOf(".") == price.length-1){
		this.value = price.substring(0,price.length-1);
	}
	if(/^0\d+$/.test(price)){
		do{
			price = price.substring(1);
			this.value = price;
		}while(/^0\d+/.test(price));
		this.value = price;
	}
	if(/\.\d+0$/.test(price)){
		do{
			price = price.substring(0,price.length-1);
			this.value = price;
		}while(/\.\d+0$/.test(price));
		this.value = price;
	}
};

/**
 * 检查是否已登录
 * @param targetUrl session记录要访问的地址
 */
function checkLogin(targetUrl){
	var data = {};
	if(targetUrl){
		data.target_url = targetUrl;
	}
	var login = false;
	submit_form_async("user/check_login", data, function(result){
		if(result.status == code.LOGIN){
			login = true;
		}
	}, null);
	return login;
}
/**
 * TODO 将序列化的表单转为json对象
 * @param array [0: Object { name: "password", value: "123456" },1: Object { name: "nickname", value: "点点滴滴" }...]
 * @returns {"password":"123456","nickname":"点点滴滴"}
 */
function serializeArrayToJson(array){
	if(array && array[0]){
		var json = {};
		for ( var arr in array) {
			var one = array[arr];
			json[one.name] = one.value;
		}
		return json;
	}
}