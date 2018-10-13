
const request = require('request')
const bodyParser = require('koa-bodyparser')();
const config = require("../../config/index")
const {
    uploadFile,
    parseFormData
} = require("../utils/basics")
const {
    isNumber
} = require("../utils/is")
const safetyType = require("../utils/safetyType")
const fileService = require('../service/fileService');

let blogUrl = `${config.blogUrl}/api/login/check`;
module.exports = (router) => {
    router.post('/fileupload', async function (ctx, next) {
        // let option = {  
        //     url:blogUrl,
        //     headers : {
        //         'Cookie':ctx.headers.cookie,
        //     }
        // }
        // var userInfo =await new Promise((resolve,reject)=>{
        //     request.post(option,(err,response,body)=>{
        //         if(err)return reject(err)

        //         try { body = JSON.parse(body) }
        //         catch(error){ return reject(error)}

        //         resolve(body)
        //     })
        // })
        // if(!userInfo || !userInfo._id) return ctx.body = {state:0,msg:"参数错误"};
        let result = await parseFormData(ctx);
        let {files,fields} = result;
        files = files.file;
        if(files && !Array.isArray(files)){
            files = [files]
        }
        if(!files || !files.length) return ctx.body = {state:0,msg:"参数错误"};
        if(!fields.creator || !fields.creatorId ) return ctx.body = {state:0,msg:"参数错误"};
        // 获取文件类型路径
        let fileTypeParmas = [];
        for(let i =0;i <files.length ; i ++){
            let flag = false;
            for(let j =0;j<safetyType.length;j++){
                if(files[i].type ===safetyType[j].mimeType){
                    fileTypeParmas.push(safetyType[j].fileType)
                    flag = true ;
                    break ;
                }
            }
            if(!flag) {
                return ctx.body = {state:0,msg:"上传文件格式错误"}
            }
        }
        let data =await uploadFile(files,fields,fileTypeParmas);

        await fileService.addUploadFiles(data) ;

        ctx.body = {state:1,msg:"文件上传成功"};

    });

    router.post("/file/:type",bodyParser,async function(ctx , next){
        var type = ctx.params ;
        // {"page":1,"pageSize":10}
        let {page,pageSize} = ctx.request.body ;
        if(!isNumber(page) || !isNumber(pageSize)) return {state:0,msg:"参数错误"};
        let params = {page,pageSize};
        if(type){
            params.type = type
        }
        ctx.body = {state:1,msg:"文件上传成功"};
    })
}