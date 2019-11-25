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
				<view class='user_agreement'>默认同意<text @tap='goAgreement'>用户协议</text></view>
				<view class="btn" @tap="doReg" :style="{backgroundColor:btnColor}">立即注册</view>
				<view class="res">
					<view @tap="toLogin">已有账号立即登录</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import Api from '@/common/api';
	import {isPassword} from '@/common/untils.js';
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
				getCodeisWaiting: false
			}
		},
		computed:{
			btnColor(){
				return this.passwd==''&&this.phoneNumber==''&&this.code==''?'#c3c8dc':'#ff2c29'
			}
		},
		methods: {
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
					phone:this.phoneNumber,
					type:'2'
				}
				let data = await Api.apiCall('post', Api.index.sendCodes, params);
				if(data.code==200){
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
			async doReg() {
				uni.hideKeyboard()
				if(this.isRegister){
					return;
				}
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
				// 密码格式验证
				if(!isPassword(this.passwd)){
					uni.showToast({
						title: '密码格式不正确，密码由6-20位字母、数字和特殊字符组成',
						icon: "none"
					});
					return false;
				}
				uni.showLoading({
					title: '提交中...'
				})
				let params = {
					"regType": 1,
					"userAccount": this.phoneNumber,
					"userCode": this.code,
					"appCode": "com.zhongzhudata.zhongzhu",
					"userPassword":this.passwd,
					"userType": 1,
					"sign": "string"
				}
				//注册
				this.isRegister = true;
				let data = await Api.apiCall('post', Api.index.reg, params);
				//模板示例把用户注册信息储存在本地，实际使用中请替换为上传服务器。
				if(data.code==200){
					this.getUserInfo();
				}
				
			},
			async getUserInfo(){
				let obj = {
					"userAccount": this.phoneNumber,
					userCode:this.passwd,
					loginType:1,
					appCode:"com.zhongzhudata.zhongzhu"
				}
				let msg = await Api.apiCall('post',Api.index.login,obj);
				if(msg.code==200){
					uni.setStorage({
						key:'userInfo',
						data:msg.data,
						success:()=>{
							uni.showToast({
								title:'注册成功'
							})
							this.$store.commit('userInfo',msg.data)
							setTimeout(()=>{
								uni.switchTab({
									url:'/pages/tabBar/home/home'
								})
							},500)
						}
					})
				}else{
					this.isRegister = false;
				}
			},
			toLogin() {
				uni.hideKeyboard()
				uni.redirectTo({
					url: 'login'
				});
				uni.navigateBack();
			},
			goAgreement(){
				uni.navigateTo({
					url:'/pages/login/useragreement'
				})
			}
		},
		onBackPress(){
			//隐藏键盘
			uni.hideKeyboard()
		}
	}
</script>

<style lang="scss">
	@import "../../static/css/login.scss";
	.user_agreement{
		font-size:30upx;
		margin-top:40upx;
		color:$mainfotC;
		text{
			color:#aaacb4;
			text-decoration: underline;
		}
	}
</style>
