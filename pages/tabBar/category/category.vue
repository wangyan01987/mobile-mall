<template>
	<view>
		<!-- 状态栏 -->
		<view class="status" :style="{position:headerPosition}"></view>
        <view class="header" :style="{position:headerPosition}">
			<!-- <view class="addr"><view class="icon location"></view>{{city}}</view> -->
			<view class="input-box">
				<input placeholder="在海量设备中搜索" disabled='true' placeholder-style="color:#c0c0c0;" @tap="toSearch"/>
				<view class="icon search"></view>
			</view>
			<view class="icon-btn">
				<view class="iconfont icon-552cc49adb5ab" :class='reloadC?"reloadBtn":""' @tap='reloadPage'></view>
			</view>
		</view>
		<view class="category-list">
			<!-- 左侧分类导航 -->
			<scroll-view  scroll-y="true" class="left" >
                <view class="row" v-for="(category,index) in categoryList" :key="category.id" :class="[index==showCategoryIndex?'on':'']" @tap="showCategory(index,category)">
					<view class="text">
						<view class="block"></view>
						{{category.name}}
					</view>
				</view>
				
            </scroll-view>
			<!-- 右侧子导航 -->
			<scroll-view  scroll-y="true" class="right" >
			    <!-- <view class="category" v-for="(category,index) in categoryList" :key="category.id" v-show="index==showCategoryIndex" > -->
				<view class="category">
					<!-- <header>
						<div class="tab">
							<text class="category-title">{{ categoryName }}</text>
						</div>
					</header> -->
					<view class="list">
						<view class="box" v-for="(box,i) in childList" :key="i" @tap="toCategory(box)">
							<image :src="box.iconUrl"></image>
							<view class="text">{{box.name}}</view>
						</view>
						<view class='no_data' v-if='childList.length==0'>
							<no-data type='2' text='暂无分类信息'></no-data>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	import Api from '@/common/api.js';
	import NoData from '@/components/noData/index.vue'
	export default {
		components:{NoData},
		data() {
			return {
				showCategoryIndex:0,
				headerPosition:"fixed",
				//分类列表
				categoryList:[],
				categoryName:'',
				childList:[],
				reloadC:false
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.init();
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			async init(){
				let res = await Api.apiCall('get',Api.category.parentList,{})
				if(res.code==200){
					this.showCategoryIndex = 0;
					this.categoryList = res.data;
					let pid = res.data[0].id;
					this.pid = pid;
					this.categoryName = res.data[0].name;
					//处理完下拉刷新事件后执行
					uni.stopPullDownRefresh();
					this.getList(pid)
				}
			},
			reloadPage(){
				this.init();
				this.reloadC = true;
				setTimeout(()=>{
					this.reloadC = false;
				},2000)
			},
			async getList(pid){
				let childRes = await Api.apiCall('get',Api.category.childList,{pid},true);
				if(childRes.code==200){
					this.childList = childRes.data;
				}
			},
			//消息列表
			toMsg(){
				uni.navigateTo({
					url:'../../msg/msg'
				})
			},
			//分类切换显示
			async showCategory(index,item){
				let pid = item.id;
				this.pid = pid;
				this.categoryName = item.name;
				this.getList(pid);
				this.showCategoryIndex = index;
			},
			toCategory(e){
				uni.navigateTo({
					url: '../../goods/goods-list/goods-list?typeId='+e.id+'&typeName='+e.name
				});
			},
			//搜索跳转
			toSearch(){
				uni.navigateTo({
					url:'/pages/tabBar/category/searchPage/searchPage'
				})
			}
		}
	}
</script>
<style lang="scss">

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);//覆盖样式
		/*  #endif  */
		
	}

	.header{
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		border-bottom:solid 1px #e4e6f2;
		z-index: 10;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		
		.addr{
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28upx;
			.icon{
				height: 60upx; 
				margin-right: 5upx;
				display: flex;
				align-items: center;
				font-size: 42upx;
				color: $mainColor;
			}
		}
		.input-box{
			width: 100%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;
			.icon{
				display: flex;
				align-items: center;
				position: absolute;
				top:0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}
			input{
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}
		.icon-btn{
			width: 60upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			.iconfont{
				width: 60upx;
				height: 60upx;
				color:#c0c0c0;
				text-align:center;
				align-items: center;
				font-size: 42upx;
				line-height:60upx;
			}
			.reloadBtn{
				transform: rotate(720deg);
				transition:all 2s;
			}
			
		}
	}
	.place{
		
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.category-list{
		width: 100%;
		background-color: #fff;
		display: flex;
		.left,.right{
			position: absolute;
			
			top: 100upx;
			/*  #ifdef  APP-PLUS  */
			top: calc(100upx + var(--status-bar-height));
			/*  #endif  */
			bottom: 0upx;
		}
		.left{
			width: 24%;
			left: 0upx;
			background-color: #f2f2f2;
			.row:after{
				position:absolute;
				content:'';
				width:100upx;
				height:2upx;
				background:#e8e8e8;
				bottom:0;
				left:50%;
				margin-left:-50upx;
			}
			.on:after{
				height:0;
			}
			.row{
				width: 100%;
				height: 100upx;
				display: flex;
				align-items: center;
				position:relative;
				.text{
					width: 100%;
					position: relative;
					font-size: 28upx;
					display: flex;
					justify-content: center;
					color: #3c3c3c;
					height: 100upx;
					align-items:center;
					.block{
						position: absolute;
						width: 0upx;
						left: 0;
						top:0;
						height:0;
					}
				}
				&.on{
					height: 100upx;
					background-color: #fff;
					.text{
						font-size: 30upx;
						font-weight: 600;
						color: #2d2d2d;
						.block{
							width: 10upx;
							height: 100upx;
							background-color: $mainColor;
						}
					}
				}
			}
		}
		.right{
		   width: 76%;
			left: 24%;
			.category{
				width: 94%;
				padding: 20upx 3%;
				.category-title{
					font-size:26upx;
					padding-left:40upx;
				}
				.banner{
					width: 100%;
					height: 24.262vw;
					border-radius: 10upx;
					overflow: hidden;
					box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.3);
					image{
						width: 100%;
						height: 24.262vw;
					}
				}
				.list{
					margin-top: 20upx;
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					
					.box{
						width: calc(71.44vw / 3.1);
						margin-bottom: 30upx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						image{
							width: 60%;
							height: calc(71.44vw / 3 * 0.6);
						}
						.text{
							margin-top: 5upx;
							width: 100%;
							display: flex;
							justify-content: center;
							font-size: 26upx;
						}
					}
				}
			}
		}
	}
	.no_data{
		width:100%;
	}
</style>
