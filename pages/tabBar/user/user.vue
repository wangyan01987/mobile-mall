<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view v-if="showHeader" class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="addr"></view>
			<view class="input-box">

			</view>
			<view class="icon-btn">
				<view class="min-badge">
					<view class="icon tongzhi" @tap="toMsg"></view>
					<view class="min-badge-count"><text>{{msgNum}}</text></view>
				</view>
				<view class="icon setting" @tap="goPage('../../user/setting/setting')"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		<!-- 用户信息 -->
		<view class="user" style=''>
			<!-- 头像 -->
			<view class="left">
				<avatar :src="userInfo.avatarUrl?userInfo.avatarUrl:user.face" class='avatarClass'></avatar>
			</view>
			<!-- 昵称,个性签名 -->
			<view class="right">
				<view class="username" v-if='!isLogin' @tap="toLogin">{{user.username}}</view>
				<view class='username' @tap="goPage('/pages/user/person/person')" v-else>
					<view>
						<text>{{userInfo.nickname}}</text>
						<text class='user_vip' v-if='userInfo.isVIP==1'><text class='iconfont icon-VIP'></text>VIP</text>
					</view>
					<view class='signature'>{{userInfo.introduction?userInfo.introduction:''}}</view>
				</view>
			</view>
		</view>
		<view class="my_collection">
			<view class="col_item col_pro" @tap='goCollect(0)'>
				<view class="col_num">{{goodsNum}}</view>
				<view class="col_name">产品收藏</view>
			</view>
			<view class='col_item col_shop' @tap='goCollect(1)'>
				<view class="col_num">{{shopNum}}</view>
				<view class="col_name">店铺收藏</view>
			</view>
		</view>
		<view class="list">
			<view class="row" @tap="goPage('../../user/setting/setting')">
				<view class="title">设置</view>
				<view class="right">
					<view class="icon xiangyou"></view>
				</view>
			</view>
			<view class="row" @tap='tosuggestion'>
				<view class="title">意见反馈</view>
				<view class="right">
					<view class="icon xiangyou"></view>
				</view>
			</view>
		</view>
		<view class="place-bottom"></view>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex';
	import Api from '@/common/api.js'
	import {
		isLogin
	} from '@/common/untils.js'
	import Avatar from '@/components/avatarBox/avatarBox.vue'
	
	export default {
		components:{Avatar},
		data() {
			return {
				msgNum: 0,
				isfirst: true,
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				//个人信息,
				user: {
					username: '未登录',
					face: '/static/img/face.svg',
					balance: 0,
					envelope: 0
				},
				goodsNum: '0',
				shopNum: '0'
			}
		},
		computed: {
			...mapState(['userInfo', 'isLogin'])
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		onLoad() {
			this.statusHeight = 0;
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
		},
		onShow() {
			if (this.isLogin) {
				this.getNum()
			} else {
				this.goodsNum = 0;
				this.shopNum = 0;
			}
			uni.$emit('getMsg', this.userInfo);
		},
		methods: {
			async getNum() {
				//获取收藏数量
				let res = await Api.apiCall('get', Api.collection.collectionNum, {
					userid: this.userInfo.id
				}, true);
				if (res.code == 200) {
					this.goodsNum = res.data.productCollectCount;
					this.shopNum = res.data.companyCollectCount;
				}

				//获取消息数量
				let msgNum = await Api.apiCall('get', Api.message.feedBackNum, {
					UserId: this.userInfo.id
				}, true);
				if (msgNum.code == 200) {
					this.msgNum = msgNum.data > 100 ? '+99' : msgNum.data;
				}
			},
			//消息列表
			toMsg() {
				if (isLogin(this.isLogin)) {
					uni.navigateTo({
						url: '../../msg/msg'
					})
				}
			},
			tosuggestion() {
				if (isLogin(this.isLogin)) {
					uni.navigateTo({
						url: '/pages/user/suggestion/suggestion'
					})
				}
			},
			toLogin() {
				isLogin(this.isLogin)
			},
			goCollect(type) {
				if (isLogin(this.isLogin)) {
					this.goPage('/pages/user/collect/collect?type=' + type)
				}
			},
			goPage(url) {
				if (isLogin(this.isLogin)) {
					uni.navigateTo({
						url: url
					})
				}

			}
		}
	}
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #f3f3f3;
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #f06c7a;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */

	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: $mainColor;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.icon-btn {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.icon {
				color: #fff;
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}

	.place {
		background-color: #ea5d6a;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.place-bottom {
		height: 300upx;
	}

	.user {
		width: 92%;
		padding: 0 4%;
		display: flex;
		align-items: center;
		background-repeat: no-repeat;
		background-size: cover;
		padding-bottom: 80upx;
		background-image: url('~@/static/img/bg.png');

		.left {
			width: 20vw;
			height: 20vw;
			flex-shrink: 0;
			margin-right: 20upx;
			border: solid 1upx #fff;
			border-radius: 100%;

			image {
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}

		}

		.right {
			width: 100%;

			.username {
				font-size: 36upx;
				color: #fff;
			}

			.signature {
				color: #eee;
				font-size: 28upx;
			}
		}
	}

	.my_collection {
		background: #fff;
		display: flex;
		margin-bottom: 20upx;
		padding: 20upx 0;

		.col_item {
			padding: 40upx 0;
			flex: 1;
			text-align: center;
			font-size: 28upx;

			.col_num {
				margin-bottom: 10upx;
				font-weight: 600;
			}
		}

		.col_pro {
			border-right: solid 1px #ddd;
		}
	}

	.list {
		width: 96%;
		padding-left: 4%;
		background-color: #fff;
		margin-bottom: 20upx;
		font-size: 28upx;

		.row {
			widows: 100%;
			min-height: 120upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: solid 1upx #eee;

			&:last-child {
				border-bottom: none;
			}

			.right {
				display: flex;
				align-items: center;
				color: #999;
				margin-right: 30upx;

				.icon {
					width: 40upx;
					color: #cecece;
					font-size: 30upx;
				}

				.signature {
					font-size: 24upx;
				}
			}

		}
	}

	.min-badge {
		position: relative;
		display: inline-block;
		line-height: 1;
		vertical-align: middle;
	}

	.min-badge-count {
		position: absolute;
		transform: translateX(50%);
		top: -2upx;
		right: 0;
		height: 30upx;
		min-width: 30upx;
		color: #fff;
		line-height: 30upx;
		text-align: center;
		padding: 0 10upx;
		font-size: 20upx;
		white-space: nowrap;
		font-weight: 600;
		z-index: 10;
		box-sizing: border-box;
	}

	.user_vip {
		margin-left: 16upx;
		font-size: 24upx;
		display: inline-block;
		padding: 2upx 14upx;
		border-radius: 6upx;
		background-color: rgba(255, 255, 255, 0.5);
		color: $mainColor;

		.iconfont {
			margin-right: 6upx;
			font-size: 30upx;
		}
	}
</style>
