const sha1 = require('sha1'); //用于密码加密
const { user } = require('../model.js'); //用户数据库
const { createToken } = require('./token.js'); //操作token

//数据库中匹配用户名
const findUser = (username) => {
    return new Promise((resolve, reject) => {
        user.findOne({ name: username }, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};
//添加账号密码专用操作
// const addUser = (name, pwd) => {
//     var newData = new user({name: name, pwd: pwd, createTime: new Date().getTime()});
//     newData.save(function(){});
// }
//登录
const login = async (ctx) => {
    //拿到账号和密码
    const username = ctx.request.body.name;
    const password = sha1(ctx.request.body.pwd);
    //addUser(username, password);
    const doc = await findUser(username);
    ctx.status = 200;
    if (!doc) {
        ctx.body = {
            status: "error",
            message: "用户不存在"
        }
    } else if (doc.pwd !== password) {
        ctx.body = {
            status: "error",
            message: "用户密码错误"
        };
    } else {
        //生成新的token
        const token = createToken(username);
        ctx.body = {
            status: "success",
            message: "登陆成功",
            token,
        };
    }
};

module.exports = {
    login
}