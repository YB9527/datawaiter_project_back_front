var baseurl = "/api";
var   findByLevelId = function () {
  return baseurl+"/findbylevelid?id=";
};
exports.findByLevelId = findByLevelId;


var   saveApi = function () {
  return baseurl+"/saveApi";
};
exports.saveApi = saveApi;

var   findApiById = function () {
  return baseurl+"/findApiById?id=";
};
exports.findApiById = findApiById;

/**
 * edit 不区分 编辑、还是保持
 * @returns {string}
 */
var   editApi = function () {
  return baseurl+"/editApi";
};
exports.editApi = editApi;


var   findParamsByApiId = function () {
  return baseurl+"/findParamsByApiId?apiId=";
};
exports.findParamsByApiId = findParamsByApiId;

var   findDataByAPI = function () {
  return baseurl+"/findDataByAPI";
};
exports.findDataByAPI = findDataByAPI;


var   testPostApi = function () {
  return baseurl+"/testPostApi";
};
exports.testPostApi = testPostApi;
