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
var post = function({baseurl,url,data}) {
  return axios({
    url:baseurl?baseurl+url:ip+url,
    method: 'post',
    headers: { "Content-Type": "application/json"},
    data: data,
  });
};
exports.post =post;
/**
 * 请求数据
 */
var get = function({baseurl,url,data}) {
  return axios({
    url:baseurl?baseurl+url:ip+url,
    method: 'get',
    data: data,
  }).then(res=>{
    if(res.data.isOk){
      return res.data.data;
    }
  });
};
exports.get =get;

var requestGETOneData = function(req){
	return get(req)
		.then(datas=>{
			if(datas && datas.length > 0){
				return datas[datas.length-1];
			}else{
				return undefined;
			}
		});
};
exports.requestGETOneData =requestGETOneData;

var uploadFile = function({filePath,dir,dirs}) {

	let url = ip + "/file/upload";
	//console.log(url)
	return new Promise((resolve,reject)=>{
		uni.uploadFile({
			url: url, //仅为示例，非真实的接口地址
			filePath: filePath,
			name: 'file',
			formData:{
				dir:dir?dir:"",
				dirs:dirs?dirs:""
			},
			success: (uploadFileRes) => {
				let data = JSON.parse(uploadFileRes.data);
				if(data.isOk){
					resolve(data.data[0]);
				}else{
					reject(uploadFileRes);
				}
			},
			fail: (e) => {
				reject(e);
			}
		});
	})
}
exports.uploadFile =uploadFile;
