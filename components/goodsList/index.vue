<template>
	<view class='goods_wrapper'>
		<view v-if='goodsList.length!=0'>
			<view class="product-list">
				<view class="product" v-for="(goods,i) in goodsList" :key="i" @tap="toGoods(goods)">
					<image :src="goods.previewImgUrl?goods.previewImgUrl:goods.productImgUrl?goods.productImgUrl:'/static/img/goods/nop.png'"></image>
					<view class="info">
						<view class='pro pro_title'><text class='pro_type'>供应</text><text>{{goods.name}}</text></view>
						<view class='pro pro_company'>{{goods.companyName}}</view>
						<view class='pro pro_position'>{{goods.provinceName}}{{goods.cityName?goods.cityName:''}}</view>
						<view class="price">￥{{ goods.price }}/{{goods.unit}}</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
		<view class='no_goods' v-else>
			<no-data type='1'></no-data>
		</view>
	</view>
</template>

<script>
	import NoData from '../noData/index.vue'
	export default {
		components:{NoData},
		props: {
			goodsList: Array,
			loadingText: {
				type:String,
				default:'到底了'
			},
			noHis:{
				type:Boolean,
				default:false
			}
		},
		mounted() {
			
		},
		methods: {
			//商品跳转
			toGoods(e) {
				let id = e.id;
				if(this.noHis){
					uni.redirectTo({
						url: '/pages/goods/goods?id=' + id
					});
				}else{
					uni.navigateTo({
						url: '/pages/goods/goods?id=' + id
					});
				}
			}
		}
	}
</script>

<style lang='scss'>
	@import "@/static/css/goodsList.scss";
	.no_goods {
		position: relative;
		min-height: 200upx;
		box-sizing:border-box;
		width:100%;
	}
</style>
