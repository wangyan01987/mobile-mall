// 时间格式化
export function dateFormat(val,seperator) {
  let date = new Date(val);
  let seperator1 = seperator || "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  let h = date.getHours();
  h = h>10?h:`0${h}`;
  let m = date.getMinutes();
  m = m>10?m:`0${m}`;
  let s = date.getSeconds();
  s = s>10?h:`0${s}`;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  // let currentdate = year + seperator1 + month + seperator1 + strDate + " " +`${h}:${s}:${m}`;
  let currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate;
}

// 另一个格式化日期
export function  getDate(val){
  let date = new Date();
  if(val){
    date = new Date(val)
  }
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  month = month>=10?month:`0${month}`;
  let newVal = `${year}-${month}-${date.getDate()>=10?date.getDate():`0${date.getDate()}`}`
  return newVal;
}

// 获取字节长度
export function getBaseLength(val) {
  let reg = /^[\u4e00-\u9fa5]|[a-zA-Z]$/;
  let totalLength = 0;
  for (let i = 0; i < val.length; i++) {
    let c = val.charAt(i);
    if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
    {
      totalLength += 1;
    }
    else {
      totalLength += 2;
    }
  }
  if (reg.test(val) && totalLength <= 8) {
    return true
  } else {
    return false
  }
}

// 身份证号验证
export function CheckIDCard(card) {
  // 1 "验证通过!", 0 //校验不通过
  let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if (!format.test(card)) {
    return false;//{ 'status': 0, 'msg': '身份证号码不合规' };
  }
  //区位码校验
  //出生年月日校验   前正则限制起始年份为1900;
  let year = card.substr(6, 4),//身份证年
    month = card.substr(10, 2),//身份证月
    date = card.substr(12, 2),//身份证日
    time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
    now_time = Date.parse(new Date()),//当前时间戳
    dates = (new Date(year, month, 0)).getDate();//身份证当月天数
  if (time > now_time || date > dates) {
    //return { 'status': 0, 'msg': '出生日期不合规' }
    return false;
  }
  //校验码判断
  let c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   //系数
  let b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  //校验码对照表
  let id_array = card.split("");
  let sum = 0;
  for (let k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(c[k]);
  }
  if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
    //return { 'status': 0, 'msg': '身份证校验码不合规' }
    return false;
  }
  return true;//{ 'status': 1, 'msg': '校验通过' }
}


//纯移动手机验证
export function isOnlyMobile(val) {
  let str = val.trim();
  let reg = /^[1][3,4,5,7,8,6][0-9]{9}$/;
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}

//密码验证
export function isPassword(val) {
  let str = val.trim();
  // let reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![_]+$).{6,20}$/;
  let reg = /^([a-zA-Z0-9]|[!@#$%^&*()]){6,20}$/
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}


export function objKeySort(obj) {//排序的函数
  let newkey = Object.keys(obj).sort();
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  let newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  let str = '';
  for (let key in newObj) {
    str += key + '=' + newObj[key] + '&';
  }
  str = str.substring(0,str.length-1);
  return str;//返回排好序的新对象
}
//URL验证
export function url(val){
let str=val.trim();
let reg=/(http|https|HTTP|HTTPS)[:：]\/\/([\w.-:：]+)/;
  return reg.test(str);
}
//emailbox验证
export function email(val){
  let str=val.trim();
  let reg= /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
  return reg.test(str);
}


export function timeago(dateTimeStamp){   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  let minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
  let hour = minute * 60;
  let day = hour * 24;
  let week = day * 7;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();   //获取当前时间毫秒
  let diffValue = now - dateTimeStamp;//时间差

  if(diffValue < 0){
    return;
  }
  let minC = diffValue/minute;  //计算时间差的分，时，天，周，月
  let hourC = diffValue/hour;
  let dayC = diffValue/day;
  let weekC = diffValue/week;
  let monthC = diffValue/month;
  let result = '';
  if(monthC >= 1 && monthC <= 3){
    result = " " + parseInt(monthC) + "月前"
  }else if(weekC >= 1 && weekC <= 3){
    result = " " + parseInt(weekC) + "周前"
  }else if(dayC >= 1 && dayC <= 6){
    result = " " + parseInt(dayC) + "天前"
  }else if(hourC >= 1 && hourC <= 23){
    result = " " + parseInt(hourC) + "小时前"
  }else if(minC >= 1 && minC <= 59){
    result =" " + parseInt(minC) + "分钟前"
  }else if(diffValue >= 0 && diffValue <= minute){
    result = "刚刚"
  }else {
    let datetime = new Date();
    datetime.setTime(dateTimeStamp);
    let Nyear = datetime.getFullYear();
    let Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    let Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    let Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    let Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    let Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate
  }
  return result;
}

// 倒计时 输入倒计时总秒数
export function getT(totalSeconds){
  let days = Math.floor(totalSeconds / (60 * 60 * 24));
  //取模（余数）
  let modulo = totalSeconds % (60 * 60 * 24);
  //小时数
  let hours = Math.floor(modulo / (60 * 60));
  hours = hours<10?`0${hours}`:hours
  modulo = modulo % (60 * 60);
  //分钟
  let minutes = Math.floor(modulo / 60);
  minutes = minutes<10?`0${minutes}`:minutes
  //秒
  let seconds = modulo % 60;
  seconds = seconds<10?`0${seconds}`:seconds
  if(hours=='00'){
    return `${minutes}:${seconds}`
  }else{
    return `${hours}:${minutes}:${seconds}`
  }
}

export function isLogin(flag,type){
	if(!flag){
		if(!type){
			uni.navigateTo({
				url:'/pages/login/login'
			})
		}else{
			uin.showToast({
				title:'您还没登录，请先登录后进行后续操作'
			})
		}
		return false;
	}
	return true;
}

export function showModal(content,sCallBack,title,confirmTxt,cancelTxt,fCallBack){
	let isA = 0;
	uni.getSystemInfo({
		success:res=> {
			if (res.platform == "android") {
				isA = 1;
			}else{
				isA = 2;
			}
		}
	});
	confirmTxt = confirmTxt || '确定';
	cancelTxt = cancelTxt || '取消';
	title = title || '';
	if(isA==1){
		return uni.showModal({
			title:title,
			content: content,
			cancelText:confirmTxt,
			confirmText:cancelTxt,
			success: (e) => {
				if (e.confirm) {
					if(fCallBack){
						fCallBack()
					}
				}else if(e.cancel){
					sCallBack()
				}
			}
		})
	}else{
		return uni.showModal({
			title:title,
			content: content,
			confirmText:confirmTxt,
			cancelText:cancelTxt,
			success: (e) => {
				if (e.confirm) {
					sCallBack()
				}else if(e.cancel){
					if(fCallBack){
						fCallBack()
					}
				}
			}
		})
	}
}


