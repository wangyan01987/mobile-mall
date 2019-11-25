<template>
	<image :src="src" @tap='chooseImg'></image>
</template>

<script>
	import Api from '@/common/api.js';
	import {isLogin} from '@/common/untils.js';
	import {
		pathToBase64
	} from '@/common/image-tools/index.js'
	export default {
		props: {
			src: {
				type: String
			}
		},
		data() {
			return {

			}
		},
		computed:{
			isLogin(){
				return this.$store.state.isLogin;
			},
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		methods: {
			chooseImg() {
				if (!isLogin(this.isLogin)) {
					return false;
				}

				uni.chooseImage({
					count: 1, //默认9
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						let src = tempFilePaths[0];
						uni.getSystemInfo({
							success:res=> {
								if (res.platform == "ios") {
									this.iosUpload(src)
								}else{
									this.ossUpload(src)
								}
							}
						});
					}
				});
			},
			iosUpload(src) {
				pathToBase64(src)
					.then(base64 => {
						this.uplaodBase64(base64)
					})
					.catch(error => {
						uni.showToast({
							title:'上传失败',
							icon:'none'
						})
					})

			},
			async uplaodBase64(imagebase64){
				let data = await Api.apiCall('post', Api.index.avatarBase64, {
					imagebase64
				})
				if (data.code == 200) {
					this.updateAvatar(data.data)
				}
			},
			ossUpload(src) {
				let url = `${Api.BASEURI}${Api.index.avatar}`;
				uni.uploadFile({
					url,
					filePath: src,
					name: 'file',
					formData: {
						file: src
					},
					success: (uploadFileRes) => {
						let data = JSON.parse(uploadFileRes.data);
						if (data.code == 200) {
							this.updateAvatar(data.data)
						}
					}
				});
			},
			async updateAvatar(url) {
				console.log(url)
				let result = await Api.apiCall('put', Api.index.updateAvatar, {
					id: this.userInfo.id,
					avatarUrl: url
				})
				if (result.code == 200) {
					uni.showToast({
						title: '修改成功',
						icon: 'none'
					})
					let userInfo = this.userInfo;
					userInfo.avatarUrl = url;
					this.$store.commit('setUserInfo', userInfo)
					uni.setStorage({
						key: 'userInfo',
						data: userInfo
					})
				}
			},
		}
	}
</script>

<style>

</style>
