<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">
					收货人
				</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" type="text" v-model="address.consignee" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					手机号码
				</view>
				<view class="input">
					<input placeholder="请输入收件人电话号码" type="text" v-model="address.mobile" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					所在地区
				</view>
				<view class="input" @tap="chooseCity">
					<view v-if='address.provinceName'>
						<text>{{address.provinceName}}</text>
						<text v-if="address.cityName!='市辖区'">-{{address.cityName}}</text>
						<text>-{{address.countyName}}</text>
					</view>
					<text v-else>{{region.label}}</text>
				</view>
				
			</view>
			<view class="row">
				<view class="nominal">
					详细地址
				</view>
				<view class="input">
					<textarea v-model="address.address" auto-height="true" placeholder="输入详细地址"></textarea>
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					设置默认地址
				</view>
				<view class="input switch">
					<switch color="#ff2c29" :checked="address.isDefault==1" @change=isDefaultChange />
				</view>
			</view>
			<view class="row" v-if="editType=='edit'" @tap="del">
				<view class="del">
					删除收货地址
				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存地址
			</view>
		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValue" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import Api from '@/common/api.js';
	import {isOnlyMobile} from '@/common/untils.js'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				editType:'edit',
				id:'',
				address:{
					consignee:'',
					mobile:'',
					address:'',
					isDefault:0
				},
				cityPickerValue: [0, 0, 1],
				themeColor: '#007AFF',
				region:{label:"请点击选择地址",value:[],cityCode:""}
			};
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo
			}
		},
		methods: {
			onCancel(e) {
				
			},
			chooseCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.cityPickerValue = e.value;
				this.address.provinceCode = e.provinceCode;
				this.address.provinceName = e.province;
				this.address.cityCode = e.cityCode;
				this.address.cityName = e.city;
				this.address.countyCode = e.areaCode;
				this.address.countyName = e.area;
				this.address.cityPicker = JSON.stringify(e.value)
			},
			isDefaultChange(e){
				if(e.detail.value){
					this.address.isDefault = 1;
				}else{
					this.address.isDefault = 0;
				}
			},
			del(){
				this.$showModal('你将删除这个地址',()=>{
					this.delAddress();
				},'删除提示')
				
			},
			async delAddress(){
				let res = await Api.apiCall('post',Api.address.delete,{id:Number(this.id),userId:this.userInfo.id});
				if(res.code==200){
					uni.showToast({
						title:'删除成功',
						icon:'none'
					})
					uni.navigateBack()
				}
			},
			async save(){
				let data = this.address;
				if(this.editType=='edit'){
					this.address.id = this.id
				}
				if(!data.consignee){
					uni.showToast({title:'请输入收货人姓名',icon:'none'});
					return ;
				}
				if(!data.mobile){
					uni.showToast({title:'请输入手机号码',icon:'none'});
					return ;
				}else if(!isOnlyMobile(data.mobile)){
					uni.showToast({title:'手机号码格式不正确',icon:'none'});
					return ;
				}
				if(!data.address){
					uni.showToast({title:'请输入详细地址',icon:'none'});
					return ;
				}
				if(!data.provinceCode){
					uni.showToast({title:'请选择收货地址',icon:'none'});
					return ;
				}
				let res = null;
				if(this.editType=='edit'){
					res = await Api.apiCall('put',Api.address.edit,this.address);
				}else{
					res = await Api.apiCall('post',Api.address.add,this.address);
				}
				if(res.code==200){
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					uni.navigateBack()
				}
			},
			async getDetail(){
				let res = await Api.apiCall('get',Api.address.detail,{
					id:this.id,
					userid:this.userInfo.id
				})
				if(res.code==200){
					this.address = res.data;
					this.cityPickerValue = JSON.parse(res.data.cityPicker)
				}
			},
		},
		onLoad(e) {
			//获取传递过来的参数
			this.editType = e.type;
			this.id = e.id || '';
			if(this.editType=='edit'){
				this.getDetail();
			}
			this.address.userId = this.userInfo.id;
		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		}
	};
</script>
<style lang="scss">

.save{
		view{
			display: flex;
		}
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn{
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: $mainColor;
			color: #fff;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		view{
			display: flex;
		}
		.row{
			width: 94%;
			
			margin: 0 3%;
			border-top: solid 1upx #eee;
			.nominal{
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}
			.input{
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 30upx;
				&.switch{
					justify-content: flex-end;
				}
				.textarea{
					margin: 20upx 0;
					min-height: 120upx;
				}
			}
			.del{
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				color: $mainColor;
				background-color: rgba(255,0,0,0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
	
</style>
