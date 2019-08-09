const Koa = require('koa');
const cors = require('koa2-cors');//跨域
const koaBody = require('koa-body'); //处理Post请求
const router = require('./router.js'); //路由

const app = new Koa();
app.use(cors());
app.use(koaBody({
    multipart: true, //支持文件上传
    formidable: {
        maxFileSize: 2 * 1024 * 1024 //限制2M大小
    }
}))
app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);

