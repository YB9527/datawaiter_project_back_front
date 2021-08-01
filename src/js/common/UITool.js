//import { MessageBox, Message } from 'element-ui'

var self = "";
var setSelf = function (that) {

  self = that;
};
exports.setSelf = setSelf;

var getType = function (typecode) {

  switch (typecode) {
    case 1000:
      typecode = "success";
      break;
  }
  return typecode;
};
exports.getType = getType;

var loadingpo = {};
var loading;
/**
 *显示 loading
 * @param self
 * @param tag 相当于
 */
var loading = function ({text = "加载中...", lock = true, spinner = 'el-icon-loading', target = "app", background, id}) {

  let load = self.$loading({
    lock: true,
    text: text,
    spinner: spinner,
    target: document.getElementById(target),
    background: background
  });
  if (id) {
    loadingpo[id] = load;
  } else {
    loading = load;
  }
  return load;
};
exports.loading = loading;
/**
 * 关闭loading
 * @param po
 */
var closeLoading = function ({id}) {
  let load = loading;
  if (id) {
    load = loadingpo[id];
  }
  if (load) {
    load.close();
  }
};
exports.closeLoading = closeLoading;

var messageBox = function ({message, type = "info"}) {
  type = getType(type);
  self.$message({
    showClose: true,
    message: message,
    type: type
  });
};
exports.messageBox = messageBox;


var notify = function ({title, message, type = "info", offset = 100, showClose, position, duration = 2000}) {
  type = getType(type);
  self.$notify({
    title: title,
    message: message,
    offset: offset,
    type: type,
    position: position,
    duration: duration
  });

};
exports.notify = notify;

var confirm = function ({title, message, type = "info",callback}) {
  type = getType(type);
  self.$confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: type
  }).then(() => {
    callback(true);
  }).catch(() => {
    callback(false);
  });
};
exports.confirm = confirm;
