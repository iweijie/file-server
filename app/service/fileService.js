const config = require("../../config/index")
const fileModel = require("../models/file")

const file = {
    /*
    * 存储上传文件信息
    * @param {Array}       
    * @return {Promise} Promise 对象
    */
    addUploadFiles: (arr = []) => {
        var promiseAll = []
        arr.forEach(v => {
            let instance = new fileModel(v)
            promiseAll.push(
                instance.save()
            )
        })
        return Promise.all(promiseAll)
    },
    /*
    * 获取文件列表
    * @param {Object}  参数信息对象 
    * @return {Promise} Promise 对象
    */
    getUploadFilesList: ({ type, page, pageSize, userId }, field = "name fileType path creator createTime") => {
        let query = {}
        if (userId) {
            query = {
                "$or": [
                    { fileType: type, limit: 0 },
                    { fileType: type, limit: 1 },
                    { fileType: type, creatorId: userId, limit: 2 },
                ]
            }

        } else {
            query = {
                fileType: type, limit: 0
            }
        }
        return Promise.all([
            articleModel.find(
                query,
                field,
                { skip: (page - 1) * pageSize, limit: pageSize }
            )
                .sort({ "createTime": -1 })
                .exec()
            ,
            articleModel.countDocuments(query)
        ])
    },
    /*
    * 存储上传文件信息
    * @param {Array}       
    * @return {Promise} Promise 对象
    */
    findFileInfo: (query) => {
        return fileModel.findOne(query)
    },
}

module.exports = file