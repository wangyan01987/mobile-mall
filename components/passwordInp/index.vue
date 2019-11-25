<template>
	<view class='box'>
		<input type="text" placeholder="请输入密码" :value="currentValue" @input="handleInput" :password='pwd' placeholder-class='placeholder_class' />
		<text class='iconfont icon-mimakejian' @touchstart="pwd=false" @touchend="pwd=true"></text>
	</view>
</template>

<script>
	export default {
		props: ['value'], //接收一个 value prop
		data() {
			return {
				pwd: true,
				currentValue: this.value
			}
		},
		onLoad(){
			
		},
		methods: {
			handleInput(event) {
				let value = event.target.value;
				this.$emit('input', value); //触发 input 事件，并传入新值
			}
		}
	}
</script>

<style lang='scss'>
	.box {
		display: flex;
		width: 86vw;
		justify-content: space-between;

		.iconfont {
			font-size: 36upx;
			width: 80upx;
			text-align: center;
			margin-top: 10upx;
			color: #c3c8dc;
		}
	}

	.placeholder_class {
		color: #c3c8dc;
	}
</style>
