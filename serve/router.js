const Router = require('koa-router');
const { login, register } = require('./controls/user.js');
const { checkToken } = require('./controls/token.js');
const { findList, uploadFile, addFold, deletefile, movefile, updatefile, downloadfile } = require('./controls/cloudList.js');
const { logging } = require('./controls/logging.js');

const router = new Router();
router.post('/api/userlogin', login, logging); //登陆
router.post('/api/userregister', register, logging); //注册
router.post('/api/uploadfile', uploadFile, checkToken, logging) //文件上传
router.post('/api/addfold', addFold, checkToken, logging) //新建文件夹
router.get('/api/cloudlist', findList, checkToken, logging); //获取列表
router.post('/api/deletelist', deletefile, checkToken, logging) //删除文件或文件夹
router.post('/api/movelist', movefile, checkToken, logging) //移动文件或文件夹
router.post('/api/updatefile', updatefile, checkToken, logging) //修改名称
router.get('/api/downloadfile', downloadfile, checkToken, logging) //下载文件
module.exports = router