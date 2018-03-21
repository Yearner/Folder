/**
 * 用户功能
 */
$(function() {
	/**
	 * 修改密码
	 */
	$("#password_edit")
			.on(
					"submit",
					function(e) {
						// 提交按钮
						$btn = $("#change_pwd_btn");
						$msg_err = $("#change_pwd_alert_error");
						$msg_suc = $("#change_pwd_alert_success");
						var pwd = $("#old_password").val();
						var npwd = $("#new_password").val();
						var npwd1 = $("#re_password").val();
						if (!(regexps.password.test(pwd)
								&& regexps.password.test(npwd) && regexps.password
								.test(npwd1))) {
							$msg_err.text("密码格式有误").show();
						} else if (npwd != npwd1) {
							$msg_err.text("两次输入不相同").show();
						} else if (pwd == npwd) {
							$msg_err.text("新旧密码不能相同").show();
						} else {
							$msg_err.hide();
							var data = {
								"pwd" : pwd,
								"npwd" : npwd
							}
							submit_form($(this).attr("action"), data, function(
									result) {
								if (result.status == code.UNLOGIN) {
									alert("还未登录,确定登录");
									reloadPage();
								}
								if (result.status == code.EDIT_RIGHT) {
									$msg_err.hide();
									var t = 3;
									setInterval(function() {
										if (t == 0)
											return reloadPage();
										$msg_suc.text(
												result.message + " " + t
														+ "秒后重新登录").show();
										t--;
									}, 1000);
									return false;
								} else {
									$msg_err.text(result.message).show();
									$btn.attr("type", "submit");
								}
							}, function() {
								$btn.attr("type", "button");
							});
						}
						return false;
					});

	/**
	 * 订单链接设置
	 */
	if ($("#order_find_date").length > 0) {
		var $fd_a = $("#order_find_date");// a
		var $fd_list = $("#order_find_date_list a");// ul > li > a
		var sv = $fd_a.attr("data-show");// 当前显示值
		var state = GetQueryString("show_state");
		$fd_list.each(function() {
			var _this = $(this);
			_this.attr("href", "person/home?p=order"
					+ (state == null ? "" : "&show_state=" + state)
					+ "&last_time=" + _this.attr("data-show"));
			if (_this.attr("data-show") == sv) {
				$fd_a.html(_this.html() + '<span class="caret">');
				_this.addClass("active");
			}
		});
	}
	// 状态显示
	if ($("#order_find_state").length > 0) {
		var $fs_a = $("#order_find_state");// a
		var $fs_list = $("#order_find_state_list a");// ul > li > a
		var sv = $fs_a.attr("data-status");// 当前显示值
		$fs_list.each(function() {
			var _this = $(this);
			_this.attr("href", "person/home?p=order"
					+ (_this.attr("data-status") == 0 ? "" : "&show_state="
							+ _this.attr("data-status")));
			if (_this.attr("data-status") == sv) {
				$fs_a.html(_this.html() + '<span class="caret">');
				_this.addClass("active");
			}
		});
	}

});
/**
 * 取消订单
 * 
 * @param tradeNo
 *            订单号
 */
function cancel_order(tradeNo) {
	if (tradeNo) {
		var cause = '';
		submit_form('service/cancel_order', {
			'trade_no' : tradeNo,
			'cause' : cause,
			'type' : 'user'// 用户操作
		}, function(result) {
			// Object { message: "交易已取消", status: 1 }
			alert(result.message);
			if (result.status == code.RIGHT) {
				reloadPage();
			}
		}, function() {
			if (confirm("确认取消订单?")) {
				cause = prompt("请输入取消理由:", "不想买了");
				return true;
			} else
				return false;
		});
	}
}
/**
 * 删除订单
 * 
 * @param tradeNo
 *            订单号
 */
function delete_order(tradeNo) {
	if (confirm("确定删除订单?")) {
		alert("未完成订单不能删除!");
	}
}
/**
 * 确认订单收货
 * 
 * @param tradeNo
 *            订单号
 */
function confirm_order(tradeNo) {
	// 收货
	if (tradeNo) {
		var cause = '';
		submit_form('service/confirm_order', {
			'trade_no' : tradeNo
		}, function(result) {
			// JsonObject { message: "已确认收货", status: 1 }
			alert(result.message ? result.message : '数据异常!');
			if (result.status == code.RIGHT) {
				reloadPage();
			}
		}, function() {
			if (confirm("确认收货?")) {
				return true;
			} else
				return false;
		});
	}
}
/**
 * 订单评价
 * 
 * @param tradeNo
 *            订单号
 */
function eval_order(tradeNo) {
	var $lmb = $("#loading_modal_btn");
	if($lmb.length == 0)
		$.get("page/loading_modal", function(result) {
			$("body").append(result);
			eval_order(tradeNo);//递归
		});
	else{
		var $evalModal = $("#user_order_eval_modal");
		if($evalModal.length == 0)
			$.get("page/user_order_eval_modal", function(result) {
				$("body").append(result);
				eval_order(tradeNo);//递归
			});
		else{
			$lmb.click();
			//查询订单商品列表用于评价
			submit_form('index', {}, function(result){
				$lmb.click();
				
				$evalModal.modal("show");
			}, null);
		}
	}
	console.log("out");
}