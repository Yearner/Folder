<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
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
					<div class="panel-heading">商品图片</div>
					<div class="panel-body">
						<div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<input type="hidden" id="editing_skuId" value="" autocomplete="off">
				<button type="submit" class="btn btn-danger" id="product_save">保存</button>
			</div>
		</div>
	</div>
</div>