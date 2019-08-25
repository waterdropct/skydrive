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
//添加账户
const addUser = (name, pwd) => {
    return new Promise((resolve, reject) => {
        var newData = new user({name: name, pwd: pwd, createTime: new Date().getTime()});
        newData.save((err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
}
//登录
const login = async (ctx, next) => {
    //拿到账号和密码
    const username = ctx.request.body.name;
    const password = sha1(ctx.request.body.pwd);
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
            data: {
                userName: doc.name,
                userId: doc._id,
                token
            }
        };
    }
    next();
};
//注册
const register = async (ctx, next) => {
    //拿到账号和密码
    const username = ctx.request.body.name;
    const password = sha1(ctx.request.body.pwd);
    let doc = await findUser(username);
    ctx.status = 200;
    if (!doc) {
        doc = addUser(username, password);
        ctx.body = {
            status: doc ? "success" : "error",
            message: doc ? "注册成功" : "注册失败"
        }
    }else{
        ctx.body = {
            status: "error",
            message: "用户已存在"
        };
    }
    next();
};

module.exports = {
    login,
    register
}