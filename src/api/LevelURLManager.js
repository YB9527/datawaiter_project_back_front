var baseurl = "/level";

var   addApiLevel = function () {
  return baseurl+"/addapilevel";
};
exports.addApiLevel = addApiLevel;

var   editApiLevel = function () {
  return baseurl+"/editApiLevel";
};
exports.editApiLevel = editApiLevel;

var   addBeanLevel = function () {
  return baseurl+"/addBeanLevel";
};
exports.addBeanLevel = addBeanLevel;


var   findApiLevel = function () {
  return baseurl+"/findapilevel";
};
exports.findApiLevel = findApiLevel;

var   findBeanLevel = function () {
  return baseurl+"/findBeanLevel";
};
exports.findBeanLevel = findBeanLevel;

var   deleteLevelById = function () {
  return baseurl+"/deletelevelbyid?id=";
};
exports.deleteLevelById = deleteLevelById;

var   findLevelAndParentId = function () {
  return baseurl+"/findLevelAndParentId?id=";
};
exports.findLevelAndParentId = findLevelAndParentId;

var   findApiLevelByParentId = function (parentId) {
  return baseurl+"/findApiLevelByParentId?parentId="+parentId;
};
exports.findApiLevelByParentId = findApiLevelByParentId;
