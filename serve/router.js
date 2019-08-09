const Router = require('koa-router');
const { login } = require('./controls/user.js');
const { checkToken } = require('./controls/token.js');
const { find, upload } = require('./controls/cloudList.js');

const router = new Router();
router.post('/api/userlogin', login); //登陆
router.post('/api/upload', checkToken, upload) //处理文件上传
router.get('/api/cloudlist', checkToken, find); //获取列表
module.exports = router