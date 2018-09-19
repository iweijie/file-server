// const fileService = require('../service/fileService');

const {
    rename,
    mkdirsSync
} = require("../utils/basics")
const path = require("path")
const Busboy = require("Busboy")
const fs = require("fs")
const safetyType = require("../utils/safetyType")

// 上传文件存放根目录
const uploadPath = path.join(__dirname, '../../static/uploads/')
// fileModel 中 path 的路径 ；
const fileModelPathRoot = "/static/uploads/"

function uploadFile(files,parmas) {
    var promiseAll = [];
    files.forEach((v,k)=>{
        promiseAll.push(
            new Promise((resolve,reject)=>{
                    // 文件原名
                let name = v.name ,
                    // 转换后的文件名
                    transformName = rename(v.name) ,
                    // 文件类型对应的路径名称
                    fileType = parmas[k] ,
                    filePath = path.join(uploadPath, fileType),
                    confirm = mkdirsSync(filePath);
                if (!confirm) {
                    return
                }
                    // 保存的路径
                let saveTo = path.join(filePath ,transformName) ;
                const writeStream = fs.createWriteStream(saveTo);
                
                writeStream.on("error",function(err){
                    reject(err) 
                })
                writeStream.on("finish",function(){
                    resolve({
                        name,
                        transformName,
                        type: v.type,
                        limit: 0,
                        path:`${fileModelPathRoot}${fileType}/${transformName}`, 
                        // creator
                        // creatorId
                    })
                })
                v.pipe(writeStream)
            })
        )
    })
    return Promise.all(promiseAll)
    // return new Promise((resolve, reject) => {
    //         var fileList = [];
    //         _emmiter.on('finish', function () {
    //             console.log("_emmiter finish")
    //             resolve(fileList)
    //         })
    //         _emmiter.on('error', function (err) {
    //             console.log('err...')
    //             reject(err)
    //         })
    //         _emmiter.on('file', function (fieldname, file, filename, encoding, mimetype) {
    //             let isSafetyType;
    //             for(let i =0;i<safetyType.length;i++){
    //                 if(mimetype ===safetyType[i].type){
    //                     isSafetyType = i ;
    //                     break ;
    //                 }
    //             }
    //             if(isSafetyType === undefined ) return 
    //             const fileType = safetyType[isSafetyType].fileType ;
    //             const filePath = path.join(options.path, fileType)
    //             const confirm = mkdirsSync(filePath)
    //             if (!confirm) {
    //                 return
    //             }
    //             const transformName = rename(filename)
    //             const saveTo = path.join(path.join(filePath, transformName))
    //             const writeStream = fs.createWriteStream(saveTo)
    //             writeStream.on("error",function(err){
    //                 throw err
    //             })
    //             writeStream.on("finish",function(){
    //                 fileList.push({
    //                     name: filename,
    //                     transformName,
    //                     type: mimetype,
    //                     limit: 0,
    //                     path:`${fileModelPathRoot}${fileType}/${transformName}`, 
    //                     // creator
    //                     // creatorId
    //                 })
    //             })
    //             file.pipe(writeStream)
    //         })
    
    //         ctx.req.pipe(_emmiter)
    // })
    // .catch(err=>{
    //     console.log(err)
    //     throw err
    // })
}

module.exports = (router) => {

    router.post('/fileupload', async function (ctx, next) {
        const files = ctx.request.files && ctx.request.files.file;
        if(!files || !files.length) return ctx.body = {state:0,msg:"未上传文件"};
        console.log(files)
        // 获取文件类型路径
        let parmas = [];
        for(let i =0;i <files.length ; i ++){
            let flag = false;
            for(let j =0;j<safetyType.length;j++){
                if(files[i].type ===safetyType[j].type){
                    parmas.push(safetyType[j].fileType)
                    flag = true ;
                    break ;
                }
            }
            if(!flag) {
                return ctx.body = {state:0,msg:"上传文件格式错误"}
            }
        }
        // 获取上传文件
        const result = await uploadFile(files,parmas);
        ctx.body = {
            state: 1,
            msg: "上传成功",
            // result
        }
    });

}