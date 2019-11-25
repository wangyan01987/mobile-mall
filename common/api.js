export default {
	BASEURI:'https://zulinapi.zhujianyun.com/api/',

	es: {
		searchList: 'search',
	},
	/**
	 * 接口名称
	 */
	//用户相关
	index: {
		home:'HomeApi/HomeIndex',//get 首页信息 cityCode
		appletLogin_by_weixin: 'applet/login_by_weixin', // 登录(手机号:phone 密码:password)
		login: 'UserInfoApi/Login', // 登录(手机号:phone 密码:password)
		updatePassword: 'UserInfoApi/ResetPassword',
		reg: 'UserInfoApi/Registered', // 注册
		sendCodes: 'UserInfoApi/SmsSendCodeByType', // 获取验证码 登录1 注册2 修改密码4
		avatar:'OSSApi/UploadAvatarUrl',//上传图片
		avatarBase64:'OSSApi/UploadAvatarUrlB64',
		updateAvatar:'UserInfoApi/EditAvatarUrl',//修改头像	 put
		signature:'UserInfoApi/EditIntroduction',//更新个性签名 put
		nickName:'UserInfoApi/EditNickname',//修改 昵称
	},
	//地址相关
	address:{
		add:'ShippingAddressApi/AddShippingAddress',//新增
		edit:'ShippingAddressApi/EditShippingAddress',//编辑地址 put
		delete:'ShippingAddressApi/DeleteShippingAddress',//删除地址 delete
		list:'ShippingAddressApi/ShippingAddressList',//地址列表 get
		detail:'ShippingAddressApi/ShippingAddressDetail'//地址详情	get
	},
	//信息相关
	message:{
		feedBack:'UserInfoApi/AddFeedBack',//新增意见反馈 post
		feedBackNum:'UserInfoApi/FeedBackNotReadNum',//未读信息数量 get
		messageList:'UserInfoApi/MessageList',//信息列表 get
		messageDetail:'UserInfoApi/ReplyMessageDetail',//信息详情 get
		messageDelete:'UserInfoApi/DeleteMessage',//信息删除 delete
	},
	//分类相关
	category:{
		parentList:'ProTypeApi/GetValidParentList',
		childList:'ProTypeApi/GetValidChildList',
		findCategory:'ProTypeApi/GetValidTypeList'
	},
	//商品相关
	goods: {
		goodsList:'ProductApi/GetPhoneProductList',//商品列表 get CompanyId name productType pageIndex pageSize
		goodsDetail:'ProductApi/GetProductDetail',//商品详情 get proId
		findName:'ProTypeApi/GetVTypeList',//商品名模糊查询
	},
	// 店铺相关
	shop:{
		shopDetail:'CompanyApi/GetCompanyInfo',//店铺详情
	},
	//收藏相关
	collection:{
		shopCollection:'CompanyApi/IsCollectCompany',// put companyId userId isCollect
		productCollection:'ProductApi/IsCollectProduct',// put productId userId isCollect
		collectionNum:'UserInfoApi/CollectCount',//get userid
		shopCollectionList:'UserInfoApi/CollectCompanyList',//get userid
		productCollectionList:'UserInfoApi/CollectProductList',//get userid
	},

	/**
	 * 封装请求（async await 封装uni.request）
	 * method	   post/get		
	 * endpoint    接口方法名
	 * data		   所需传递参数	
	 * load		   是否需要loading
	 */
	async apiCall(method, endpoint, data, load) {
		if (!load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}
		let showFalse = data.showFalse || false;
		delete data.showFalse;
		let fullurl = this.BASEURI + endpoint;
		let [error, res] = await uni.request({
			url: fullurl,
			data: data,
			method: method,
			header: {
				// 'storeId': 1,
				// 'Content-Type': 'application/x-www-form-urlencoded',
				'content-type': 'application/json',
				// 'Authorization': Authorization || ''
			},
		});
		uni.hideLoading();
		if (res.data.code == 200) {
			return res.data;
		} else {
			if(!showFalse){
				uni.showToast({
					title: res.data.msg,
					icon: 'none'
				});
			}
			return res.data
		}
	},
	/**
	 * 封装请求（async await 封装uni.request）
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 */
	async apiEsCall(method, endpoint, data, load) {
		if (!load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}

		let fullurl = this.BASEURI + endpoint;
		let Authorization;
		const userToken = uni.getStorageSync('userToken');
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo) {
			data.memberId = userInfo.id;
			Authorization = userToken;

		}
		let [error, res] = await uni.request({
			url: fullurl,
			data: data,
			method: method,
			header: {
				// 'storeId': 1,
				// 'Content-Type': 'application/x-www-form-urlencoded',
				'content-type': 'application/json',
				// 'Authorization': Authorization || ''
			},
		});
		if (!load) {
			uni.hideLoading();
		}
		return res;

	},
}
