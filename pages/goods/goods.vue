<template>
	<view>
		<view class="status" :style="{ opacity: afterHeaderOpacity }"></view>
		<view class="header">
			<!-- 头部-默认显示 -->
			<view class="before" :style="{ opacity: 1 - afterHeaderOpacity, zIndex: beforeHeaderzIndex }">
				<view class="back">
					<view class="icon xiangqian" @tap="back" v-if="showBack"></view>
				</view>
				<view class="middle"></view>
			</view>
		</view>

		<!-- 商品主图轮播 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="(swiper,i) in swiperList" :key="i">
					<image :src="swiper" @tap='showImg(swiper)'></image>
				</swiper-item>
			</swiper>
			<view class="indicator"><text class='current_indi'>{{currentSwiper+1}}/</text>{{swiperList.length}}</view>
			<view class='goods_title'>
				<view class="price">￥{{goods.price}}/{{goods.unit}}</view>
				<view class="title">
					{{goods.name}}
				</view>
			</view>
		</view>
		<!-- 标题 价格 -->
		<view class="info-box goods-info">
			<view><text class="item_title">起订</text>{{goods.minOrderNum}}台 </view>
			<view><text class="item_title">供货数量</text>{{goods.stock}}台</view>
			<view><text class="item_title">发货期限</text>自买家付款之日起{{goods.deliverDays}}天内发货</view>
			<view><text class="item_title">所在地</text>{{goods.provinceName}} {{goods.cityName}}</view>
			<view><text class="item_title">最后更新</text>{{goods.upshelfTime}}</view>
		</view>
		<!-- 公司信息 -->
		<view class="info-box goods-info company">
			<view class="company_name" @tap='goShop'>
				<view class='no_b'>
					<image :src='goods.comImgUrl'></image>
					<text>{{goods.comName}}</text>
				</view>
				<view class='go_shop' @tap='goShop'>
					<text class='iconfont icon-dianpu'></text>
					<text>进店逛逛</text>
				</view>
			</view>
			<view class="comp-item">
				<text @tap='makecall(goods.phone)' >
				<text class='item_title'>手机号</text>
				<text style='color:#6684FA'>{{goods.phone}}</text>
				</text>
			</view>
			<view class="comp-item">
				<text><text class='item_title' >邮箱</text><text>{{goods.email}}</text></text>
			<text @tap='copy(goods.email)'><text class='iconfont icon-fuzhi'></text></text></view>
			<view class="comp-item"><text>
			<text class='item_title'>QQ</text><text>{{goods.qq}}</text></text>
			<text @tap='copy(goods.qq)'><text class='iconfont icon-fuzhi'></text></text></view>
			<view class="comp-item"><text>
			<text class='item_title'>阿里旺旺</text>{{goods.aliTalk}}</text>
			<text @tap='copy(goods.aliTalk)'><text class='iconfont icon-fuzhi'></text></text></view>
			<view class="comp-item"><text>
			<text class='item_title'>微信</text>{{goods.weChat}}</text>
			<text @tap='copy(goods.weChat)'><text class='iconfont icon-fuzhi'></text></text></view>
		</view>
		<!-- 详情 -->
		<view class="description" id='des'>
			<view class="title">———— 商品详情 ————</view>
			<view class="content">
				<rich-text :nodes="goods.detail"></rich-text>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="btn">
				<view class="joinCart" @tap='goShop'><view class='iconfont icon-dianpu'></view>进入店铺</view>
				<view class="buy" @tap='keep' :class='goods.isCollect?"keep":""'><text :class='goods.isCollect?"keep":""' class='icon shoucang'></text>{{goods.isCollect?"已收藏":"未收藏"}}</view>
			</view>
		</view>
		<ShowImg ref='showImg' :url='url'></ShowImg>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import ShowImg from '@/components/showImg/index.vue'
	export default {
		components:{ShowImg},
		data() {
			return {
				url:'',
				//控制渐变标题栏的参数
				beforeHeaderzIndex: 11, //层级
				afterHeaderzIndex: 10, //层级
				beforeHeaderOpacity: 1, //不透明度
				afterHeaderOpacity: 0, //不透明度
				//是否显示返回按钮
				// #ifndef MP
				showBack: true,
				// #endif
				//轮播主图数据
				swiperList: [],
				//轮播图下标
				currentSwiper: 0,
				// 商品信息
				goods: {},
				isKeep: false, //收藏
			};
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo || {}
			}
		},
		async onLoad(ops) {
			this.id = ops.id;
			// #ifdef MP
			//小程序隐藏返回按钮
			this.showBack = false;
			// #endif	
		},
		onShow(){
			//接收传值,id里面放的是标题，因为测试数据并没写id
			this.getProjectDetail();
		},
		onPageScroll(e) {
			//导航栏渐变
			let tmpY = 375;
			e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
			this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
			this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
			//切换层级
			this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
			this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
		},
		methods: {
			async getProjectDetail() {
				let res = await Api.apiCall('get', Api.goods.goodsDetail, {
					proId: this.id,
					userId:this.userInfo.id?this.userInfo.id:0
				})
				if (res.code == 200) {
					let data = res.data;
					this.swiperList = data.imgUrl.split(',');
					this.goods = {
						...this.goods,
						...data,
					}
				}
			},
			//拨打电话
			makecall(val){
				console.log('拨打手机号')
				 uni.makePhoneCall({
                  phoneNumber: val //仅为示例
                   });
			},
			//复制信息
			copy(val){
				uni.setClipboardData({
                data: val,
                 success: function () {
             
               }
               });
			},
			//进入店铺
			goShop() {
				uni.redirectTo({
					url: '/pages/shop/shop?companyId=' + this.goods.comId +'&goodsId='+this.id
				})
			},
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
			// 展示商品图
			showImg(url){
				this.$refs.showImg.show();
				this.url = url;
			},
			//收藏
			async keep() {
				if (!this.userInfo.id) {
					let url = '/pages/login/login';
					uni.redirectTo({
						url
					})
				} else {
					let params = {
						'productId': this.id,
						userId: this.userInfo.id,
						isCollect: !this.goods.isCollect ? 1 : 0
					};

					let res = await Api.apiCall('put', Api.collection.productCollection, params,true);
					if (res.code == 200) {
						this.goods.isCollect = !this.goods.isCollect;
						let str = this.goods.isCollect ? '收藏成功' : '取消收藏成功';
						uni.showToast({
							title: str,
							icon: 'none'
						})
					}
				}

			},
			//返回上一页
			back() {
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss">
	 
	page {
		background-color: #f8f8f8;
	}

	.icon {
		font-size: 26upx;
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
		background-color: #f1f1f1;
		transition: opacity 0.05s linear;
	}

	.header {
		width: 100%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.before,
		.after {
			width: 92%;
			padding: 0 4%;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */
			transition: opacity 0.05s linear;

			.back {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;

				.icon {
					margin-left: -10%;
					width: 60upx;
					height: 60upx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 42upx;
				}
			}

			.middle {
				width: 100%;
			}

			.icon-btn {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;
				display: flex;

				.icon {
					&:first-child {
						margin-right: 5upx;
					}

					width: 60upx;
					height: 60upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 42upx;
				}
			}
		}

		.before {
			.back {
				.icon {
					color: #fff;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;
				}
			}

			.icon-btn {
				.icon {
					color: #fff;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;

				}
			}
		}

		.after {
			background-color: #f1f1f1;

			.back {
				.icon {
					color: #666;
				}
			}

			.icon-btn {
				.icon {
					color: #666;
				}
			}

			.middle {
				font-size: 32upx;
				height: 90upx;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 7%;

				view {
					width: (100%/3);
					padding: 0 3%;
					margin: 0 3%;
					display: flex;
					justify-content: center;
					align-items: center;

					&.on {
						margin-bottom: -4upx;
						color: #f47952;
						border-bottom: solid 4upx #f47952;
					}
				}
			}
		}
	}

	.swiper-box {
		position: relative;
		width: 100%;
		height: 100vw;
		margin-bottom:100upx;
		swiper {
			width: 100%;
			height: 100vw;

			swiper-item {
				image {
					width: 100%;
					height: 100vw;
				}
			}
		}

		.indicator {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 25upx;
			height: 40upx;
			border-radius: 40upx;
			font-size: 22upx;
			position: absolute;
			bottom: 100upx;
			right: 20upx;
			color: #fff;
			.current_indi{
				font-size:32upx;
			}
		}
		.goods_title{
			height:160upx;
			position:absolute;
			bottom:-80upx;
			padding:26upx 4%;
			box-sizing:border-box;
			width:100vw;
			border-radius:20upx;
			background-color:#fff;
			.price {
				font-size: 40upx;
				font-weight: 600;
				color: $mainColor;
				margin-bottom:10upx;
			}
			
			.title {
				font-size: 30upx;
				color:$mainfotC;
				font-weight: 600;
				width:100%;
				overflow:hidden;
			}
		}
	}

	.info-box {
		width: 92%;
		padding: 20upx 4%;
		background-color: #fff;
		margin-bottom: 20upx;
	}

	.goods-info {
		border-radius:20upx;
		view {
			margin-bottom: 22upx;
			font-size: 28upx;
			display:flex;
			align-items: center;
			justify-content: space-between;
		}
		.go_shop{
			margin-left:20upx;
			width:150upx;
			background-color:#f0f0f0;
			height:40upx;
			padding:6upx 20upx 6upx 20upx;;
			border-radius:30upx;
			color:#444;
			font-size:24upx;
			top:14upx;
			position:relative;
			.iconfont{
				margin-right:14upx;
				color:#444;
				font-size:30upx;
			}
		}
		.no_b{
			margin-bottom:0;
			display:flex;
			flex:auto;
			width:0;
			align-items:center;
			font-weight: 600;
			font-size:32upx;
			color:$mainfotC;
			image{
				width:60upx;
				height:60upx;
				border-radius:8upx;
				margin-right:20upx;
			}
			text{
				flex:auto;
				width:0;
				overflow:hidden;
			    text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.item_title{
			font-weight: 600;
			font-size:32upx;
			color:$mainfotC;
			width:160upx;
			display:inline-block;
		}
	}

	.description {
		padding: 0 4%;
		background: #fff;
		font-size: 26upx;
		padding-bottom: 120upx;

		.title {
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #999;
		}
		.content{
			rich-text{
				text-indent: 28upx;
				font-size:28upx;
				line-height:46upx;
				color:#999;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 99upx;
		border-top: solid 1upx #eee;
		background-color: #fff;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			height: 99upx;
			overflow: hidden;
			width: 100%;
			display: flex;
			margin-right: -2%;

			.joinCart,
			.buy {
				height: 99upx;
				flex: 1;
				display: flex;
				align-items: center;
				font-size: 28upx;
				justify-content: center;
			}

			.joinCart {
				.iconfont {
					font-size: 40upx;
					margin-right: 18upx;
				}
				position:relative;
			}
			.joinCart:after{
				position:absolute;
				content: '';
				height:60upx;
				width:1upx;
				background-color:#eee;
				right:0;
				top:20upx;
			}
			.buy {
			

				.icon {
					font-size: 40upx;
					margin-right: 18upx;
				}

				.keep {
					color: $mainColor;
				}
			}

			.keep {
				color: $mainColor;
			}
		}
	}

	.company_name {
		display: flex;
		justify-content: space-between;
	}
</style>
