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

const randomUserAgent = () => {
    const userAgentList = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0",
        "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
        "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)",
        "Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
        "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1"
    ];
    const num = Math.floor(Math.random() * userAgentList.length);
    return userAgentList[num];
}

// static
const staticPath = path.join(__dirname, '../../static/')

// MD5 文件名
let rename = function (fileName, lmit = 0) {
    let str = crypto.createHash('md5').update(fileName + Date.now()).digest('hex') + '.' + getSuffix(fileName);
    return lmit + str
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


// 上传文件存放根目录
const uploadPath = path.join(staticPath, './uploads')
// fileModel 中 path 的路径 ；
const fileModelPathRoot = "/static/uploads/"
// 文件处理函数
function uploadFile(files, fields, fileTypeParmas) {
    var promiseAll = [],
        formatTimePath = formatTime(Date.now(), 2);
    files.forEach((v, k) => {
        promiseAll.push(
            new Promise((resolve, reject) => {
                // 文件原名
                let name = v.name,
                    // 转换后的文件名
                    transformName = rename(v.name, fields.limit),
                    // 文件类型对应的路径名称
                    fileType = fileTypeParmas[k],
                    filePath = path.join(uploadPath, formatTimePath, fileType),
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
                        mimeType: v.type,
                        fileType,
                        limit: fields.limit,
                        path: `${fileModelPathRoot}${formatTimePath}/${fileType}/${transformName}`,
                        creator: fields.creator,
                        creatorId: fields.creatorId,
                        createTime: Date.now()
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
// 随机挑选值
const randomData = (arr = [], len = 5) => {

    let l = arr.length;
    if (!l || l <= len) return arr;
    let obj = {};
    while (Object.keys(obj).length <= len) {
        var random = getRandom();
        obj[random] = random
    }
    return Object.keys(obj).map(v => arr[Number(v)])
}
// 获取整数随机值
// 取值范围为 min-max（取不到max哦）
const getRandom = (max = 100, min = 0) => {
    return Math.floor(Math.random() * max) + min
}

// 获取 GET 参数 

const getGatParmas = (function () {
    var num = /^\d+$/;
    var isBool = /^(true|false)$/
    var reg = /([A-Za-z0-9]+)=([A-Za-z0-9]+)&?/g
    var isParseStr = /^((([A-Za-z0-9]+)=([A-Za-z0-9]+)&?)+)$/
    return function (str) {
        var params = {}, result;
        if (!isParseStr.test(str)) return params
        while (result = reg.exec(str)) {
            let val = result[2];
            if (num.test(val)) {
                val = Number(val)
            } else if (isBool.test(val)) {
                if (val === "true") {
                    val = true
                } else {
                    val = false
                }
            }
            params[result[1]] = val
        }
        return params
    }
}())
module.exports = {
    staticPath,
    formatTime,
    rename,
    getSuffix,
    getName,
    mkdirsSync,
    uploadFile,
    parseFormData,
    randomUserAgent,
    randomData,
    getRandom,
    getGatParmas
}