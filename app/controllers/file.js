// const fileService = require('../service/fileService');

const {
    rename,
    mkdirsSync
} = require("../utils/basics")
const path = require("path")
const Busboy = require("Busboy")
const fs = require("fs")
const safetyType = require("../utils/safetyType")
const formidable = require('formidable')
const request = require('request')

// 上传文件存放根目录
const uploadPath = path.join(__dirname, '../../static/uploads/')
// fileModel 中 path 的路径 ；
const fileModelPathRoot = "/static/uploads/"

function uploadFile(files,fields,fileTypeParmas) {
    var promiseAll = [];
    files.forEach((v,k)=>{
        promiseAll.push(
            new Promise((resolve,reject)=>{
                    // 文件原名
                let name = v.name ,
                    // 转换后的文件名
                    transformName = rename(v.name) ,
                    // 文件类型对应的路径名称
                    fileType = fileTypeParmas[k] ,
                    filePath = path.join(uploadPath, fileType),
                    confirm = mkdirsSync(filePath);
                if (!confirm) {
                    return reject(new Error("创建文件或文件夹错误")) 
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
                        limit: fields.limit || 0,
                        path:`${fileModelPathRoot}${fileType}/${transformName}`, 
                        creator:fields.creator,
                        creatorId:fields.creatorId
                    })
                })
                fs.createReadStream(v.path).pipe(writeStream)
            })
        )
    })
    return Promise.all(promiseAll)
}

module.exports = (router) => {
    router.post('/fileupload', async function (ctx, next) {
        let option = {
            url:"http://localhost:8000/api/login/check",
            headers : {
                'Cookie':ctx.headers.cookie,
            }
        }
        var userInfo =await new Promise((resolve,reject)=>{
            request.post(option,(err,response,body)=>{
                if(err){
                    return reject(err)
                }
                try {
                    body = JSON.parse(body)
                }catch(error){
                    return reject(error)

                }
                resolve(body)
            })
        })
        if(!userInfo || !userInfo.state === 1) return ctx.body = {state:0,msg:"参数错误"};
        console.log(userInfo)
        var result =await new Promise((resolve,reject)=>{
            var form = new formidable.IncomingForm({
                multiples : true
            });
            form.parse(ctx.req, function(err, fields, files) {
                if(err){
                    reject(err)
                }else {
                    resolve({fields, files})
                }
            });
        })
        let {files,fields} = result;
        files = files.file;
        if(files && !Array.isArray(files)){
            files = [files]
        }
        if(!files || !files.length) return ctx.body = {state:0,msg:"参数错误"};
        if(!fields.creator || !fields.creatorId || fields.creatorId !== userInfo._id) return ctx.body = {state:0,msg:"参数错误"};
        // 获取文件类型路径
        let fileTypeParmas = [];
        for(let i =0;i <files.length ; i ++){
            let flag = false;
            for(let j =0;j<safetyType.length;j++){
                if(files[i].type ===safetyType[j].type){
                    fileTypeParmas.push(safetyType[j].fileType)
                    flag = true ;
                    break ;
                }
            }
            if(!flag) {
                return ctx.body = {state:0,msg:"上传文件格式错误"}
            }
        }
        var data =await uploadFile(files,fields,fileTypeParmas);
        ctx.body = {state:0,msg:"上传文件格式错误",data}
    });

}