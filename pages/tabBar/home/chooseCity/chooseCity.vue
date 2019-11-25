<template>
	<view>
		<phone-directory :phones="list" @paramClick="paramClick" v-model='keyword'></phone-directory>
	</view>
</template>

<script>
	import cityList from '@/common/city.js';
	import phoneDirectory from '@/components/phone-directory/phone-directory.vue'
	export default {
		components:{
			phoneDirectory
		},
		data() {
			return {
				list:{},
				keyword:''
			};
		},
		watch:{
			keyword(val){
				let h = /^[\u4e00-\u9fa5]+$/;
				let y = /^[A-Za-z]+$/;
				val = val.toLowerCase();
				if(val==''){
					this.getDefaultData();
				}else{
					this.list = {};
					if(h.test(val)){
						this.list['all'] = cityList.filter(data=>{
							return data.name.includes(val);
						})
					}else if(y.test(val)){
						let arr1 = cityList.filter(data=>{
							return data.Spell.toLowerCase().includes(val);
						})
						let arr2 = [];
						if(val.length!=1){
							arr2 = cityList.filter(data=>{
								return data.SpellSX.toLowerCase().includes(val);
							})
						}
						this.list['all'] = [...arr1,...arr2]
					}
				}
			}
		},
		onLoad(){
			this.getDefaultData();
		},
		methods:{
			paramClick (e) {
				let name = e.logogram;
				let code = e.code;
				this.$store.commit('setArea',{name,code});
				let url = `/pages/tabBar/home/home`;
				uni.switchTab({
					url
				})
			},
			getDefaultData(){
				let arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
				this.list = {};
				arr.map(item=>{
					this.list[item] = cityList.filter(data=>{
						return data.Spell[0]==item;
					})
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
