import  Api from './api.js'



export function systemApi({url,method,data}) {

  if(!method || method === "get"){
    return Api.get({url,method,data})
  }else{
    return Api.post({url,method,data})
  }
}
