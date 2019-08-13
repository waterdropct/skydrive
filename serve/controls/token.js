const jwt = require('jsonwebtoken');//token中间件
//创建token
const createToken = user => {
    const token = jwt.sign(
        {
            user: user, iat: Math.floor(Date.now() / 1000) - 30
        },
        'skydrivelhc',
        {
            expiresIn: 1000 * 60 * 10
        }
    );
    return token;
}
//校验token
const checkToken = async (ctx, next) => {
    const authToken = ctx.get('skyAuth');
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
    await next();
}

module.exports = {
    createToken,
    checkToken
}