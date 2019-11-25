import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isLogin: false,
		userInfo: {},
		appCode: 'com.zhongzhudata.zhongzhu',
		iosAppid:480921374,
		iosid:"com.zhongzhudata.rent",
		pwd:'ZhuJianYun20180606',
		iosp12name:'cerForZZRent',
		area:{
			code:'',
			name:''
		},
	},
	mutations: {
		login(state, provider) {
			if (provider && provider != undefined) {
				state.hasLogin = true;
			}
			state.userInfo = provider;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: provider
			})

		},
		setUserInfo(state, obj) {
			state.userInfo = obj;
			if (obj && obj.id) {
				state.isLogin = true;
				uni.setStorageSync('userInfo', obj)	
				uni.$emit('getMsg',obj);
			}
		},
		setArea(state,obj){
			state.area = obj;
		},
		logout(state) {
			state.isLogin = false;
			uni.$emit('getMsg','');
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
		}
	},
	actions: {

	}
})

export default store
