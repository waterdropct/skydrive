const sha1 = require('sha1'); //用于密码加密
const { user } = require('../model.js').user; //数据库
const { createToken } = require('./token.js'); //操作token

//数据库中匹配用户名
const findUser = (username) => {
    return new Promise((resolve, reject) => {
        user.findOne({ username }, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};
//登录
const login = async (ctx, next) => {
    //拿到账号和密码
    let username = ctx.request.body.name;
    let password = sha1(ctx.request.body.pwd);

    let doc = await findUser(username);
    if (!doc) {
        ctx.status = 200;
        ctx.body = {
            success: false,
            message: "用户不存在"
        }
    } else if (doc.password !== password) {
        ctx.status = 200;
        ctx.body = {
            success: false,
            message: "用户密码错误"
        };
    } else {
        //生成新的token
        const token = createToken(username);
        ctx.status = 200;
        ctx.body = {
            success: true,
            token
        };
    }
};

module.exports = {
    login
}