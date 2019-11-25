<template>
	<view>
		<view class="logo">
			<view class="img">
				<image mode="widthFix" src='/static/img/face.svg' />
			</view>
		</view>
		<view class="form re">
			<view class="username">
				<view class="get-code" :style="{'color':getCodeBtnColor}" @click.stop="getCode()">{{getCodeText}}</view>
				<input type='number' placeholder="请输入手机号" v-model="phoneNumber" placeholder-class='placeholder_class' />
			</view>
			<view class="code">
				<input type='number' placeholder="请输入验证码" v-model="code" placeholder-class='placeholder_class' />
			</view>
			<view class="password no_line">
				<password-input v-model='passwd'></password-input>
			</view>
			<view class="inner_box">
				<view class="btn" @tap="doReset" :style="{backgroundColor:btnColor}">{{btnTxt}}</view>
			</view>

		</view>

	</view>
</template>

<script>
	import Api from '@/common/api.js'
	import {
		isPassword
	} from '@/common/untils.js';
	import PasswordInput from '@/components/passwordInp/index.vue'
	export default {
		components:{PasswordInput},
		data() {
			return {
				phoneNumber: "",
				code: '',
				passwd: "",
				getCodeText: '获取验证码',
				getCodeBtnColor: "#c3c8dc",
				getCodeisWaiting: false,
				btnTxt:'重置密码'
			}
		},
		computed:{
			btnColor(){
				return this.passwd==''&&this.phoneNumber==''&&this.code==''?'#c3c8dc':'#ff2c29'
			}
		},
		onLoad(opt) {
			if(opt.type=='forget'){
				uni.setNavigationBarTitle({
					title: '忘记密码'
				});
				this.btnTxt = '提交'
			}
		},
		methods: {
			Timer() {},
			async getCode() {
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
					type: '4'
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
			async doReset() {
				uni.hideKeyboard()
				//模板示例部分验证规则
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))) {
					uni.showToast({
						title: '请填写正确手机号码',
						icon: "none"
					});
					return false;
				}

				//示例验证码，实际使用中应为请求服务器比对验证码是否正确。
				if (this.code == '') {
					uni.showToast({
						title: '验证码不正确',
						icon: "none"
					});
					return false;
				}
				if (!isPassword(this.passwd)) {
					uni.showToast({
						title: '密码格式不正确，密码由6-20位字母、数字和特殊字符组成',
						icon: "none"
					});
					return false;
				}
				uni.showLoading({
					title: '提交中...'
				})
				//模板示例修改本地储存的用户信息，实际使用中请替换为上传服务器修改。
				let params = {
					"mobile": this.phoneNumber,
					"password": this.passwd,
					"code": this.code
				}
				let msg = await Api.apiCall('post', Api.index.updatePassword, params)
				if (msg.code == 200) {
					uni.showToast({
						title: msg.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
				}

			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/css/login.scss";
</style>
