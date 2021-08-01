var baseurl = "/sys";
var deleteByTableNameAndId = function (tablename, id) {
  return baseurl + "/deleteByTableNameAndId?tableName=" + tablename + "&id=" + id;
};
exports.deleteByTableNameAndId = deleteByTableNameAndId;

var   findByTableName = function (tablename) {
  return baseurl+"/findAll?tableName="+tablename;
};
exports.findByTableName = findByTableName;


var findByTableNameAndId = function (tablename, id) {
  return baseurl + "/findByTableNameAndId?tableName=" + tablename + "&id=" + id;
};
exports.findByTableNameAndId = findByTableNameAndId;



var   findEnums = function (enumClassName) {
  return baseurl+"/findEnums?enumClassName=" + enumClassName;
};
exports.findEnums = findEnums;


