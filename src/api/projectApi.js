import  Api from './api.js'
import  FJApi from './fjApi.js'
const baseurl  ="/project/";

/**
 * 请求数据
 */
var edit = function(project) {
  return Api.post({
    url:baseurl+"edit",
    data: project,
  });
};
exports.edit =edit;

var updateAll = function(projectArray) {
  return Api.post({
    url:baseurl+"updateAll",
    data: projectArray,
  });
};
exports.updateAll =updateAll;

var findById = function(id) {
  if(!id){
    return ;
  }
  return Api.getOneData({
    url:baseurl+"findById",
    data:{id}
  }).then(project=>{
    project.imageurl = FJApi.getURLByPath(project.imagepath);
    return project;
  });
};
exports.findById =findById;

var findAll = function() {
  return Api.post({
    url:baseurl+"findall",
    data:{},
  }).then(datas=>{
    if(datas){
      datas.forEach(project=>{
        project.imageurl = FJApi.getURLByPath(project.imagepath);
      })
    }
    return datas;
  });
};
exports.findAll =findAll;

var findalltablebyprojectid = function(projectid) {
  return Api.get({
    url:baseurl+"findalltablebyprojectid",
    data:{projectid}
  });
};
exports.findalltablebyprojectid =findalltablebyprojectid;
