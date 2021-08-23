import  Api from './api.js'
import  FJApi from './fjApi.js'
const baseurl  ="/postion/";


var edit = function(postion) {
  return Api.post({
    url:baseurl+"edit",
    data:postion,
  });
};
exports.edit =edit;

/**
 * 查询项目所有分组
 * @param projectid
 * @returns {*}
 */
var findGroupByProjectid = function(projectid) {
  return Api.get({
    url:baseurl+"findGroupByProjectid",
    data:{projectid},
  });
};
exports.findGroupByProjectid =findGroupByProjectid;

var findByProjectid = function(projectid) {
  return Api.get({
    url:baseurl+"findByProjectid",
    data:{projectid},
  });
};
exports.findByProjectid =findByProjectid;

var deletePosition = function(position) {
  return Api.post({
    url:baseurl+"delete",
    data:position,
  });
};
exports.deletePosition =deletePosition;
