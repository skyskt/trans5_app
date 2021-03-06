//var serverUrl = "http://192.168.3.14:8116/trans5/";
var serverUrl = "https://2.trans5.cn/trans5/";




function ajax(url,param, sendFun, compFun, callBack) {
	var userinfo = $api.getStorage("userinfo");
   var params = {};
   params.url = serverUrl+url;
   if(param.headers)
       params.headers = param.headers
   else   
       params.headers = {"from":"rest"};
       
    params.headers.session_id = guid();
   //params.headers = {"session_id":guid()};
   if(userinfo)
      params.headers.fcr = userinfo.fcr;
   if(param.method)
     params.method = param.method;
   else
        params.method="post";
   sendFun && sendFun();
   if(param.data)
      params.data = param.data;
   else{
      params.data = {"body":param}
   }
   if(param.dataType)
      params.dataType = param.dataType;
   api.alert({msg:JSON.stringify(params)});
   
   api.ajax(params,function(ret,err){
   	   if(ret){
   	       if(ret.data.retCode && ret.data.retCode=="-2"){
   	          api.toast({
	                 msg:ret.data.errMsg
                 });
   	          
   	              api.openWin({
				        name: 'applogin',
				        url: 'html/login/login.html',
				        slidBackEnabled:false
			        });
   	          
   	          
   	       }
   	       else
   	          callBack(ret)
   	   }else{
   	       api.alert({ msg: JSON.stringify(err) });
   	   }
   });   
   
  


}

function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
function guid() {
    return (S4()+"-"+S4()+"-"+S4()+S4()+S4()+S4()+S4()+S4());
}


//时间戳转DateTime
function timeStamp2String (time){
    var datetime = new Date();
     datetime.setTime(time);
     var year = datetime.getFullYear();
     var month = datetime.getMonth() + 1;
     if(month < 10 ) {
    	 month = "0" + month;
     }
     var date = datetime.getDate();
     if(date < 10 ) {
    	 date = "0" + date;
     }
     var hour = datetime.getHours();
     if(hour < 10 ) {
    	 hour = "0" + hour;
     }
     var minute = datetime.getMinutes();
     if(minute < 10 ) {
    	 minute = "0" + minute;
     }
     var second = datetime.getSeconds();
     if(second < 10 ) {
    	 second = "0" + second;
     }
     var mseconds = datetime.getMilliseconds();
     return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second ;
};

//获取当前登录人机构id
function getUserDeptId(callBack) {
	var deptId = null;
	$.ajax({ url: serverUrl+"bi/QueryMainAction/getUserDept",
		headers: {
			       session_id:guid(),from:"rest",			               
			     },
			  	 method:"POST"
	}).success(function(data){	
		var ret = JSON.parse(data);
		if (ret.code != 1000) {
			error_msg(ret.message);
			return;
		}  
		/**deptId = ret.data.id;*/
		callBack(ret.data);
	});
	
	return deptId;
}

//获取每页行数 
function pageSizeApp(callBack){
	var iDisplayLength = 0;
	
	$.ajax({ url: serverUrl+"bi/param/pagesizeApp",
		headers: {
			       session_id:guid(),from:"rest",			               
			     },
			  	 method:"POST"
	}).success(function(data){	
		var ret = JSON.parse(data);
		if (ret.code != 1000) {
			error_msg(ret.message);
			return;
		} 
		
		callBack(ret.data);
	});
	
	return iDisplayLength;
} 

//特殊字符验证
function stripscript(obj) { 
	var reg = new RegExp("[@#\$\&|'`\\\\/\"]");
	var s = "";
	for(var i = 0; i < obj.value.length; i++) {
		s = s + obj.value[i].replace(reg,'');
	}
	//obj.value = obj.value.replace(reg,'');
	obj.value = s;
}

//判断字符串长度，包含中文
function getStrLength(str) {
	var l = str.length;
	var blen = 0;
	for(i=0; i<l; i++) {
		if ((str.charCodeAt(i) & 0xff00) != 0) {
			blen ++;
		}
		blen ++;
	}
	
	return blen;
}

//验证电话号码
function checkPhone(tel) {
	var pattern = /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
	return pattern.test(tel); 
}

/**  
 * 将数值四舍五入(保留2位小数)后格式化成金额形式  
 *  
 * @param num 数值(Number或者String)  
 * @return 金额格式的字符串,如'1,234,567.45'  
 * @type String  
 */    
function formatCurrency(num) {    
    num = num.toString().replace(/\$|\,/g,'');    
    if(isNaN(num))    
    num = "0";    
    sign = (num == (num = Math.abs(num)));    
    num = Math.floor(num*100+0.50000000001);    
    cents = num%100;    
    num = Math.floor(num/100).toString();    
    if(cents<10)    
    cents = "0" + cents;    
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)    
    num = num.substring(0,num.length-(4*i+3))+','+    
    num.substring(num.length-(4*i+3));    
    return (((sign)?'':'-') + num + '.' + cents);    
}

function checkMobileNo(mblNo){
	var pattern = /^1[34578]\d{9}$/; 
    return pattern.test(mblNo); 
}