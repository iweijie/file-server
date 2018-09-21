var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
const formidable = require('formidable');

// 时间格式化
var formatTime = function (timestamp, flag = 0, separator = "-") {
  var date = new Date(timestamp)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  var h = date.getHours()
  var min = date.getMinutes()
  if (m < 10) {
    m = '0' + m
  }
  if (d < 10) {
    d = '0' + d
  }
  if (h < 10) {
    h = '0' + h
  }
  if (min < 10) {
    min = '0' + min
  }
  if (flag === 2) {
    return y + separator + m;
  } else if (flag === 1) {
    return y + separator + m + separator + d + ' ' + h + ':' + min
  }
  return y + separator + m + separator + d;
}

// 上传文件存放根目录
const uploadPath = path.join(__dirname, '../../static/uploads/')
// fileModel 中 path 的路径 ；
const fileModelPathRoot = "/static/uploads/"

// MD5 文件名
let rename = function (fileName) {
  return crypto.createHash('md5').update(fileName + Date.now()).digest('hex') + '.' + getSuffix(fileName);
};
// 获取文件 扩展名
let getSuffix = function (fileName) {
  return fileName.split('.').pop()
}
// 获取文件名
let getName = function (fileName) {
  return fileName.split('.').unshift()
}
// 写入目录
let mkdirsSync = (dirname) => {
  try {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
    return false
  } catch (err) {
    throw err
  }
}
// 文件处理函数
function uploadFile(files, fields, fileTypeParmas) {
  var promiseAll = [],
      formatTimePath = formatTime(Date.now(),2);
  files.forEach((v, k) => {
    promiseAll.push(
      new Promise((resolve, reject) => {
        // 文件原名
        let name = v.name,
          // 转换后的文件名
          transformName = rename(v.name),
          // 文件类型对应的路径名称
          fileType = fileTypeParmas[k],
          filePath = path.join(uploadPath,formatTimePath, fileType),
          confirm = mkdirsSync(filePath);
        if (!confirm) {
          return reject(new Error("创建文件或文件夹错误"))
        }
        // 保存的路径
        let saveTo = path.join(filePath, transformName);
        const writeStream = fs.createWriteStream(saveTo);

        writeStream.on("error", function (err) {
          reject(err)
        })
        writeStream.on("finish", function () {
          resolve({
            name,
            mimeType: v.mimeType,
            fileType,
            limit: fields.limit || 0,
            path: `${fileModelPathRoot}${fileType}/${formatTimePath}/${transformName}`,
            creator: fields.creator,
            creatorId: fields.creatorId
          })
        })
        fs.createReadStream(v.path).pipe(writeStream)
      })
    )
  })
  return Promise.all(promiseAll)
}

// 解析
function parseFormData(ctx) {
  return new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm({
      multiples: true
    });
    form.parse(ctx.req, function (err, fields, files) {
      if (err) {
        reject(err)
      } else {
        resolve({
          fields,
          files
        })
      }
    });
  })
}

module.exports = {
  formatTime,
  rename,
  getSuffix,
  getName,
  mkdirsSync,
  uploadFile,
  parseFormData
}