var crypto = require('crypto');

let rename = function(fileName) {
    return crypto.createHash('md5').update(fileName + Date.now()).digest('hex') + '.' + getSuffix(fileName);
};

let getSuffix = function(fileName) {
  return fileName.split('.').pop()
}
module.exports = {
  rename
}