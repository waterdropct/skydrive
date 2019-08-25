const Koa = require('koa');
const cors = require('koa2-cors');//跨域
const koaBody = require('koa-body'); //处理Post请求
const router = require('./router.js'); //路由
const { logger_Error } = require('./log.js');

const app = new Koa();
//跨域配置
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(koaBody({
    multipart: true, //支持文件上传
    strict: false,  //如果为true，不解析GET,HEAD,DELETE请求
    formidable: {
        maxFileSize: 10 * 1024 * 1024 //限制10M大小
    }
}))
app.use(router.routes())
    .use(router.allowedMethods());
app.on('error', err => {
    //捕获全局错误，打印错误日志
    logger_Error.error(err);
})
app.listen(3000);

