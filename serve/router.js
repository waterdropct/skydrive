const Router = require('koa-router');
const { login } = require('./controls/user.js');
const { checkToken } = require('./controls/token.js');
const { findList, uploadFile, addFold, deletefile } = require('./controls/cloudList.js');

const router = new Router();
router.post('/api/userlogin', login); //登陆
router.post('/api/uploadfile', checkToken, uploadFile) //文件上传
router.post('/api/addfold', checkToken, addFold) //新建文件夹
router.get('/api/cloudlist', checkToken, findList); //获取列表
router.post('/api/deletelist', checkToken, deletefile) //删除文件或文件夹
module.exports = router