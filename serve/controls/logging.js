const { logger_Info } = require('../log.js');


//注册
const logging = async (ctx) => {
    logger_Info.info(ctx.request)
};

module.exports = {
    logging
}