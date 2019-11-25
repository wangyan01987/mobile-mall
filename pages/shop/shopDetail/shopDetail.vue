<template>
	<view class='shop_detail'>
		<!-- 公司信息 -->
		<view class="info-box goods-info">
			<view class="item_box">
				<view class="company_name">
					<image :src='company.avatarUrl'></image>
					<view class="name">{{company.name}}</view>
				</view>
			</view>
			<view class="item_box">
				<view>
					<text class="item_title">全部商品</text>
					{{company.totalCount}}
				</view>
				<view><text class="item_title">开店时间</text>{{company.createTime}}</view>
				<view class='company_add'>
					<text class='address_text item_title'>企业地址</text>
					<view class='address_container'>{{company.address}}</view>
				</view>
			</view>
			<view class="item_box">
				<view><text class='item_title'>联系人</text>{{company.contacts}}</view>
				<view class="">
					<text class="item_title">电话</text>
					<text>{{company.phone}}</text>
				</view>
				<view><text class="item_title">邮箱</text><text>{{company.email}}</text></view>
				<view><text class="item_title">QQ</text><text>{{company.qq}}</text></view>
				<view><text class="item_title">阿里旺旺</text>{{company.aliTalk}}</view>
				<view><text class="item_title">微信</text>{{company.weChat}}</view>
				<!-- 详情 -->
				<view class="description" id='des'>
					<view class="item_title">简介</view>
					<view class="content">
						<rich-text :nodes="company.introduce"></rich-text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api.js'
	export default {
		data() {
			return {
				company: {},
				companyId: ''
			};
		},
		async onLoad(opt) {
			this.companyId = opt.id || 1;
			let res = await Api.apiCall('get', Api.shop.shopDetail, {
				companyId: this.companyId
			});
			if (res.code == 200) {
				this.company = {
					...res.data,
					...this.company
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: linear-gradient(to bottom, $mainColor 0%, #fff 46%);
	}

	.shop_detail {
		.company_name {
			display: flex;

			image {
				width: 80upx;
				height: 80upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}

			.name {
				flex: auto;
				height: 80upx;
				display: flex;
				align-items: center;
				font-size: 32upx;
				font-weight: 600;
				width: 0;
			}
		}

		.company_add {
			display: flex;

			.address_container {
				flex: auto;
				width: 0;
			}
		}

		.info-box {
			width: 92%;
			padding: 20upx 4%;
			margin-bottom: 20upx;

			.item_box {
				padding: 30upx 20upx 0 30upx;
				border-radius: 20upx;
				background-color: #fff;
			}
		}

		.goods-info {
			view {
				margin-bottom: 20upx;
				font-size: 28upx;

				.item_title {
					font-weight: 600;
					font-size: 32upx;
					color: $mainfotC;
					width: 180upx;
					display: inline-block;
				}
			}
		}

		.description {
			background: #fff;
			font-size: 26upx;
			margin-top: 20upx;

			.title {
				width: 100%;
				height: 80upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26upx;
				color: #999;
			}
		}
	}
</style>
