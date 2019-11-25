<template>
	<view>
		<view class="content">
			<view class="list">
				<view class="row" @tap='goPage("user/person/person")'>
					<view class="title">
						<image :src="userInfo.avatarUrl?userInfo.avatarUrl:'/static/img/face.svg'"></image>
						<text>个人设置</text>
					</view>
					<view class="right">
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="row" @tap='goPage("login/resetpasswd")'>
					<view class="title">重置密码</view>
					<view class="right">
						<view class="icon xiangyou"></view>
					</view>
				</view>
				<view class="row" @tap='goPage("user/address/address")'>
					<view class="title">收货地址</view>
					<view class="right">
						<view class="tis"></view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="row" @tap='clearCache'>
					<view class="title">清除缓存</view>
					<view class="right">
						<view class="tis"></view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="list logout">
				<view class="row" @click="toLogout">
					退出登录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import {
		mapState
	} from 'vuex';
	import {
		isLogin
	} from '@/common/untils.js'
	export default {
		data() {
			return {
				
			};
		},
		computed: {
			...mapState(["userInfo", 'isLogin'])
		},
		onLoad(options) {

		},
		methods: {
			showType(tbIndex) {
				this.tabbarIndex = tbIndex;
				this.list = this.orderList[tbIndex];
			},
			goPage(str) {
				if (!isLogin(this.isLogin)) {
					return false;
				}
				uni.navigateTo({
					url: `/pages/${str}`
				})
			},
			//清缓存
			clearCache() {
				this.$showModal('清除后，图片等多媒体消息需要重新下载查看，确定清除？', () => {
					uni.clearStorage({
						success: () => {
							uni.showToast({
								title: '清除成功',
								icon: 'none'
							})
						}
					});
				},'清除缓存')
			},
			//退出登录
			toLogout() {
				this.$showModal('确定要退出登录?', () => {
					this.$store.commit('logout')
					setTimeout(() => {
						uni.navigateBack();
					}, 200)
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.icon {
		font-size: 30upx;

	}

	.content {
		padding-bottom: 20upx;

		.list {
			width: 96%;
			padding-left: 4%;
			background-color: #fff;
			margin-bottom: 20upx;

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

				.title {
					font-size: 32upx;
					color: #333;
					display: flex;
					align-items: center;
					padding: 20upx 0;

					image {
						width: 120upx;
						height: 120upx;
						border-radius: 50%;
						margin-right: 10upx;
					}
				}

				.right {
					display: flex;
					align-items: center;
					color: #999;

					.tis {
						font-size: 26upx;
						margin-right: 5upx;
						max-height: 120upx;

						image {
							width: 100upx;
							height: 100upx;
							border-radius: 100%;
							margin: 10upx 0;
						}
					}

					.icon {
						width: 40upx;
						color: #cecece;
					}
				}

			}
		}

		&:first-child {
			margin-top: 20upx;
		}

		.logout {
			color: $mainColor;
			font-size: 32upx;
			padding-left: 0;
			width: 100%;

			.row {
				justify-content: center;
			}
		}
	}
</style>
