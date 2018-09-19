var crypto = require('crypto');
var path = require('path');
var fs = require('fs');

// MD5 文件名
let rename = function(fileName) {
    return crypto.createHash('md5').update(fileName + Date.now()).digest('hex') + '.' + getSuffix(fileName);
};
// 获取文件 扩展名
let getSuffix = function(fileName) {
  return fileName.split('.').pop()
}
// 获取文件名
let getName = function(fileName) {
  return fileName.split('.').unshift()
}
// 写入目录
let mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
      return true
  } else {
      if (mkdirsSync(path.dirname(dirname))) {
          fs.mkdirSync(dirname)
          return true
      }
  }
  return false
}
module.exports = {
  rename,
  getSuffix,
  getName,
  mkdirsSync
}