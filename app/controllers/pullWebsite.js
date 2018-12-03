
const request = require('request')
const fs = require("fs")
const path = require("path")

const {
    randomUserAgent,
    mkdirsSync,
    staticPath,
    randomData
} = require("../utils/basics")

const { images } = require("../utils/imageSource")
// 数据来源
let imageData = {
    default:[{id:"10694",w:"1920",h:"1080",exn:"jpg"}]
}

// 图片存放路径
let imageJsonPath = path.join(staticPath,"./imageJson");

module.exports = (router) => {
    router.get('/pullwebsite', async function (ctx, next) {
        let confirm = mkdirsSync(imageJsonPath);
        if (!confirm) {
          return new Error("创建文件夹错误")
        }
        let err = [] ;
        for (var i = 0; i < images.length; i++) {
            let key = images[i].key ;
            let option = {
                url: images[i].url + Date.now(),
                headers: {
                    "Referer": `https://bz.tczmh.club/classify.jsp?class=${key}`,
                    "User-Agent": randomUserAgent(),
                }
            }
            var result = await new Promise((resolve, reject) => {
                let savePath = path.join(imageJsonPath,`./${key}.json`)
                request.get(option, (err, response, body) => {
                    if (err) return resolve({state:0,err})
                    try {
                        fs.writeFileSync(savePath,body)
                        imageData[key] = JSON.parse(body).slice(0,100)
                    }catch(err){
                        return  resolve({state:0,err})
                    }
                    resolve({state:1})
                })
            })
        }
        ctx.body = { state: 1, msg: "文件获取成功" };

    });
    router.get('/recommend/image/:id', async function (ctx, next) {
        var id = ctx.params.id;
        // 在服务器重启的情况下
        let data ;
        if(!imageData[id]){
            let flag = null;
            for(var i=0;i<images.length;i++){
                if(images[i].key === id){
                    flag = i ;
                    break;
                }
            }
            if(flag){
                let current = path.join(imageJsonPath,`./${images[i].key}.json`);
                try {
                    fs.accessSync(current)
                    imageData[id] = data = JSON.parse(fs.readFileSync(current)).slice(0,100)
                }catch(err){
                    data = imageData.default
                }
            }else {
                data = imageData.default
            }
        }else {
            data = imageData[id]
        }
        
        let newData = randomData(data);
            result = newData.map(v=>{
                return {
                    w:v.w,
                    h:v.h,
                    smallUrl:`https://alpha.wallhaven.cc/wallpapers/thumb/small/th-${v.id}.${v.exn}`,
                    fullUrl:`https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-${v.id}.${v.exn}`
                }
            })
        ctx.body = {state:1,result}
    });
}
