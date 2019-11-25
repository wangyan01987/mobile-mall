<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			let userInfo = uni.getStorageSync('userInfo')
			if (userInfo && userInfo.id) {
				this.$store.commit('setUserInfo', userInfo)
				uni.switchTab({
					url:'pages/tabBar/home/home'
				})
			}
		},
		onHide: function() {

		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "/static/iconfont/font.scss";
	@import "/static/css/iconfont.scss";
	.no_data {
		line-height: 80upx;
		color: #3F536E;
		text-align: center;
		font-size: 28upx;
	}
</style>
