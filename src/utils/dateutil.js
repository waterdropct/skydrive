const timeToString =  function(val){
    if(!val){
        return '-'
    }
    //只能是数字类型或者字符串类型的数字
    if(typeof val == 'number' || typeof val == 'string'){
        if(String(Number(val)) != "NaN"){
            let dateObj = new Date(Number(val));
            let res = {
                "y": dateObj.getFullYear(),
                "M": dateObj.getMonth()+1,
                "d": dateObj.getDate(),
                "h": dateObj.getHours(),
                "m": dateObj.getMinutes(),
                "s": dateObj.getSeconds()
            };
            return res.y + '-' + oneToTwo(res.M) + '-' + oneToTwo(res.d) + ' ' + oneToTwo(res.h) + ':' + oneToTwo(res.m) + ':' + oneToTwo(res.s)
        }
    }
}
const oneToTwo = function (val){
    if((val + '').length === 1){
        return '0' + val
    }
    return val
}
export {
    timeToString
}