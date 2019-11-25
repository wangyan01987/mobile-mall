<template>
	<view class='guide_box'>
		<swiper class="swiper" :indicator-dots="indicatorDots" :indicator-color="indicatorColor" :indicator-active-color='inActColor'
		 @change='change'>
			<swiper-item v-for='(item,i) in guideData' :key='i'>
				<image :src='item.img' mode='widthFix'></image>
				<view class='go_tab' v-if='i==guideData.length-1'>
					<button type="default" @click='goTab'>立即体验</button>
				</view>
			</swiper-item>
		</swiper>
		<view class="dot_box">
			<view class="dot_item" v-for='(item,i) in guideData' :key='i' :class='current==i?"active":""'></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: false,
				guideData: [{
					img: '/static/guidImg/qdy1.png'
				}, {
					img: '/static/guidImg/qdy2.png'
				}, {
					img: '/static/guidImg/qdy3.png'
				}],
				indicatorColor: 'rgba(255,255,255,0.5)',
				inActColor: '#ffffff',
				current: 0
			}
		},
		methods: {
			goTab() {
				uni.switchTab({
					url: '/pages/tabBar/home/home'
				})
			},
			change(e) {
				this.current = e.detail.current;
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #ff4441;

		

		.guide_box {
			flex: 1;
			height: 100%;
			position:relative;
			.dot_box {
				position: absolute;
				width: 100%;
				height: 20upx;
				left: 0;
				bottom: 80upx;
				display: flex;
				justify-content: center;
			
				.dot_item {
					width: 18upx;
					height: 18upx;
					border-radius: 18upx;
					margin-left: 15upx;
					background-color: rgba(255, 255, 255, 0.5);
				}
				.active{
					background-color:#fff;
					width:36upx;
				}
			}
			.swiper {
				width: 100%;
				height: 100%;
				position: relative;

				swiper-item {
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					background-color: #ff4441;

					image {
						width: 100%;
						height: 100%;
					}

					.go_tab {
						position: absolute;
						width: 100%;
						left: 0;
						bottom: 130upx;
						display: flex;
						jusity-content: center;

						button {
							color: #ff2c29;
							font-size: 32upx;
							// background:none;
						}
					}

				}
			}
		}
	}
</style>
