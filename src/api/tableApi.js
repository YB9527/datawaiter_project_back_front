import  Api from './api.js'
import  FJApi from './fjApi.js'
const baseurl  ="/database/";


var findFiledAllByDatabaseidAndTableName = function(databaseId,tableName) {
  return Api.get({
    url:baseurl+"findFiledAllByDatabaseidAndTableName",
    data:{databaseId,tableName}
  });
};
exports.findFiledAllByDatabaseidAndTableName =findFiledAllByDatabaseidAndTableName;

/**
 * 保存或者修改字典字典
 * @param fieldArray
 * @returns {*|void}
 */
var saveOrUpdateField = function(fieldarray) {
  return Api.post({
    url:baseurl+"saveOrUpdateField",
    data: fieldarray,
  });
};
exports.saveOrUpdateField = saveOrUpdateField;

var findTableField = function(projectid,databaseid,tableName) {
  return Api.get({
    url:baseurl+"findTableField",
    data:{projectid,databaseid,tableName}
  });
};
exports.findTableField =findTableField;
