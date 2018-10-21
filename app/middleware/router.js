const fs = require("fs")
const path = require("path")
const Router = require("koa-router")
const filerouter = require("./fileRouter")

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
    filerouter(app)
}