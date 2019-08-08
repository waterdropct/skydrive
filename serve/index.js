const Koa = require('koa');
const cors = require('koa2-cors');//跨域
const bodyParser = require('koa-bodyparser');//该中间件用于post请求的数据
const router = require('./router.js'); //路由

const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);

