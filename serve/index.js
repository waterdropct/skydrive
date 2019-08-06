const Koa = require('koa');
const app = new Koa();

//该中间件用于post请求的数据
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

//引入路由
const router = require('./router.js');
app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);

