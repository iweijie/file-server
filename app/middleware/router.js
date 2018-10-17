const fs = require("fs")
const path = require("path")
const send = require("koa-send")
const Router = require("koa-router")

module.exports = (app, root = path.resolve(__dirname, "../controllers")) => {

    const router = new Router({
        prefix: `/api`
    });
    fs.readdirSync(root).forEach(filename => {
        let file = path.parse(filename);
        // logger.info('load router:', filename);
        if (file.ext.toLowerCase() !== '.js') return;
        require(`${root}/${file.name}`)(router);
        app.use(router.routes());
    });
    const routerStatic = new Router();
    routerStatic.get("/static/*",async (ctx,next)=>{
        console.log(ctx.path)
        console.log( __dirname + '../../../')
        await send(ctx, ctx.path, { 
            root: __dirname + '../../../' ,
            maxage:30*24*60*60*1000
        });
    })
    app.use(routerStatic.routes())
    
}