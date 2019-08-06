const jwt = require('jsonwebtoken');//token中间件
//创建token
const createToken = user => {
    const token = jwt.sign(
        {
            user: user, iat: Math.floor(Date.now() / 1000) - 30
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
    const authToken = ctx.get('skyAuth');
    if (!authToken) {
        ctx.throw(401, 'failed Auth');
    }
    const token = authToken.slice(3);
    try {
        await jwt.verify(token, 'skydrivelhc'); //如果校验不通过，会抛出异常
    } catch (err) {
        ctx.throw(401, 'failed Auth');
    }
    await next();
}

module.exports = {
    createToken,
    checkToken
}