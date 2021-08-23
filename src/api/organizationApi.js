import  Api from './api.js'
import  FJApi from './fjApi.js'
const baseurl  ="/organization/";


var edit = function(postion) {
  return Api.post({
    url:baseurl+"edit",
    data:postion,
  });
};
exports.edit =edit;


var findByProjectid = function(projectid) {
  return Api.get({
    url:baseurl+"findByProjectid",
    data:{projectid},
  });
};
exports.findByProjectid =findByProjectid;

var deleteOrganization = function(organization) {
  return Api.post({
    url:baseurl+"delete",
    data:organization,
  });
};
exports.deleteOrganization =deleteOrganization;
