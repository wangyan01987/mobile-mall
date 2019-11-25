<template>
	<view>
		<view class="header_before" :style="{ position: headerPosition,top:headerTop,backgroundColor:bgC}"></view>
		<view class="header" :style="{ position: headerPosition,top:headerTop,backgroundColor:bgC}">
			<!-- 搜索框 -->
			<view class="icon xiangqian" :style='{color:bgC=="none"?"#fff":"#999"}' @tap="back" ></view>
			<view class="input-box" >
				<input @tap="toSearch" placeholder="请输入您要搜索的商品名称" v-model='name' disabled='true' placeholder-style="color:#c0c0c0;" />
				<view class="icon guanbi close_btn" @tap.stop='clearName'></view>
			</view>
			<view class='keep_box' @tap='keep' :class='company.isCollect?"keep":""'>
				<view 
				class='icon shoucang' 
				:style='{color:company.isCollect?"#ff2c29":bgC=="none"?"#fff":"#999"}'></view>
				<view 
				class='keep_text' 
				:style='{color:company.isCollect?"#ff2c29":bgC=="none"?"#fff":"#999"}'
				>{{company.isCollect?"已收藏":"未收藏"}}</view>
			</view>
		</view>
		<!-- 占位 -->
		<!-- <view class="place"></view> -->

		<view class="screen_box">
			<view class='shop_title' @tap='goShop'>
				<view class='title_left'>
						<image :src='company.avatarUrl'></image>
						<view class='company_name'>
							<view>{{company.name}}</view>
							<view class='company_intro'><rich-text :nodes="company.introduce"></rich-text></view>
						</view>
					
				</view>
				<view class="title_right" >
					<view class="icon xiangyou" ></view>
				</view>
			</view>
			<view class='all_goods'>全部宝贝</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<goods-list :goodsList='goodsList' :loadingText='loadingText' :noHis='true'></goods-list>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api.js';
	import GoodsList from '@/components/goodsList/index.vue'
	import {
		isLogin
	} from '@/common/untils.js'
	export default {
		components:{GoodsList},
		data() {
			return {
				shopId: '',
				company: {},
				goodsList: [],
				pageIndex: 1,
				pageSize: 10,
				name: '',
				showList: true,
				loadingText: "正在加载...",
				bgC: 'none'
			};
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo || {};
			},
			isLogin() {
				return this.$store.state.isLogin;
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
			if (e.scrollTop > 0) {
				this.bgC = '#fff';
			} else {
				this.bgC = 'none'
			}
		},
		onLoad(msg) {
			this.shopId = msg.companyId || 1;
			this.goodsId = msg.goodsId || null;
			this.name = msg.name || '';
			this.onload()
		},
		onShow() {
			this.getShopDetail();
		},
		onPullDownRefresh() {
			this.name = '';
			this.getShopDetail();
			this.onload()
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
			onload() {
				this.pageIndex = 1;
				this.goodsList = [];
				this.getList();
			},
			clearName() {
				if (this.name != '') {
					this.name = '';
					this.goodsList = [];
					this.getList();
				}
			},
			async getShopDetail() {
				let res = await Api.apiCall('get', Api.shop.shopDetail, {
					companyId: this.shopId,
					userId: this.userInfo.id ? this.userInfo.id : 0
				});
				if (res.code == 200) {
					this.company = res.data;
				}
			},
			async keep() {
				if (isLogin(this.isLogin)) {
					let params = {
						companyId: this.shopId,
						userId: this.userInfo.id,
						isCollect: !this.company.isCollect ? 1 : 0
					};
					let res = await Api.apiCall('put', Api.collection.shopCollection, params, true);
					if (res.code == 200) {
						this.company.isCollect = !this.company.isCollect;
						let str = this.company.isCollect ? '收藏成功' : '取消收藏成功';
						uni.showToast({
							title: str,
							icon: 'none'
						})
					}

				}

			},
			goShop() {
				uni.redirectTo({
					url: '/pages/shop/shopDetail/shopDetail?id=' + this.shopId
				})
			},
			//返回上一页
			back() {
				// if(this.goodsId){
				// 	uni.navigateTo({
				// 		url:`/pages/goods/goods?id=${this.goodsId}`
				// 	})
				// }
				uni.navigateBack();
			},
			async getList() {
				let res = await Api.apiCall('get', Api.goods.goodsList, {
					pageIndex: this.pageIndex,
					pageSize: this.pageSize,
					name: this.name,
					CompanyId: this.shopId,
				})
				if (res.code == 200) {
					uni.stopPullDownRefresh();
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
			toSearch() {
				uni.redirectTo({
					url: '/pages/tabBar/category/searchPage/searchPage?companyId=' + this.shopId
				})
			},
		}
	}
</script>

<style lang="scss">
@import "@/static/css/goodsList.scss";
	.goods-list {
		top: 0;
		margin: 0;
		margin-top: 20upx;
	}
	/*  #ifdef  APP-PLUS  */
	.header_before{
		height:var(--status-bar-height);
		position:fixed;
		top:0;
		width:100%;
		background:none;
		z-index: 10;
	}
	/*  #endif  */
	.header {
		width: 96%;
		padding-left:4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: none;

		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		.xiangqian{
			font-size: 36upx;
			margin-left: 6upx;
			color: #fff;
			margin-right:20upx;
		}
		.keep_text{
			color:#fff;
		}
		.keep_box {
			font-size: 22upx;
			width:160upx;
			text-align:center;
			.icon {
				font-size: 28upx;
				color: #fff;	
			}
			.keep_text{
				font-size:20upx;
			}
		}
		.input-box {
			width: 100%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
				z-index:10;
			}

			input {
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
				width: 98%;
			}
		}
	}

	.place {
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		// margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.screen_box {
		width: 92%;
		padding:0 4%;
		height: 20vh;
		position: relative;
		// 必须40kb以下才可以在微信小程序中这么用
		background-image:url('~@/static/img/shop_bg.png');
		background-repeat:no-repeat;
		background-size:cover;
		padding-top:100upx;
		/*  #ifdef  APP-PLUS  */
		padding-top:160upx;
		/*  #endif  */
		.shop_title{
			margin-top:30upx;
			display:flex;
			height:100upx;
			justify-content: space-between;
			.title_left{
				display:flex;
				image{
					width:80upx;
					height:80upx;
					border-radius:10upx;
				}
				.company_name{
					color:#fff;
					margin-left:20upx;
					font-size:30upx;
					font-weight:600;
					.company_intro{
						font-weight: normal;
						margin-top:6upx;
						height:30upx;
						overflow:hidden;
						width:100%;
						text-overflow: ellipsis;
						white-space: nowrap;
						rich-text{
							overflow:hidden;
							font-size:26upx;
							width:100%;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
		}
		.title_right{
			.icon{
				font-size:30upx;
				color:#fff;
			}
		}
		.all_goods{
			color:#fff;
			width:160upx;
			position:absolute;
			bottom:30upx;
			text-align:center;
			left:5%;
			font-size:30upx;
		}
		.all_goods:after{
			content:'';
			position:absolute;
			width:80upx;
			height:2px;
			background-color:#fff;
			bottom:-18upx;
			left:40upx;
		}
	}
</style>
