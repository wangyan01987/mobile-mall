<template>
	<view>
		<!-- 状态栏 -->
		<!-- <view v-if="showHeader" class="status" :style="{ position: headerPosition,top:statusTop,opacity: afterHeaderOpacity}"></view> -->
		<!-- 顶部导航栏 -->
		<view v-if="showHeader" class="header" :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
			<!-- 定位城市 -->
			<view class="addr" @tap="toCity">
				<view class="icon location"></view>
				{{ city }}
			</view>
			<!-- 搜索框 -->
			<view class="input-box">
				<input @tap="toSearch" placeholder="请输入搜索内容" placeholder-class="plaStyle" />
				<view class="icon search"></view>
			</view>
			<!-- 右侧图标按钮 -->
			<view class="icon-btn">
				<view class="min-badge">
					<view class="icon tongzhi" @tap="toMsg"></view>
					<view class="min-badge-count"><text>{{msgNum}}</text></view>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		<view class="swiper_box">
			<swiper :indicator-dots='true' circular='true' :autoplay='true' indicator-color='#ffffff' indicator-active-color='#00ff00'>
				<swiper-item v-for='(item,i) in swiperList' :key='i'>
					<image :src='item.poster_ImgUrl'></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 分类 -->
		<view class="classify_box">
			<view class="classify_sub">
				<view class="classify_item" v-for='(item,index) in classify' :key='index' @tap='toCategory(item)'>
					<view class="cla_img">
						<image v-if='item.iconUrl' :src='item.iconUrl'></image>
						<text v-else>...</text>
					</view>
					<view class='cla_name'>{{item.typeName}}</view>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="title">
				每日上新
			</view>
			<goods-list :goodsList="goodsList"></goods-list>
		</view>
	</view>
</template>

<script>
	var ttt = 0;
	//高德SDK
	// #ifndef APP-PLUS
	import amap from '@/common/SDK/amap-wx.js';
	//#endif
	import Api from '@/common/api';
	import GoodsList from '@/components/goodsList/index.vue';
	import provinceData from '@/components/mpvue-citypicker/city-data/province.js';
	import cityData from '@/components/mpvue-citypicker/city-data/city.js';
	import {
		mapState
	} from 'vuex';
	import {
		isLogin
	} from '@/common/untils.js';
	export default {
		components: {
			GoodsList
		},
		data() {
			return {
				swiperList: [{
					poster_ImgUrl: '/static/img/swiper.jpg'
				}],
				showHeader: true,
				afterHeaderOpacity: 1, //不透明度
				headerPosition: 'fixed',
				headerTop: null,
				statusTop: null,
				nVueTitle: null,
				city: '北京',
				currentSwiper: 0,
				pageNum: 1,
				//猜你喜欢列表
				goodsList: [],
				loadingText: '正在加载...',
				classify: [{
					iconUrl: "http://equipmentleasing.oss-cn-beijing.aliyuncs.com/20190910/bcf97222e6d2326978b096943bc0563e.png",
					id: 1,
					typeName: "挖掘机械"
				}, {
					iconUrl: "http://equipmentleasing.oss-cn-beijing.aliyuncs.com/20190910/b70c02408e49abf8425a1a0f180f07f4.png",
					id: 2,
					typeName: "起重机械"
				}, {
					iconUrl: "http://equipmentleasing.oss-cn-beijing.aliyuncs.com/20190910/415475dedc90b699e9266efce4be4ce3.png",
					id: 3,
					typeName: "路面机械"
				}, {
					iconUrl: "http://equipmentleasing.oss-cn-beijing.aliyuncs.com/20190910/5759979f38831a2aa46972402c9b30f2.png",
					id: 4,
					typeName: "混凝土机械"
				}, {
					iconUrl: "http://equipmentleasing.oss-cn-beijing.aliyuncs.com/20190910/4dc0f553d7cc7f6f47639914c966d2bb.png",
					id: 5,
					typeName: "铲运机械"
				}, {
					iconUrl: "http://equipmentleasing.oss-cn-beijing.aliyuncs.com/20190910/bfe9fe8df6b84dfceec59f37dba53339.png",
					id: 6,
					typeName: "工业车辆"
				}, {
					iconUrl: "http://equipmentleasing.oss-cn-beijing.aliyuncs.com/20190910/d1f5339a56da0b897e010e05cad3120a.png",
					id: 7,
					typeName: "桩工机械"
				}, {
					typeName: '查看更多',
					id: 8,
					iconUrl: '/static/img/more.png'
				}],
				msgNum: '',
				cityCode: ''
			};
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.getHomeMsg();
		},
		computed: {
			...mapState(['isLogin', 'userInfo', 'area'])
		},
		watch: {
			cityCode(va1) {
				if (this.cityCode != '') {
					this.getHomeMsg()
				}
			}
		},
		onShow(opt) {
			//隐藏键盘
			uni.hideKeyboard()
			this.loadData();
			uni.$emit('getMsg', this.userInfo);
			this.init();
		},
		methods: {
			setCity(obj, p) {
				this.city = obj.label.replace(/市/g, '');
				if (p == 1) {
					this.cityCode = obj.value + '0000';
				} else {
					this.cityCode = obj.value;
				}
				this.nVueTitle.postMessage({
					type: 'location',
					city: this.city
				});
			},
			async loadData() {
				if (this.isLogin) {
					//获取消息数量
					let msgNum = await Api.apiCall('get', Api.message.feedBackNum, {
						UserId: this.userInfo.id
					}, 1);
					if (msgNum.code == 200) {
						this.msgNum = msgNum.data;
					}
				} else {
					this.msgNum = '';
				}
			},
			async getHomeMsg() {
				let res = await Api.apiCall('get', Api.index.home, {
					cityCode: this.cityCode
				});
				if (res.code == 200) {
					//处理完下拉刷新事件后执行
					uni.stopPullDownRefresh();
					let data = res.data;
					this.swiperList = data.equPosterResults;
					this.classify = [
						...data.productTypeResults,
						...[{
							typeName: '查看更多',
							id: 8,
							iconUrl: '/static/img/more.png'
						}]
					];
					this.goodsList = data.produtResults;
				}
			},
			//消息列表
			toMsg() {
				if (this.isLogin) {
					uni.navigateTo({
						url: '../../msg/msg'
					})
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},
			//搜索跳转
			toSearch() {
				uni.navigateTo({
					url: '/pages/tabBar/category/searchPage/searchPage'
				})
			},
			//分类跳转
			toCategory(item) {
				if (item.id != '8') {
					// 缺少分类id
					uni.navigateTo({
						// url: `../../goods/goods-list/goods-list?pTypeId=${item.id}&name=${item.typeName}`
						url: `../../goods/goods-list/goods-list?pTypeId=${item.id}&typeName=${item.typeName}`
					});
				} else {
					uni.switchTab({
						url: `/pages/tabBar/category/category`
					});
				}
			},
			//选择城市
			toCity() {
				uni.navigateTo({
					url: '/pages/tabBar/home/chooseCity/chooseCity'
				})
			},
			//商品跳转
			toGoods(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/goods/goods?id=${id}`
				})
			},
			getLocationByA() {
				// #ifndef APP-PLUS
				this.amapPlugin = new amap.AMapWX({
					//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
					key: 'ca412ec7fc0918c037a640d331a3e3e7'
				});
				//定位地址
				this.amapPlugin.getRegeo({
					success: data => {
						let oData = data[0].regeocodeData.addressComponent;
						if (oData.city.length == 0) {
							this.city = oData.province.replace(/市/g, ' ')
						} else {
							this.city = oData.city.replace(/市/g, '');
						}

						this.cityCode = oData.adcode;
					},
					//用户不授权定位的话进fail 默认北京
					fail: data => {
						this.city = '北京';
						this.cityCode = 110000;
						// #ifdef APP-PLUS
						this.nVueTitle.postMessage({
							type: 'location',
							city: '北京'
						});
						// #endif
					}
				});
				//#endif
			},
			async init() {
				if (this.area.name && this.area.code) {
					this.city = this.area.name;
					this.cityCode = this.area.code;
					// #ifdef APP-PLUS
					this.nVueTitle.postMessage({
						type: 'location',
						city: this.city
					});
					// #endif
					return;
				}
				// #ifdef APP-PLUS
				this.nVueTitle = uni.getSubNVueById('homeTitleNvue');
				this.nVueTitle.onMessage(res => {
					let type = res.data.type;
					if (type == 'focus') {
						this.toSearch();
					}
				});
				this.showHeader = false;
				this.statusHeight = plus.navigator.getStatusbarHeight();
				let _this = this;
				plus.geolocation.getCurrentPosition((p) => {
					let pV = provinceData.filter(item => item.label == p.address.city);
					if (pV.length > 0) {
						_this.setCity(pV[0], 1)
					} else {
						let cV = cityData.filter(item => item.label == p.address.city);
						if (cV.length > 0) {
							_this.setCity(cV[0])
						}else{
							_this.setCity({
								label: '北京市',
								value: '11'
							}, 1)
						}
					}
				}, (e) => {
					_this.setCity({
						label: '北京市',
						value: '11'
					}, 1)
				})
				// #endif
				this.getLocationByA();
			},
		},
		onBackPress(e) {
			// 这里可以自定义返回逻辑，比如关闭app ios好像此api不起作用 待测试
			// #ifdef APP-PLUS  
			this.$showModal('确定要退出应用?', () => {
				plus.runtime.quit();
			})
			// #endif  
			// return true 表示禁止默认返回
			return true
		},
	};
</script>
<style lang="scss">
	@import "@/static/css/goodsList.scss";

	page {
		position: relative;
		background-color: #f6f6f6;
	}

	.pullDown-effects {
		position: fixed;
		//top: calc(100upx - 36vw);
		top: 0;
		z-index: 9;
		width: 100%;
		height: 36vw;
		/*  #ifdef  APP-PLUS  */
		padding-top: var(--status-bar-height);

		/*  #endif  */
		image {
			width: 100%;
			height: 36vw;
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #ff2c29;

		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */

		.addr {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28upx;
			color: #FFFFFF;

			.icon {
				height: 60upx;
				margin-right: 5upx;
				display: flex;
				align-items: center;
				font-size: 42upx;
				color: #FFFFFF;
			}
		}

		.input-box {
			width: 100%;
			height: 60upx;
			background-color: rgba(255, 255, 255, 0.2);
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
				color: #FFFFFF;
			}

			input {
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}

		.icon-btn {
			width: 60upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.icon {
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
				color: #FFFFFF;
			}
		}
	}

	.place {
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.swiper_box {

		width: 100%;
		padding-top: 10upx;
		display: flex;
		justify-content: center;
		background: linear-gradient(to bottom, $mainColor 0%, $mainColor 70%, #f6f6f6 71%);

		swiper {
			width: 92%;
			height: 30.7vw;

			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper-item {
				image {
					width: 100%;
					height: 30.7vw;
				}
			}
		}

		.indicator {
			position: absolute;
			bottom: 20upx;
			left: 20upx;
			background-color: rgba(255, 255, 255, 0.4);
			width: 150upx;
			height: 5upx;
			border-radius: 3upx;
			overflow: hidden;
			display: flex;

			.dots {
				width: 0upx;
				background-color: rgba(255, 255, 255, 1);
				transition: all 0.3s ease-out;

				&.on {
					width: (100%/3);
				}
			}
		}
	}


	.classify_box {
		margin: 0 4%;
		margin-top: 20upx;
		padding-top: 20upx;
		background: #fff;
		border-radius: 10upx;

		.classify_sub {
			margin-bottom: 30upx;
			display: flex;
			flex-wrap: wrap;

			.classify_item {
				width: calc(92vw / 4);
				margin-bottom: 20upx;

				.cla_img {
					width: 120upx;
					height: 120upx;
					margin: 0 auto;
					box-sizing: border-box;
					border-radius: 50%;
					text-align: center;
					color: #A7A7A7;
					font-size: 40upx;
					line-height: 80upx;

					image {
						width: 120upx;
						height: 120upx;
						border-radius: 50%;
					}
				}

				.cla_name {
					text-align: center;
					margin-top: 15upx;
					font-size: 26upx;
					color: $mainfotC;
				}
			}
		}
	}

	.min-badge {
		position: relative;
		display: inline-block;
		line-height: 1;
		vertical-align: middle;
	}

	.min-badge-count {
		position: absolute;
		transform: translateX(50%);
		top: -2upx;
		right: 0;
		height: 30upx;
		border-radius: 15upx;
		min-width: 30upx;
		color: #FFFFFF;
		line-height: 30upx;
		text-align: center;
		padding: 0 10upx;
		font-size: 20upx;
		white-space: nowrap;
		font-weight: 600;
		z-index: 10;
		box-sizing: border-box;
	}


	.goods-list {
		margin-bottom: 40upx;
		/*  #ifdef  APP-PLUS  */
		margin-bottom: 140upx; //覆盖样式
		/*  #endif  */
	}

	.plaStyle {
		color: rgba(255, 255, 255, 0.3)
	}
</style>
