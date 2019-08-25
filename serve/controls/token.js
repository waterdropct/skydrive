const jwt = require('jsonwebtoken');//token中间件
//创建token
const createToken = user => {
    const token = jwt.sign(
        {
            user: user
        },
        'skydrivelhc',
        {
            expiresIn: '10m'
        }
    );
    return token;
}
//校验token
const checkToken = async (ctx, next) => {
    await next();
    const authToken = ctx.get('skyAuth') || ctx.request.query.skyAuth;
    if (!authToken) {
        ctx.status = 401;
        ctx.body = {
            status: "error",
            message: "身份认证失败"
        };
        return
    }
    const token = authToken.slice(3);
    try {
        await jwt.verify(token, 'skydrivelhc'); //如果校验不通过，会抛出异常
    } catch (err) {
        ctx.status = 401;
        ctx.body = {
            status: "error",
            message: "身份认证失败"
        };
        return
    }
}

module.exports = {
    createToken,
    checkToken
}