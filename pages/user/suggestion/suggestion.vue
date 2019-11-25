<template>
	<view class='suggestion_box'>
		<view class='textarea_box'>
					<textarea class='suggestion_text' placeholder="请输入您的反馈信息,我们会尽快解决!" auto-height maxlength='200' v-model='content' />
		</view>
		<view class="concat">
			<text >联系方式：</text>
			<input class="concat_txt" type="text" placeholder="请输入手机号/邮箱/QQ号/会员号" v-model='contact'/>
		</view>
		<button class='submit_btn add' hover-class='none' @tap='submit'>提交</button>
	</view>
</template>

<script>
	import Api from '@/common/api.js'
	export default {
		data() {
			return {
				content:'',
				contact:''
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		methods: {
			async submit(){
				let opinion_Content = this.content;
				let contact = this.contact;
				if(opinion_Content==''){
					uni.showToast({
						title:'反馈内容不能为空',
						icon:'none'
					})
					return false;
				}
				if(contact==''){
					uni.showToast({
						title:'联系方式不能为空',
						icon:'none'
					})
					return false;
				}
				let userId = this.userInfo.id;
				let params = {
					contact,
					userId,
					opinion_Content
				}
				let res = await Api.apiCall('post',Api.message.feedBack,params);
				if(res.code==200){
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateBack()
					},1000)
				}
			}
		}
	}
</script>

<style lang='scss'>
	page{height:100%;background-color:#f3f3f3;font-size:30upx;}
	.add {
		position: fixed;
		bottom: 30upx;
		width:92%;
		left:4%;
		height: 80upx;
		justify-content: center;
		align-items: center;
		border-radius:40upx;
		background-color:$mainColor;
		color:#fff;
	}
	.suggestion_box{
		height:100%;
		box-sizing:border-box;
	}
	.textarea_box{
		background-color:#fff;
		padding:20upx 4%;
		border-top:solid 1px #f8f8f8;
	}
	.suggestion_text{
		background-color:#fff;
		border-radius:10upx;
		width:100%;
		min-height:380upx;
		box-sizing:border-box;
		padding:15upx;
		line-height:38upx;
		border:solid 1upx #f8f8f8;
	}
	.concat{
		padding:0 4%;
		margin-top:26upx;
		width:92%;
		height:120upx;
		display:flex;
		align-items:center;
		color:$mainfotC;
		background:#fff;
		font-size:30upx;
		text{
			width:146upx;
		}
		.concat_txt{
			flex:auto;
			width:0;
			height:100%;
			line-height:100%;
			font-size:28upx;
			border:0;
		}
	}
</style>
