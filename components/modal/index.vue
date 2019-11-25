<template>
	<view class="modal-box" v-if='isShow'>
		<view class="modal-container">
			<view class="modal-title">{{title}}</view>
			<form @submit="formSubmit"  @reset="formReset">
				<view class='modal-form'>
					<slot></slot>
				</view>
				<view class="modal-ope-btn">
					<button formType="reset">取消</button>
					<button formType="submit" class='modal-form-confirm'>{{title}}</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		props:['title','isShow'],
		data() {
			return {
				
			};
		},
		methods:{
			formSubmit(e) {
				this.$emit('formSubmit',e.detail.value)
			},
			formReset(){
				this.$emit("cancelModal");
			}
		}
	}
</script>

<style>
.modal-box {
		position: fixed;
		z-index:999;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.modal-container {
		display: inline-block;
		background: #fff;
		border-radius: 10upx;
		width: 80%;
		color:#7C7C7A;
	}

	.modal-title {
		line-height: 60upx;
		text-align: center;
		font-size: 36upx;
	}

	.modal-form {
		width: 100%;
		box-sizing: border-box;
		padding: 30upx;
		display: block;
	}

	.modal-form input {
		height: 72upx;
		line-height: 72upx;
		box-sizing: border-box;
		border-bottom: solid 1px #D6D6D4;
		margin-bottom: 20upx;
		/* border-radius: 8upx; */
		/* padding-left: 26upx; */
	}
	.modal-form input:focus{
		border: solid 1px #409EFF;
	}

	.modal-ope-btn {
		position: relative;
		line-height: 96upx;
		font-size: 36upx;
		display: flex;
		border-top:solid 1px #D6D6D4;
		box-sizing: border-box;
	}
	.modal-ope-btn button{
		flex:1;
		border:0;
		background:none;
		box-shadow: none;
		color:#7C7C7A;
	}
	.modal-ope-btn button:after{
		width:0;
		top:0;
	}
	.modal-ope-btn .modal-form-confirm{
		color:#409EFF;
	}
</style>
