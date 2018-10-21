const {
    uploadFile,
    parseFormData,
    getGatParmas
} = require("../utils/basics")
const {
    isNumber
} = require("../utils/is")
const safetyType = require("../utils/safetyType")
const fileService = require('../service/fileService');
module.exports = (router) => {
    router.post('/fileupload', async function (ctx, next) {
        let result = await parseFormData(ctx);
        let {files,fields} = result;
        files = files.file;
        if(files && !Array.isArray(files)){
            files = [files]
        }
        if(!files || !files.length) return ctx.body = {state:0,msg:"参数错误"};
        if(!fields.creator || !fields.creatorId ) return ctx.body = {state:0,msg:"参数错误"};
        if(fields.limit === undefined || !isNumber(fields.limit) || fields.limit > 2 || fields.limit < 0){
            fields.limit = 0
        }
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

    router.get("/file/:type",async function(ctx , next){
        let type = ctx.params ;
        let getParams = getGatParmas(ctx.querystring)
        // {"page":1,"pageSize":10}
        let {page,pageSize,userId} = getParams;
        if(!type ||!isNumber(page) || !isNumber(pageSize)) return {state:0,msg:"参数错误"};
        let params = {page,pageSize,type};
        if(userId){
            params.userId = userId
        }
        let result = await fileService.getUploadFilesList(params);
        ctx.body = {state:1,result:result[0],count:result[1]};
    })
}