var baseurl = "/mapper";

var   findAll = function () {
  return baseurl+"/findAll";
};
exports.findAll = findAll;

var   autoCreateMapper = function () {
  return baseurl+"/autoCreateMapper";
};
exports.autoCreateMapper = autoCreateMapper;

var   saveMappers = function () {
  return baseurl+"/saveMappers";
};
exports.saveMappers = saveMappers;

var   findMappersByDatabaseIdAndTableName = function (databaseId,tableName) {
  return baseurl+"/findMappersByDatabaseIdAndTableName?databaseId="+databaseId+"&tableName=" +tableName ;
};
exports.findMappersByDatabaseIdAndTableName = findMappersByDatabaseIdAndTableName;

var   findMapperById = function (id) {
  return baseurl+"/findMapperById?id="+id;
};
exports.findMapperById = findMapperById;

var   mapperTest = function () {
  return baseurl+"/mapperTest";
};
exports.mapperTest = mapperTest;

var   editMapper = function () {
  return baseurl+"/editMapper";
};
exports.editMapper = editMapper;

var   deleteMapper = function () {
  return baseurl+"/deleteMapper";
};
exports.deleteMapper = deleteMapper;

var   findMappersByDatabaseId = function (id) {
  return baseurl+"/findMappersByDatabaseId?databaseId="+id;
};
exports.findMappersByDatabaseId = findMappersByDatabaseId;


var   editResultColumnCUD = function () {
  return baseurl+"/editResultColumnCUD";
};
exports.editResultColumnCUD = editResultColumnCUD;


var   findResultColumnCUDByMapperId = function (mapperId) {
  return baseurl+"/findResultColumnCUDByMapperId?mapperId="+mapperId;
};
exports.findResultColumnCUDByMapperId = findResultColumnCUDByMapperId;
