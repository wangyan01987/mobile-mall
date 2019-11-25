<template>
	<view class='msg_detail'>
		<view class="msg_question">
			<view class="que_left"></view>
			<view class="que_right">
				<view>{{msg.message_Title}}</view>
				<view class='time'>{{msg.time}}</view>
			</view>
		</view>
		<view class="msg_answer">{{msg.message_Content}}</view>
	</view>
</template>

<script>
	import Api from '@/common/api.js'
	import {
		dateFormat
	} from '@/common/untils.js'
	export default {
		data() {
			return {
				id: '',
				msg: {}
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		onLoad(data) {
			this.id = data.id;
			this.getMsg();
		},
		methods: {
			async getMsg(){
				let res = await Api.apiCall('get',Api.message.messageDetail,{Id:this.id,UserId:this.userInfo.id});
				if(res.code==200){
					this.msg = res.data;
					this.msg.time = dateFormat(this.msg.replyTime,'.');
				}
			}
		}
	}
</script>

<style lang="scss">
	.msg_detail {
		padding: 0 4%;
		font-size: 28upx;

		.msg_question {
			padding: 24upx 0 32upx 0;
			display:flex;
			border-bottom: solid 1px #e4e6f2;
			.que_left{
				width:100upx;
				height:100upx;
				border-radius:50%;
				background-color:#e4007f;
				margin-right:20upx;
			}
			.que_right{
				flex:auto;
				width:0;
				display:flex;
				justify-content: center;
				flex-direction: column;
			}
		}

		.msg_answer {
			padding-top: 20upx;
			line-height: 38upx;
			text-indent: 48upx;
			color:#747788;
			text-align: justify;
		}
		.time{
			font-size: 22upx;
			color: #bebebe;
			margin-top:10upx;
		}
	}
</style>
