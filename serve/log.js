//日志记录
const log4js = require('log4js');

log4js.configure({
    appenders: {
        info: { type: 'dateFile', filename: './logs/logs' , pattern: 'yyyy-MM-dd-info.log', "alwaysIncludePattern": true},
        error: { type: 'dateFile', filename: './logs/logs' , pattern: 'yyyy-MM-dd-err.log', "alwaysIncludePattern": true}
    },
    categories: {
        default: { appenders: ['info'], level: 'info' },
        error : {appenders: ['error'], level: 'error'}
    }
});

let logger_Info = log4js.getLogger(); //访问日志
let logger_Error = log4js.getLogger('error'); //错误日志
module.exports = {
    logger_Info, 
    logger_Error
}