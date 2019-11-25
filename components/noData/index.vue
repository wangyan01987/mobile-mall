<template>
	<view class='no_data_box'>
		<image :src="type==1?'/static/img/no_cla.png':type==2?'/static/img/no_collect.png':type==3?'/static/img/no_add.png':'/static/img/no_msg.jpg'"></image>
		<view>{{text}}</view>
	</view>
</template>

<script>
	export default{
		props:{
			text:{
				type:String,
				default:'暂无商品信息'
			},
			type:{
				type:String,
				default:"1"
			}
		}
	}
</script>

<style lang='scss'>
	.no_data_box{
		width:100%;
		height:400upx;
		padding-top:50upx;
		display:block;
		image{
			width:218upx;
			height:187upx;
			display:block;
			margin:0 auto;
		}
		view{
			color:#737787;
			text-align:center;
			margin-top:30upx;
			font-size:28upx;
			display:block;
		}
	}
</style>
