<template>
	<view>
		<view class="logo">
			<view class="img">
				<image mode="widthFix" src='/static/img/face.svg' />
			</view>
		</view>
		<!-- 账号密码输入框 -->
		<view class="form form re">
			<view v-if='loginType'>
				<view class="username">
					<input type='number' placeholder="请输入手机号" v-model="phone" placeholder-class='placeholder_class' />
				</view>
				<view class="password no_line">
					<password-input v-model='password'></password-input>
				</view>
			</view>
			<view v-else>
				<view class="username">
					<view class="get-code" :style="{'color':getCodeBtnColor}" @click.stop="getCode()">{{getCodeText}}</view>
					<input type='number' placeholder="请输入手机号" v-model="phoneNumber" placeholder-class='placeholder_class' />
				</view>
				<view class="code no_line">
					<input type='number' placeholder="请输入验证码" v-model="code" placeholder-class='placeholder_class' />
				</view>
			</view>
			<view class="inner_box">
				<view class='go_pwd' ><text @tap="toPage('resetpasswd?type=forget')">忘记密码</text></view>
				<view class="btn" @tap="doLogin" :style="{backgroundColor:btnColor}">登 录</view>
				<view class="res">
					<view @tap='loginType=!loginType'>{{loginType?'手机快捷登录':'账号登录'}}</view>
					<view @tap="toPage('register')">新用户注册</view>
				</view>
			</view>
		</view>
		<!-- 第三方登录 -->
		<!-- <view class="oauth" v-if="isShowOauth">
			<view class="text">— 快速登录 —</view>
			<view class="list">
				<view @tap="oauthLogin('weixin')" v-if="showProvider.weixin" class="icon weixin"></view>
				<view @tap="oauthLogin('qq')" v-if="showProvider.qq" class="icon qq"></view>
				<view @tap="oauthLogin('sinaweibo')" v-if="showProvider.sinaweibo" class="icon sinaweibo"></view>
				<view @tap="oauthLogin('xiaomi')" v-if="showProvider.xiaomi" class="icon xiaomi"></view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import Api from '@/common/api';
	import store from '@/store/index';
	import PasswordInput from '@/components/passwordInp/index.vue'
	export default {
		data() {
			return {
				loginType: true,
				phone: '',
				password: '',
				phoneNumber: "",
				code: '',
				getCodeText: '获取验证码',
				getCodeBtnColor: "#c3c8dc",
				getCodeisWaiting: false,
				isShowOauth: false,
				showProvider: {
					weixin: false,
					qq: false,
					sinaweibo: false,
					xiaomi: false
				}
			}
		},
		components:{PasswordInput},
		watch:{
			loginType(val){
				this.phone = '';
				this.password = '';
				this.phoneNumber = '';
				this.code = '';
			}
		},
		computed: {
			...mapState(['isLogin', 'userInfo', 'appCode']),
			btnColor(){
				return this.phone==''&&this.password==''&&this.phoneNumber==''&&this.code==''?'#c3c8dc':'#ff2c29'
			}
		},
		onLoad() {
			//APP显示第三方登录
			// #ifdef APP-PLUS
			// this.isShowOauth = false;
			// #endif
			// this.getProvider();

		},
		methods: {
			pwdChange(value){
				this.password = value;
			},
			toPage(page) {
				uni.hideKeyboard()
				uni.navigateTo({
					url: page
				});
			},
			async doLogin() {
				uni.hideKeyboard();
				let phoneReg = /^1[1-9][0-9]\d{8}$/;
				let params = {};
				if (this.loginType) {
					//验证手机号码
					if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone))) {
						uni.showToast({
							title: '请填写正确手机号码',
							icon: "none"
						});
						return false;
					}

					try {
						if (this.phone == '') {
							throw '请填写手机号';
						}
						if (!phoneReg.test(this.phone)) {
							throw '手机号格式有误';
						}
						if (this.password == '') {
							throw '请填写密码';
						}
					} catch (err) {
						uni.showToast({
							title: err,
							icon: "none"
						});
						return;
					}
					params = {
						'userAccount': this.phone,
						'userCode': this.password,
						loginType: '1',
						appCode: this.appCode,
						showFalse:true
					};
				} else {
					//验证手机号码
					if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))) {
						uni.showToast({
							title: '请填写正确手机号码',
							icon: "none"
						});
						return false;
					}

					try {
						if (this.phoneNumber == '') {
							throw '请填写手机号';
						}
						if (!phoneReg.test(this.phoneNumber)) {
							throw '手机号格式有误';
						}
						if (this.code == '') {
							throw '请填写验证码';
						}
					} catch (err) {
						uni.showToast({
							title: err,
							icon: "none"
						});
						return;
					}
					params = {
						'userAccount': this.phoneNumber,
						'userCode': this.code,
						loginType: '4',
						appCode: this.appCode
					};
				}

				this.logining = true;
				let data = await Api.apiCall('post', Api.index.login, params);
				this.logining = false;
				if (data.code==200) {
					// uni.setStorageSync('userToken', data.tokenHead + data.token);
					uni.setStorageSync('userInfo', data.data);
					this.$store.commit('setUserInfo',data.data)
					uni.navigateBack()
				}else{
					if(this.loginType){
						uni.showToast({
							title: '手机号或密码不正确',
							icon: 'none'
						});
					}
				}
			},
			async getCode() {
				uni.hideKeyboard()
				if (this.getCodeisWaiting) {
					return;
				}
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))) {
					uni.showToast({
						title: '请填写正确手机号码',
						icon: "none"
					});
					return false;
				}
				// 获取验证码
				let params = {
					phone: this.phoneNumber,
					type: '1'
				}
				let data = await Api.apiCall('post', Api.index.sendCodes, params);
				if (data.code == 200) {
					this.getCodeText = "发送中..."
					this.getCodeisWaiting = true;
					this.getCodeBtnColor = "#484848"
					uni.showToast({
						title: data.msg,
						icon: "none"
					});
					//示例用定时器模拟请求效果
					setTimeout(() => {
						//示例默认1234，生产中请删除这一句。
						this.setTimer();
					}, 1000)
				}
			},
			setTimer() {
				let holdTime = 60;
				this.getCodeText = "重新获取(60)"
				this.Timer = setInterval(() => {
					if (holdTime <= 0) {
						this.getCodeisWaiting = false;
						this.getCodeBtnColor = "#c3c8dc";
						this.getCodeText = "获取验证码"
						clearInterval(this.Timer);
						return;
					}
					this.getCodeText = "重新获取(" + holdTime + ")"
					holdTime--;

				}, 1000)
			},
		},
		onBackPress(){
			//隐藏键盘
			uni.hideKeyboard()
		}
	}
</script>

<style lang="scss">
	@import "../../static/css/login.scss";

	.form {
		.res {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100upx;
			color: #2c84fb;
		}
	}

	.oauth {
		@media all and (max-height: 150vw) {
			display: none;
		}

		position: absolute;
		bottom: 50upx;
		width: 100%;

		.text {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: rgba($color: #ffffff, $alpha: 0.8);
			font-size: 28upx;
		}

		.list {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20upx 0;

			.icon {
				font-size: 80upx;
				margin: 0 30upx;
			}
		}
	}
</style>
