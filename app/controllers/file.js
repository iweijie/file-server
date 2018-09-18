// const fileService = require('../service/fileService');

const { rename } = require("../utils/basics")
const path = require("path")
const Busboy = require("Busboy")
const fs = require("fs")

// 写入目录
const mkdirsSync = (dirname) => {
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

function uploadFile(ctx, options) {
    const _emmiter = new Busboy({ headers: ctx.req.headers })
    const fileType = options.fileType
    const filePath = path.join(options.path, fileType)
    const confirm = mkdirsSync(filePath)
    if (!confirm) {
        return
    }
    console.log('start uploading...')
    return new Promise((resolve, reject) => {
        _emmiter.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const fileName = rename(filename)
            const saveTo = path.join(path.join(filePath, fileName))
            file.pipe(fs.createWriteStream(saveTo))
            file.on('end', function () {
                console.log('end --- finished...')
                resolve({
                    imgPath: `/${fileType}/${fileName}`,
                    imgKey: fileName
                })
            })
        })

        _emmiter.on('finish', function () {
            console.log('finished...')
        })

        _emmiter.on('error', function (err) {
            console.log('err...')
            reject(err)
        })

        ctx.req.pipe(_emmiter)
    })
}

module.exports = (router) => {

    router.post('/fileupload', async function (ctx, next) {

        const serverPath = path.join(__dirname, '../../uploads/')
        // 获取上传文件
        const result = await uploadFile(ctx, {
            fileType: 'album',
            path: serverPath
        })
        ctx.body = { state: 1, msg: "上传成功", result }
    });

}
