<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<style type="text/css">
.eval-product {
  min-width: 500px;
  margin: 0 auto;
  margin-bottom: 20px;
	background-color: #f3f3f3;
}
.eval-pd-info {
  overflow: auto;
}
.eval-pi-img {
  float: left;
  overflow: hidden;
}
.eval-pi-others {
  float: left;
  margin-left: 10px;
  padding: 10px;
  max-width: 500px;
}
.eval-pi-img img {
  border: solid 5px #efefef;
  padding: 2px;
  border-radius: 5px;
}
.eval-pi-others {
}
.eval-title {
  white-space: nowrap;
  width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: bold;
  font-size: 16px;
}
.eval-price {
  color: #d43f3a;
  font-size: 16px;
}
.eval-stars {
  width: 200px;
  padding: 20px 0;
  text-align: center;
  color: #db7722;
  font-weight: bold;
  font-size: 16px;
  float: left;
}
.eval-stars>li {
  width: 20%;
  float: left;
}
.eval-stars-group {
  border-top: solid 3px #eee;
  overflow: auto;
}
.eval-all {
  border-top: solid thin #eee;
  margin-top: 10px;
}
.eval-stars-group > span {
  display: inline-block;
  float: left;
  padding: 20px;
  font-size: 16px;
}
.eval-content {
	width: 100%;
	padding: 10px;
	resize: none;
	border: solid 10px #eee;
}
</style>
<div class="modal fade" id="user_order_eval_modal" tabindex="-1"
	role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog  modal-lg" " role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title">商品评价</h4>
			</div>
			<div class="modal-body">
				<div class="panel panel-default">
					<div class="panel-heading">商品列表</div>
					<div class="panel-body">
						<div class="eval-product">
							<div class="eval-pd-info">
								<!-- 图片 -->
								<div class="eval-pi-img">
									<img src="images/product/none.jpg" widht="150" height="150">
								</div>
								<!-- 其他 -->
								<div class="eval-pi-others">
									<span class="eval-title">安居客来世纪东方苹果</span>
									<span class="eval-price">¥10.00</span>
								</div>
							</div>
							<div class="eval-all">
								<!-- 评价星 -->
								<div class="eval-stars-group">
									<span>商品评价 : </span><ul class="eval-stars">
										<li><i class="fa fa-star"></i></li>
										<li><i class="fa fa-star-o"></i></li>
										<li><i class="fa fa-star-o"></i></li>
										<li><i class="fa fa-star-o"></i></li>
										<li><i class="fa fa-star-o"></i></li>
									</ul>
								</div>
								<!-- 评价框 -->
								<div>
									<textarea cols="80" class="eval-content" rows="2" maxlength="100">商品留言</textarea>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="submit" class="btn btn-danger" id="eval_order">评价</button>
			</div>
		</div>
	</div>
</div>