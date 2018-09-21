const config = require("../../config/index")
const fileModel = require("../models/file")

const file = {
    /*
    * 存储上传文件信息
    * @param {Array}       
    * @return {Promise} Promise 对象
    */
    addUploadFiles : ( arr = [])=>{
        var promiseAll = []
        arr.forEach(v=>{
            let instance = new fileModel(v)
            promiseAll.push(
                instance.save()
            )
        })
        return Promise.all(promiseAll)
    },
    /*
    * 
    * @param {Object}  参数信息对象 
    * @return {Promise} Promise 对象
    */
    getUploadFilesList : (params)=>{

    },
    getArticleList: (id, page, pageSize, userId) => {
        if (userId) {
            return articleModel.find(
                { "$or": [{ classify: id, ispublic: true }, { classify: id, autor: userId }] },
                "title description classify createTime autor time",
                { skip: (page - 1) * pageSize, limit: pageSize }
            )
                .populate({
                    path: "autor",
                    select: "name"
                })
                .sort({ "createTime": -1 })
                .exec()

        } else {
            return articleModel.find(
                { classify: id, ispublic: true },
                "title description classify createTime autor time",
                { skip: (page - 1) * pageSize, limit: pageSize }
            )
                .populate({
                    path: "autor",
                    select: "name"
                })
                .sort({ "createTime": -1 })
                .exec()
        }
    },
}

module.exports = file