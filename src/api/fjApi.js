import  Api from './api.js'
const baseurl  ="/fj/";
import axios from 'axios'
const fileHeader = {
  "Content-Type":"multipart/form-data", //文件上传时的格式
};

var getURLByPath = function(path){
  if(path){
    let url =(Api.imgpriewurl +  path).replace(/\\/g,"/");
    return url;
  }

};
exports.getURLByPath = getURLByPath;

var setURL = function(fjArray){
  for (let fj of fjArray){
    let url =  getURLByPath(fj.path);
    fj.url = url;
  }
};
exports.setURL = setURL;




var uploadFile= function(file,fj) {
  if(!(file instanceof  Array)){
    file  = [file];
    fj  = [fj];
  }
  return uploadFileArray(file,fj);
};
exports.uploadFile =uploadFile;

var uploadFileArray = function(fileArray,fjArray) {
  let url = baseurl + "upload";
  const formdata = new FormData();
  for (let i = 0;i < fileArray.length;i++) {
    formdata.append('file', fileArray[i]);
    fjArray[i].size = (fileArray[i].size / 1024 /1024).toFixed(1);
    fjArray[i].extendname = fileArray[i].type;
  }
  formdata.append("fj",JSON.stringify(fjArray));
  return Api.post({url,data:formdata});
};
exports.uploadFileArray =uploadFileArray;

var uploadFileSingle = function(file,fj) {
  let url = baseurl + "upload";
  const formdata = new FormData();
  //封装成数组上传
  formdata.append("file", file);
  formdata.append("fj",JSON.stringify(fj));
  return Api.post({url,data:formdata,headers:fileHeader});
};
exports.uploadFileSingle =uploadFileSingle;


var findImageByObjectidAndCustomname = function (objectid,customname) {
  let url = baseurl + "findImageByObjectidAndCustomname";
  return Api.get({url,data:{objectid,customname}});
};
exports.findImageByObjectidAndCustomname =findImageByObjectidAndCustomname;

var deleteFJ = function(fjarray){
  let url = baseurl + "delete";
  return Api.post({url,data:fjarray});
};
exports.deleteFJ =deleteFJ;


