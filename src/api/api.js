import  axios from 'axios'
var ip  = "http://192.168.3.3:3333";
//var ip  = "https://sunliying.shop:11443";
exports.ip = ip;

var imgpriewurl  = ip+"/imgpriew/";
exports.imgpriewurl = imgpriewurl;

exports.baseURL  = ip+"/datawaiter/xiaosunnote";

/**
 * 请求数据
 */
var post = function({baseurl,url,data,headers}) {
  return axios({
    url:baseurl?baseurl+url:ip+url,
    method: 'post',
    headers: headers || { "Content-Type": "application/json"},
    data: data,
  }).then(res=>{
    if(res.data.isOk){
      return res.data.data;
    }
  });
};
exports.post =post;
/**
 * 请求数据
 */
var get = function({baseurl,url,data}) {
 /* if(data){
    url = url + "?";
    for(let key in data){
      url = url + key+"="+data[key]+"&";
    }
    url =url.substring(0,url.length - 1);
  }*/
  url = param2URL(url,data);
  return axios({
    url:baseurl?baseurl+url:ip+url,
    method: 'get',
  }).then(res=>{
    if(res.data.isOk){
      return res.data.data;
    }
  });
};
exports.get =get;

var param2URL = function(baseurl,data){
  if(data){
    baseurl = baseurl + "?";
    for(let key in data){
      baseurl = baseurl + key+"="+data[key]+"&";
    }
    baseurl =baseurl.substring(0,baseurl.length - 1);
  }
  return baseurl;
};
exports.param2URL =param2URL;

var getOneData = function({baseurl,url,data}){

	return get({baseurl,url,data})
		.then(data=>{
			if(data ){
			  if(data instanceof  Array && data.length > 0){
          return data[data.length-1];v
        }else{
			    return data;
        }
			}else{
				return undefined;
			}s
		});
};
exports.getOneData =getOneData;

