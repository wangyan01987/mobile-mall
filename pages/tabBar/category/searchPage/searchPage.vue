<template>
	<view>
		<!-- 状态栏 -->
		<view class="status" :style="{position:headerPosition}"></view>
		<view class="header" :style="{position:headerPosition}">
			<view class="input-box">
				<input placeholder="在海量设备中搜索" v-model='search' @input='searchInput' confirm-type='search' placeholder-style="color:#c0c0c0;"
				 @focus="searchFocus" @confirm='searchConfirm' />
				<view class="icon search"></view>
			</view>
			<view class="icon-btn">
				<view class="cancel_btn" @tap='cancel'>取消</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<view class='search_box' v-if='showLast'>
			<view class="search_title">
				<text>最近搜索</text>
				<view class='icon shanchu' @tap='clearLastSearch'></view>
			</view>
			<view class='last_box'>
				<button class='last_item' size='mini' v-for='(item,i) in lastSearch' :key='i' @tap='goSearch(item)'>{{item}}</button>
			</view>
		</view>
		<view v-else class='search_item list'>
			<view class="row" v-for='(item,i) in nameList' :key='i' @tap='goSearch(item)'>
				<view class="title">{{item}}</view>
				<view class="right">
					<view class="icon xiangyou"></view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import Api from '@/common/api.js'
	export default {
		data() {
			return {
				headerPosition: "fixed",
				lastSearch: ['平地机', '推土机', '高空升降平台', '激光器', '发电机', '碎石机'],
				showLast: true,
				search: '',
				nameList:[]
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		onLoad(opt) {
			this.companyId = opt.companyId || '';
			console.log(this.companyId)
		},
		onShow() {
			this.lastSearch = uni.getStorageSync('lastSearch') || [];
			this.showLast = true;
			this.search = '';
			this.nameList = [];
		},
		methods: {
			clearLastSearch() {
				this.$showModal('确定删除最近搜索',()=>{
					this.lastSearch = [];
					uni.clearStorageSync('lastSearch')
				})
			},
			searchFocus() {
				this.showLast = false;
			},
			// 做模糊查询分类列表
			async searchInput(e) {
				let name = e.detail.value;
				let res = await Api.apiCall('get',Api.goods.findName,{name},true);
				if(res.code==200){
					this.nameList = res.data;
				}
			},
			// 完成按钮
			searchConfirm(e,type) {
				let val = e;
				if(e.detail){
					val = e.detail.value;
				}
				let searchList = JSON.parse(JSON.stringify(this.lastSearch))
				if(type!=1){
					if (val == '') {
						uni.showToast({
							title: '搜索内容不能为空',
							icon: 'none'
						})
						return
					}
				}
				if(!searchList.includes(val)&&val!=''){
					
					if (this.lastSearch.length < 20) {
						searchList.push(val)
					}else{
						searchList.push(val)
						searchList.shift()
					}
				}
				uni.setStorage({
					key: 'lastSearch',
					data: searchList,
					success: () => {
						if(e.detail){
							this.goSearch(val)
						}
					}
				})
			},
			cancel() {
				this.showLast = true;
				this.search = '';
			},
			goSearch(item) {
				this.searchConfirm(this.search,1) 
				if(this.companyId){
					uni.redirectTo({
						url: `/pages/shop/shop?name=${item}&companyId=${this.companyId}`
					})
				}else{
					uni.redirectTo({
						url: `/pages/goods/goods-list/goods-list?name=${item}`
					})
				}
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
		// height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
		display: none;

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
		background-color: #fff;
		border-bottom:solid 1px #e6e6e6;
		/*  #ifdef  APP-PLUS  */
		// top: var(--status-bar-height);
		/*  #endif  */

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
			}

			input {
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
				flex:auto;
				width:0;
			}
		}

		.icon-btn {
			width: 60upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.cancel_btn {
				width: 100upx;
				height: 60upx;
				font-size: 28upx;
				text-align: right;
				color: $mainfotC;
				line-height: 60upx;
			}
		}
	}

	.place {

		background-color: #ffffff;
		height: 120upx;
		/*  #ifdef  APP-PLUS  */
		// margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.search_box {
		width: 100%;
		box-sizing: border-box;
		padding: 0 4%;
		font-size: 30upx;

		.search_title {
			margin: 10upx 0 20upx 0;
			display: flex;
			justify-content: space-between;

			.icon {
				font-size: 32upx;
				color: #a0a0a0;
			}
		}

		.last_item {
			background-color: #eee;
			border-radius: 26upx;
			font-size: 26upx;
			margin-bottom: 20upx;
			margin-right: 30upx;
		}

		.last_item:after {
			width: 0;
			height: 0;
		}
	}

	.list {
		width: 96%;
		padding-left: 4%;
		background-color: #fff;
		margin-bottom: 20upx;
		font-size: 28upx;

		.row {
			widows: 100%;
			min-height: 90upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: solid 1upx #eee;

			.right {
				display: flex;
				align-items: center;
				color: #999;
				margin-right: 10upx;

				.icon {
					width: 40upx;
					color: #cecece;
					font-size: 30upx;
				}
			}

		}
	}
</style>
