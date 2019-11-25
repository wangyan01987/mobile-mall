<template>
	<view>
		<view class="chat-list">
			<view class='cancel_top' v-if='showCheck'>
				<text @tap='chooseAll'>{{chosed?"全选":'全部取消'}}</text>
				<view class='icon shanchu' @tap='cancel'></view>
			</view>
			<view class="place" v-if='showCheck'></view>
			<checkbox-group @change="checkboxChange" v-if='chatList.length!=0'>
				<view class="chat" v-for="(chat,index) in chatList" :key="index">
					<view class="row" @tap="toChat(chat)" @longpress="showCancel">
						<view class='check_box' @tap.stop v-if='showCheck&&chat.is_Read==1'>
							<checkbox :value="chat.id" :checked='chat.checked' />
						</view>
						<view class="right">
							<view class="top">
								<view class="usernam">{{chat.message_Title}}</view>
								<view class="time">{{chat.replyTime}}</view>
							</view>
							<view class="bottom">
								<view class="msg">{{chat.message_Content}}</view>
								<view class='read'>
									<text v-if='chat.is_Read==0' class='read_n'>未读</text>
									<text v-else class='read_o'>已读</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</checkbox-group>
			<view class='no_data' v-else>
				<no-data type='4' text='暂无消息'></no-data>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api.js';
	import {
		dateFormat
	} from '@/common/untils.js';
	import NoData from '@/components/noData/index.vue'
	export default {
		components:{NoData},
		data() {
			return {
				chosed: true,
				showCheck: false,
				cancelList: [],
				chatList: []
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.getMsgList();
		},
		onLoad() {
			this.chatList.map(item => {
				item.checked = false;
			})
		},
		onShow() {
			this.getMsgList();
		},
		watch: {
			chosed(val) {
				let arr = [];
				this.chatList.map((item, i) => {
					if (item.is_Read) {
						item.checked = !val;
						if (!val) {
							arr.push(item.id)
						}
					}
				})
				this.cancelList = arr;
				this.chatList = JSON.parse(JSON.stringify(this.chatList))
			}
		},
		methods: {
			async getMsgList() {
				let res = await Api.apiCall('get', Api.message.messageList, {
					UserId: this.userInfo.id
				})
				if (res.code == 200) {
					if(res.data){
						res.data.map(item => {
							item.replyTime = dateFormat(item.replyTime, '.')
						})
					}					
					this.chatList = res.data || [];
					//处理完下拉刷新事件后执行
					uni.stopPullDownRefresh();
				}
			},
			toChat(chat) {
				uni.navigateTo({
					url: `/pages/msg/msgDetail?id=${chat.id}`
				})
			},
			showCancel() {
				this.showCheck = !this.showCheck;
				if (!this.showCheck) {
					this.chosed = true;
					this.cancelList = [];
					this.chatList.map((item, i) => {
						item.checked = false;
					})
					this.chatList = JSON.parse(JSON.stringify(this.chatList))
				}
			},
			checkboxChange(e) {
				this.cancelList = e.detail.value;
			},
			chooseAll() {
				this.chosed = !this.chosed;
			},
			async delete() {
				let res = await Api.apiCall('post', Api.message.messageDelete, {
					ids: this.cancelList.join(','),
					userId: this.userInfo.id
				});
				if (res.code == 200) {
					this.getMsgList()
					this.showCancel();
				}
			},
			cancel() {
				if (this.cancelList.length == 0) {
					uni.showToast({
						title: '请至少选中一条消息',
						icon: 'none'
					})
					return;
				}
				this.$showModal('确定删除所有选中的消息',()=>{
					//删除选中的
					this.delete();
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(0, 0, 0, 0);
	}

	.chat-list {
		width: 94%;
		padding: 0 3%;

		.place {
			height: 80upx;
		}

		.cancel_top {
			width: 100%;
			height: 80upx;
			line-height: 80upx;
			box-sizing: border-box;
			padding: 0 4%;
			display: flex;
			justify-content: space-between;
			border-bottom: solid 1upx #eaeaea;
			font-size: 28upx;
			position: fixed;
			top: 0;
			left: 0;
			background: #fff;
			z-index: 99;

			.icon {
				font-size: 28upx;
				color: #333;
			}
		}

		.chat {
			width: 100%;
			height: 80upx;
			padding: 20upx 0;
			border-bottom: solid 1upx #eaeaea;

			.row {
				display: flex;
				justify-content: flex-start;

				.check_box {
					width: 80upx;
					height: 100upx;
					display: flex;
					align-items: center;

					checkbox {
						transform: scale(0.6)
					}
				}

				.left {
					flex-shrink: 0;
					width: 100upx;
					height: 100upx;

					image {
						width: 80upx;
						height: 80upx;
						border-radius: 50%;
					}
				}

				.right {
					flex-shrink: 1;
					width: 98%;
					padding-left: 2%;

					.top {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;

						.usernam {
							font-size: 26upx;
							flex: auto;
							width: 0;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						.time {
							font-size: 22upx;
							color: #bebebe;
							// width:216upx;
						}
					}

					.bottom {
						width: 100%;
						height: 40upx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.msg {
							font-size: 25upx;
							color: #777;
							overflow: hidden;
							flex: auto;
							width: 0;
							padding-right: 60upx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						.read_n {
							font-size: 24upx;
							color: #eb4d3d
						}

						.read_o {
							font-size: 24upx;
							color: #1AAD19;
						}
					}
				}
			}
		}
	}

	.no_data {
		width:100%;
	}
</style>
