const Router = require('koa-router');
const { login } = require('./controls/user.js');
const { checkToken } = require('./controls/token.js');

const router = new Router();
router.post('userlogin', login); //登陆
router.post('cloudlist', checkToken); //获取列表
module.exports = router