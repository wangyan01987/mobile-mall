<template>
	<view>
		<view class="content" v-if='addressList.length!=0'>
			<view class="list">
				<view class="row" v-for="(row,index) in addressList" :key="index" @tap="select(row)">
					<view class="center">
						<view class="name-tel">
							<view class="name">{{row.consignee}}</view>
							<view class="tel">{{row.mobile}}</view>
							<view class="default" v-if="row.isDefault">
								默认
							</view>
						</view>
						<view class="address">
							<text>{{row.provinceName}}</text>
							<text v-if="row.cityName!='市辖区'">-{{row.cityName}}</text>
							<text>-{{row.countyName}}</text>
							<text class='add_detail'>{{row.address}}</text>
						</view>
					</view>
					<view class="right">
						<view class="iconfont icon-bianji" @tap.stop="edit(row)">

						</view>
					</view>
				</view>
			</view>
		</view>
		<view class='no_data' v-else>
			<no-data type='3' text='暂无收货地址'></no-data>
		</view>
		<view class="add">
			<view class="btn" @tap="add">
				<view class="icon tianjia"></view>新增地址
			</view>
		</view>
	</view>
</template>
<script>
	import Api from '@/common/api.js'
	import NoData from '@/components/noData/index.vue';
	export default {
		components:{NoData},
		data() {
			return {
				isSelect: true,
				addressList: []
			};
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		onLoad(e) {
			if (e.type == 'select') {
				this.isSelect = true;
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			async getList() {
				let res = await Api.apiCall('get', Api.address.list, {
					userid: this.userInfo.id
				})
				if (res.code == 200) {
					this.addressList = res.data || [];
				}
			},
			edit(row) {
				uni.navigateTo({
					url: "edit/edit?type=edit&&id=" + row.id
				})

			},
			add() {
				uni.navigateTo({
					url: "edit/edit?type=add"
				})
			},
			select(row) {

			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}


	.add {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: $mainColor;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.content {
		width: 100%;
		border-top:solid 2upx #eee;
	}

	.list {
		flex-wrap: wrap;
		width: 100%;

		.row {
			width: 96%;
			padding: 20upx 2%;

			.center {
				padding-left: 4%;
				flex-wrap: wrap;
				flex: auto;
				width: 0;
				.name-tel {
					width: 100%;
					align-items: baseline;

					.name {
						font-size: 34upx;
					}

					.tel {
						margin-left: 30upx;
						font-size: 24upx;
						color: #777;
					}

					.default {
						font-size: 22upx;
						background-color: $mainColor;
						color: #fff;
						padding: 0 18upx;
						border-radius: 24upx;
						margin-left: 20upx;
					}
				}

				.address {
					font-size: 24upx;
					color: #777;
					width: 100%;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					display:block;
				}

				.add_detail {
					margin-left: 15upx;
				}
			}

			.right {
				// flex-shrink: 0;
				align-items: center;
				margin: 0 20upx;
				padding-top: 22upx;
				width: 30upx;

				.iconfont {
					font-size: 50upx;
					color: #777;
				}
			}
		}
	}

	.no_data {
		width: 100%;
		display:block;
	}
</style>
