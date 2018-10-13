const Koa = require('koa')
const cors = require('koa2-cors');
const config = require("./config/index")
const error = require("./app/middleware/error")
const router = require("./app/middleware/router")
const etag = require('koa-etag')();
const path = require("path");
const app = new Koa()

require("./app/models");
// 错误处理
app.use(error)
// 跨域处理
app.use(cors({
	origin: function (ctx) {
		if (config.isProduction) {
			if (/^https:\/\/www\.iweijie\.cn.*$/.test(ctx.origin)) {
				return "https://www.iweijie.cn"
			}
			if (/^http:\/\/file\.iweijie\.cn.*$/.test( ctx.origin)) {
				return "http://file.iweijie.cn"
			}
			return false;
		} else {
			return ctx.origin;
		}
	},
	// exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
	maxAge: 5,
	credentials: true,
	allowMethods: ['POST', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(etag)
// 引入路由
router(app)

app.use(async (ctx) => {
	ctx.body = { state: 2, msg: "Not Find" };
})

app.listen(config.port)

process.on('unhandledRejection', (err) => {
	console.log("unhandledRejection",err)
	console.log("111111111111111")
	// logger.fatal(`unhandledRejection: ${err.message}, stack: ${err.stack}`);
});

process.on('uncaughtException', (err) => {
	console.log("uncaughtException",err)
	// logger.fatal(`uncaughtException: ${err.message}, stack: ${err.stack}`);
});