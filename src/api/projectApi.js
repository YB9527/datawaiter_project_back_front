import  Api from './api.js'
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


var findAll = function() {
  return Api.get({
    url:baseurl+"findall",
  });
};
exports.findAll =findAll;

