const Router = require('koa-router');
const { login } = require('./controls/user.js');
const { checkToken } = require('./controls/token.js');
const { find } = require('./controls/cloudList.js');

const router = new Router();
router.post('/api/userlogin', login); //登陆
router.get('/api/cloudlist', checkToken, find); //获取列表
module.exports = router