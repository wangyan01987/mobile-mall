<template>
	<view>
		<view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="target" v-for="(target,index) in orderbyList" @tap="select(index)" :key="index" :class="[target.selected?'on':'']">
				{{target.text}}
				<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<goods-list :goodsList='goodsList' :loadingText='loadingText'></goods-list>
		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" @onCancel="onCancel" @onConfirm="onConfirm" :noArea='true'
		 :pickerValueDefault='pickerValueDefault'></mpvue-city-picker>
	</view>
</template>

<script>
	import Api from '@/common/api.js'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import GoodsList from '@/components/goodsList/index.vue'
	export default {
		components: {
			mpvueCityPicker,
			GoodsList
		},
		data() {
			return {
				goodsList: [],
				loadingText: "正在加载...",
				headerTop: "0px",
				headerPosition: "fixed",
				orderbyList: [{
						text: "综合",
						selected: true,
						orderbyicon: false,
						orderby: 0
					},
					{
						text: "价格",
						selected: false,
						orderbyicon: ['sheng', 'jiang'],
						orderby: 0
					},
					{
						text: "地区",
						selected: false,
						orderbyicon: false,
						orderby: 0
					}
				],
				orderby: "sheng",
				pageIndex: 1,
				pageSize: 10,
				name: '',
				CompanyId: '',
				productType: '',
				sort: '',
				cityCode: '',
				pTypeId: '',
				typeId: '',
				themeColor: '#007AFF',
				pickerValueDefault: [0, 0, 0],
				showList: true
			};
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.pTypeId = option.pTypeId || '';
			this.typeId = option.typeId || '';
			uni.setNavigationBarTitle({
				title: option.name || option.typeName || '商品列表'
			});
			this.name = option.name || '';
			// CompanyId name productType pageIndex pageSize
			this.getList();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.reload();
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			if (this.pageIndex < this.totalPage) {
				this.loadingText = "正在加载...";
				this.pageIndex = this.pageIndex + 1;
				this.getList();
			} else {
				this.loadingText = "到底了";
				return false;
			}
		},
		methods: {
			reload() {
				this.orderbyList[1].orderby = 0;
				for (let i = 0; i < this.orderbyList.length; i++) {
					this.orderbyList[i].selected = !i;
				}
				this.sort = '';
				this.cityCode = '';
				this.pageIndex = 1;
				this.pickerValueDefault = [0, 0, 0];
				this.getList('empty');
			},
			async getList(type) {
				this.loadingText = "正在加载...";
				let res = await Api.apiCall('get', Api.goods.goodsList, {
					pageIndex: this.pageIndex,
					pageSize: this.pageSize,
					name: this.name,
					CompanyId: this.CompanyId,
					productType: this.productType,
					sort: this.sort,
					cityCode: this.cityCode,
					pTypeId: this.pTypeId, //一级分类
					typeId: this.typeId //二级分类
				})
				if (res.code == 200) {
					uni.stopPullDownRefresh();
					if(type=='empty'){
						this.goodsList = [];
					}
					this.totalPage = res.totalpage;
					if (res.data.length > 0) {
						this.showList = true;
						this.goodsList = [...this.goodsList, ...res.data];
						if (res.totalpage == 1 && res.totalcount <= this.pageSize) {
							this.loadingText = "到底了";
						}
					} else {
						if (this.pageIndex == 1) {
							this.showList = false;
						} else {
							this.showList = true;
						}
					}
				}
			},
			onCancel(e) {

			},
			chooseCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.region = e;
				this.pickerValueDefault = e.value;
				this.cityCode = e.cityCode+'00';
				this.orderbyList[1].orderby = 0;
				this.sort = ''
				this.pageIndex = 1;
				this.getList('empty');
			},
			//排序类型
			select(index) {
				let tmpTis = this.orderbyList[index].text + "排序 "
				if (this.orderbyList[index].orderbyicon) {
					this.cityCode = '';
					this.pickerValueDefault = [0, 0, 0];
					this.pageIndex = 1;
					let type = this.orderbyList[index].orderby == 0 ? '1' : '0';
					if (this.orderbyList[index].selected) {
						type = this.orderbyList[index].orderby == 0 ? '0' : '1';
						this.orderbyList[index].orderby = this.orderbyList[index].orderby == 0 ? 1 : 0;
					}
					tmpTis += type
					if (type == 1) {
						this.sort = "PriceAsc";
					} else {
						this.sort = 'PriceDesc'
					}
					this.getList('empty');
				}
				this.orderbyList[index].selected = true;
				let len = this.orderbyList.length;
				for (let i = 0; i < len; i++) {
					if (i != index) {
						this.orderbyList[i].selected = false;
					}
				}
				if (index == 2) {
					this.$refs.mpvueCityPicker.show()
				} else if (index == 0) {
					this.reload();
				}
			}
		}

	}
</script>

<style lang="scss">
@import "@/static/css/goodsList.scss";
	.goods-list {
		top: 0;
		margin: 0;
	}

	.icon {
		font-size: 26upx;
	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		border-bottom: solid 1upx #eee;

		.target {
			width: 20%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-bottom: -2upx;
			color: #aaa;

			&.on {
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}


		}
	}

	.place {

		background-color: #ffffff;
		height: 100upx;

	}
</style>
