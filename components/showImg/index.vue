<template>
	<div class="show_img" v-if='showPicker'>
		<div :class="{'pickerMask':showPicker}" @click="maskClick">
			<image :src='url'></image>
		</div>
	</div>
</template>

<script>
	export default{
		props:{
			url:{
				type:String
			}
		},
		data(){
			return{
				showPicker:false,
			}
		},
		methods:{
			maskClick(){
				this.showPicker = false;
			},
			show() {
				setTimeout(() => {
					this.showPicker = true;
				}, 0);
			},
		}
	}
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display:flex;
		justify-content: center;
		align-items: center;
	}
	.pickerMask image{
		width:90%;
		max-height:90%;
	}
</style>
