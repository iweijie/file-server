const path = require("path")
const send = require("koa-send")
const Router = require("koa-router")
const request = require('request')
const fileService = require('../service/fileService')
const { blogUrl } = require("../../config/index")

module.exports = (app) => {
    const routerStatic = new Router();
    const staticFilePath = path.resolve(__dirname, "../../")
    const checkLoginUrl = `${blogUrl}/api/login/check`;
    const getUserInfo = async function (ctx) {
        let option = {
            url: checkLoginUrl,
            headers: {
                "Referer": `https://www.iweijie.cn/`,
                "Cookie": ctx.headers.cookie
            }
        }
        return await new Promise((resolve, reject) => {
            request.post(option, (err, response, body) => {
                if (err) return resolve({ state: 0, err })
                try {
                    resolve(JSON.parse(body))
                } catch (err) {
                    resolve({ state: 0, err })
                }
            })
        })
    }
    routerStatic.get("/static/*", async (ctx, next) => {
        console.log("static")
        try {
            let params = /^.+?\/((\d)[a-z0-9]+)\.[a-z]+$/.exec(ctx.path);
            if (params && params[1] && params[2]) {
                let limit = Number(params[2]), result;
                if (limit === 1) {
                    result = await getUserInfo(ctx);
                    if (!result || result.state !== 1) {
                        ctx.status = 404
                        ctx.body = ""
                        return
                    }
                } else if (limit === 2) {
                    result = await Promise.all([
                        getUserInfo(ctx),
                        fileService.findFileInfo({ path: ctx.path })
                    ])
                    let userInfo = result[0]
                    let fileInfo = result[1]
                    if (!userInfo || !fileInfo || userInfo._id !== fileInfo.creatorId) {
                        ctx.status = 404
                        ctx.body = ""
                        return
                    }
                }
                return await send(ctx, ctx.path, {
                    root: staticFilePath,
                    maxage: 30 * 24 * 60 * 60 * 1000
                })
            } else {
                ctx.status = 404
                ctx.body = ""
            }
        } catch (err) {
            console.log("static",err)
            ctx.status = 404
            ctx.body = ""
        }
    })
    app.use(routerStatic.routes())

}