<template>
	<view class='person_box'>
		<view class="avatar">
			<avatar :src='userInfo.avatarUrl?userInfo.avatarUrl:avatar'></avatar>
			<text>修改头像</text>
		</view>
		<view class="list">
			<view class="row" @tap='showNick=true'>
				<view class="title">昵称</view>
				<view class="right">
					<view>{{userInfo.nickname}}</view>
					<view class="icon xiangyou"></view>
				</view>
			</view>
			<view class="row" @tap='showSignature=true'>
				<view class="title">签名</view>
				<view class="right">
					<view>{{userInfo.introduction?userInfo.introduction:''}}</view>
					<view class="icon xiangyou"></view>
				</view>
			</view>
		</view>
		<modal title='修改昵称' @formSubmit='formSubmit(1)' :isShow='showNick' @cancelModal='cancelModal(1)'>
			<input placeholder="请输入昵称" v-model='nickName' maxlength='11' />
		</modal>
		<modal title='修改签名' @formSubmit='formSubmit(2)' :isShow='showSignature' @cancelModal='cancelModal(2)'>
			<input type="text" placeholder="请输入个性签名" v-model='signature' maxlength='25'>
			<!-- <textarea class='signature_txt' placeholder="请输入个性签名" v-model='signature' maxlength='25' /> -->
		</modal>
	</view>
</template>

<script>
	import Modal from '@/components/modal/index.vue';
	import Api from '@/common/api.js'
	import {mapState} from 'vuex'
	import Avatar from '@/components/avatarBox/avatarBox.vue'
	export default {
		components:{Modal,Avatar},
		data() {
			return {
				showNick:false,
				nickName:'',
				avatar:'/static/img/face.svg',
				showSignature:false,
				signature:''
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(){
			this.nickName = this.userInfo.nickname;
			this.signature = this.userInfo.introduction
		},
		methods: {
			formSubmit(type){
				let title = '';
				if(type==1){
			       if(this.nickName==''){
					   title = '昵称不能为空'
				   }
				}else{
					if(this.signature==''){
						title = '个性签名不能为空'
					}
				}
				if(this.title==''){
					uni.showToast({
						title:title,
						icon:'none'
					})
					return false;
				}
				if(type==1){
					this.putNickName()
				}else{
					this.putSignature()
				}
			},
			async putNickName(){
				let params = {
					id:this.userInfo.id,
					nickname:this.nickName
				}
				let res = await Api.apiCall('put',Api.index.nickName,params);
				if(res.code==200){
					uni.showToast({
						icon:'none',
						title:res.msg
					})
					let userInfo = this.userInfo;
					userInfo.nickname = this.nickName;
					this.$store.commit('setUserInfo',userInfo)
				}
				this.showNick = false;
			},
			async putSignature(){
				let params = {
					id:this.userInfo.id,
					introduction:this.signature
				}
				let res = await Api.apiCall('put',Api.index.signature,params);
				if(res.code==200){
					uni.showToast({
						icon:'none',
						title:res.msg
					})
					let userInfo = this.userInfo;
					userInfo.introduction = this.signature;
					this.$store.commit('setUserInfo',userInfo)
				}
				this.showSignature = false;
			},
			cancelModal(type){
				if(type==1){
					this.showNick = false;
				}else{
					this.showSignature = false;
				}
			},
		}
	}
</script>

<style lang='scss'>
	.person_box{
		box-sizing:border-box;
		padding:30upx;
		font-size:28upx;
		.avatar{
			display:flex;
			flex-direction:column;
			text-align: center;
			width:100%;
			image{
				width: 20vw;
				height: 20vw;
				border-radius:50%;
				margin:0 auto;
				margin-bottom:14upx;
			}
		}
		.list {
			width: 96%;
			padding-left: 4%;
			background-color: #fff;
			margin-bottom: 20upx;
			font-size:28upx;
			.row {
				min-height: 90upx;
				display: flex;
				align-items: center;
				/* justify-content: space-between; */
				border-bottom: solid 1upx #eee;
				.title{
					width:90upx;
				}
				.right {
					flex:auto;
					width:0;
					display: flex;
					align-items: center;
					color: #999;
					margin-right:10upx;
					justify-content:flex-end;
					.icon {
						width: 40upx;
						color: #cecece;
						font-size:30upx;
					}
				}
		
			}
		}
	}
	.signature_txt{
		background-color:#fff;
		/* border-radius:10upx; */
		width:100%;
		height:40upx;
		box-sizing:border-box;
		/* padding:15upx; */
		line-height:40upx;
		border-bottom:solid 1px #C8C8C8;
	}
</style>
