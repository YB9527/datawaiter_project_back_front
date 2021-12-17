import { Message,MessageBox,Confirm,Notification,Loading  } from 'element-ui';
import  * as el  from 'element-ui';
/**
 * 根据key 获取 strongdata
 * @param {Object} key
 */
export var getStorageData = function (key) {


};


/**
 * 设置 strong
 * @param {Object} key
 * @param {Object} data
 */
export var setStorageData = function(key,data){

}


export var message = function(options={}){
  Message(options);
}

export var notification = function(options={}){
  Notification(options);
}

/**
 * 弹出确定按钮
 *
 */
export var showModalTip = function(title,content,options={}){

  return new Promise((resole,reject)=>{
    MessageBox.alert(content, title, {
        type:options.type,
        confirmButtonText: '确定',
        callback: action => {

          resole();
        }
     });
  })
}

export var confirm = function(title,content,options={}){
  return MessageBox.confirm(content, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: options.type
          })

}


var isShowLoading = false;
var loadingInstance;
/**
 * 显示loading
 */
export var showLoading = function(options){

  loadingInstance = Loading.service(options);
  isShowLoading = true;
}
/**
 * 隐藏loading
 */
export var hideLoading = function(){
  if(loadingInstance){
     loadingInstance.close();
     isShowLoading = false;
  }
}



/**
 * 预览对象里面的图片
 */
var previewImageInDataArray = function(index,dataArray,key="url"){
	if(dataArray){
		let urls = [];
		dataArray.forEach(data=>{
			urls.push(data[key]);
		});
		previewImage(urls[0],urls);
	}
}


/**
 * 预览图片
 * @param {Object} url
 * @param {Object} urlArray
 */
var previewImage = function(url,urlArray){

}


var downloadFile = function(url){


}
