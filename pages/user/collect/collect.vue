<template>
	<view class='main'>
		<view class="header" :style="{ position: headerPosition,top:headerTop}">
			<view 
			v-for='(item,i) in collectName'
			 :class='index==i?"active":""'
			 @tap='chooseCollect(i)'
			 :key='i'
			 >{{item}}</view>
		</view>
		<view class='place'></view>
		<!-- 产品列表	 -->
		<view v-if='index==0' class="goods_list">
			<view class="goods_item" v-for='(item,i) in goodsList' :key='i' @tap='goPage("/pages/goods/goods?id="+item.id)'>
				<image :src='item.productImgUrl'></image>
				<view class='goods_right'>
					<view class='goods_price'>￥{{item.price}}/{{item.unit}}</view>
					<view class='goods_name'>{{item.name}}</view>
					<view class='goods_company'>{{item.provinceName}}{{item.cityName}}</view>
					<view class='goods_location'>{{item.companyName}}</view>
				</view>
			</view>
		</view>
		<no-data v-if='index==0&&goodsList.length==0' type='2' text='暂无收藏商品'></no-data>
		<!-- 店铺列表 -->
		<view v-if="index==1" class='goods_list'>
			<view class='goods_item' v-for='(item,i) in shopList' :key='i' @tap='goPage("/pages/shop/shop?companyId="+item.id)'>
				<image :src='item.companyUrl'></image>
				<view class='shop_right'>
					<text>{{item.comName}}</text>
				</view>
			</view>
		</view>
		<no-data v-if='index==1&&shopList.length==0' type='2' text='暂无收藏店铺'></no-data>
	</view>
</template>

<script>
	import Api from '@/common/api.js';
	import NoData from '@/components/noData/index.vue';
	export default {
		components:{NoData},
		data() {
			return {
				goodsList:[],
				shopList:[],
				index:1,
				headerPosition: 'fixed',
				headerTop: null,
				collectName:['产品收藏','店铺收藏']
			};
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
		},
		onLoad(opt){
			this.index = opt.type || 0;
			this.getList(this.index)
		},
		onShow(){
			this.shopList = []; 
			this.goodsList = [];
			this.getList(this.index)
		},
		methods:{
			async getList(index){
				let res = null;
				if(index==1&&this.shopList.length==0){
					res = await Api.apiCall('get',Api.collection.shopCollectionList,{userid:this.userInfo.id});
				}else if(index==0&&this.goodsList.length==0){
					res = await Api.apiCall('get',Api.collection.productCollectionList,{userid:this.userInfo.id})
				}
				if(res&&res.code==200){
					if(index==1){
						this.shopList = res.data;
					}else{
						this.goodsList = res.data;
					}
				}
			},
			chooseCollect(i){
				this.index = i;
				this.getList(i)
			},
			goPage(url){
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		width:100%;
		height:100%;
	}
	.main{
		width:100%;
		height:100%;
		position:relative;
		background-color:#f6f6f6;
		.header{
			height:100upx;
			width:100%;
			box-sizing:border-box;
			padding-top:20upx;
			line-height:80upx;
			background-color:#fff;
			font-size:28upx;
			color:#83848b;
			display:flex;
			border-bottom:solid 1px #e4e6f2;
			view{
				flex:1;
				text-align:center;
			}
			.active{
				color:$mainColor;
				position:relative;
			}
			.active:after{
				position:absolute;
				content:'';
				width:160upx;
				height:2px;
				background-color:$mainColor;
				top:76upx;
				left:50%;
				margin-left:-80upx;
			}
		}
		.place{
			width:100%;
			height:100upx;
		}
		.goods_list{
			width:100%;
			.goods_item{
				margin-top:20upx;
				width:100%;
				height:200upx;
				box-sizing:border-box;
				padding:20upx;
				background-color:#fff;
				display:flex;
				image{
					width:160upx;
					height:160upx;
					margin-right:20upx;
				}
				.shop_right{
					color:$mainfotC;
					font-size:28upx;
					line-height:160upx;
					flex:auto;
					width:0;
					overflow:hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.goods_right{
					flex:auto;
					width:0;
					.goods_price{
						color:$mainColor;
						font-size:28upx;
						margin-bottom:10upx;
					}
					.goods_name{
						width:100%;
						color:$mainfotC;
						font-size:28upx;
						margin-bottom:10upx;
						overflow:hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.goods_company,.goods_location{
						font-size:24upx;
						color:#c2c3c9;
						margin-bottom:10upx;
					}
				}
			}
		}
	}
</style>
