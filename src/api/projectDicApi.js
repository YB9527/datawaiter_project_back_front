import  Api from './api.js'
import  FJApi from './fjApi.js'
const baseurl  ="/projectdic/";

/**
 * 请求数据
 */
var saveProjectDic = function(projectdic) {
  return Api.post({
    url:baseurl+"saveprojectdic",
    data: projectdic,
  });
};
exports.saveProjectDic =saveProjectDic;

var updateProjectDic = function(projectdic) {
  return Api.post({
    url:baseurl+"updateprojectdic",
    data: projectdic,
  });
};
exports.updateProjectDic = updateProjectDic;

var deleteProjectDic = function(projectdic) {
  return Api.post({
    url:baseurl+"deleteProjectDic",
    data: projectdic,
  });
};
exports.deleteProjectDic = deleteProjectDic;

var findByProjectid = function(projectid) {
  return Api.get({
    url:baseurl+"findbyprojectid?projectid="+projectid,
  });
};
exports.findByProjectid =findByProjectid;

var findDicGroup = function(databaseconnectid,dictablename){
  return Api.get({
    url:baseurl+"finddicgroup?databaseconnectid="+databaseconnectid+"&dictablename="+dictablename,
  });
};
exports.findDicGroup =findDicGroup;

var findDicGroupInAll = function(databaseconnectid,dictablename,dicgroup){
  return Api.get({
    url:baseurl+"findDicGroupInAll",
    data:{databaseconnectid,dictablename,dicgroup}
  });
};
exports.findDicGroupInAll =findDicGroupInAll;


var saveDic = function(projectdicid,dic) {
  return Api.post({
    url:baseurl+"saveDic?projectdicid="+projectdicid,
    data: dic,
  });
};
exports.saveDic = saveDic;

var updateDic = function(projectdicid,dic) {
  return Api.post({
    url:baseurl+"updateDic?projectdicid="+projectdicid,
    data: dic,
  });
};
exports.updateDic = updateDic;

var deleteDic = function(projectdicid,dic) {
  return Api.post({
    url:baseurl+"deleteDic?projectdicid="+projectdicid,
    data: dic,
  });
};
exports.deleteDic = deleteDic;
