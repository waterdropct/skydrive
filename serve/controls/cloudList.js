const fs = require('fs');
const path = require('path');
const { cloudlist } = require('../model.js'); //列表数据库
//查询符合条件的数据
const queryList = (queryObj) => {
    return new Promise((resolve, reject) => {
        cloudlist.find(queryObj, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};
//当前目录新增文件或者文件夹
const addList = (file) => {
    return new Promise((resolve, reject) => {
        var newData = new cloudlist(file);
        newData.save((err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    })
};
//更新文件夹或者文件名称
const updateList = (file) => {
    return new Promise((resolve, reject) => {
        cloudlist.update({ _id: file._id }, { $set: { name: file.name } }, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};
//删除一个或多个文件夹或者文件
const deleteList = (idList) => {
    return new Promise((resolve, reject) => {
        cloudlist.remove({ _id: { $in: idList } }, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};
//校验文件或者文件夹是否同名的情况
const validSameName = async (validVal) => {
    let isExit = await queryList(validVal);
    if(isExit && isExit.length > 0){
        return {
            status: "error",
            message: "名称已存在,不可重复",
            data: []
        }
    }else{
        return null
    }
}
//查找当前目录的所有文件和文件夹
const findList = async (ctx) => {
    const query = ctx.request.query;
    let doc = [];
    if('foldId' in query){
        doc = await queryList({parId: query.foldId});
    }
    if('foldall' in query){
        doc = await queryList({type: 'folder'});
    }
    ctx.status = 200;
    ctx.body = {
        status: doc ? "success" : "error",
        message: doc ? "" : "列表数据查询失败",
        data: doc || []
    }
};
//处理上传文件
const uploadFile = async (ctx) => {
    const file = ctx.request.files.file;
    //校验数据库中是否已存在同名
    let validRes = await validSameName({parId: ctx.request.body.foldId, name: new RegExp('\\d{10}' + encodeURI(file.name)), type: 'file'});
    if(validRes){
        ctx.body = validRes;
        return
    }
    const reader = fs.createReadStream(file.path);
    const filePath = path.resolve(__dirname, '..') + '/static/upload/';
    const fileName = Math.round(new Date().getTime() / 1000).toString() + encodeURI(file.name); //上传文件涉及到中文，需要编码;目前以时间戳前10位来区别同名文件
    const wirter = fs.createWriteStream(filePath + fileName);
    reader.pipe(wirter);
    const newFile = {
        name: fileName,
        type: 'file',
        size: file.size,
        updateTime: new Date().getTime(),
        parId: ctx.request.body.foldId,
        pathRoot: ctx.request.body.pathRoot.split(",")
    }
    let doc = await addList(newFile);
    ctx.status = 200;
    ctx.body = {
        status: doc ? "success" : "error",
        message: doc ? "上传文件成功" : "上传文件失败",
        data: doc || []
    }
};
//新建文件夹
const addFold = async (ctx) => {
    const foldname = ctx.request.body.foldname;
    if(foldname && foldname.match(/^[(\u4e00-\u9fa5)|(a-zA-Z0-9)]+$/)){ //为保证可靠性后台需要校验
        //校验数据库中是否已存在同名
        let validRes = await validSameName({parId: ctx.request.body.parId, name: foldname, type: 'folder'});
        if(validRes){
            ctx.body = validRes;
            return
        }
        const newFold = {
            name: foldname,
            type: 'folder',
            size: '-',
            updateTime: new Date().getTime(),
            parId: ctx.request.body.parId,
            pathRoot: ctx.request.body.pathRoot
        }
        let doc = await addList(newFold);
        ctx.status = 200;
        ctx.body = {
            status: doc ? "success" : "error",
            message: doc ? "新建文件夹成功" : "新建文件夹失败",
            data: doc || []
        }
    }else{
        ctx.status = 400;
        ctx.body = {
            status: "error",
            message: "文件夹名称不能为空",
            data: []
        }
    }
};
//删除文件或者文件夹
const deletefile = async (ctx) => {
    //查找当前目录的删除内容 -- 查找当前目录被删除目录的所有后代文件和文件夹
    let doc = await queryList({$or: [{_id: {$in: ctx.request.body.deletelist}},{pathRoot: { $in: ctx.request.body.deletelist}}]});
    ctx.status = 200;
    if (!doc) {
        ctx.body = {
            status: "error",
            message: "操作失败",
            data: []
        }
    } else {
        let filesArr = []; //删除文件则需要移除磁盘文件
        let mapId = doc.map(item => {
            if(item.type == "file"){
                filesArr.push(item.name);
            }
            return item._id
        })
        //磁盘删除文件
        const filePath = path.resolve(__dirname, '..') + '/static/upload/';
        filesArr.forEach(item => {
            fs.unlink(filePath + item, function(error){
                if(error){
                    //删除磁盘文件失败不会影响接口返回，只需记录日志即可
                }
            })
        })
        doc = await deleteList(mapId);
        ctx.body = {
            status: doc ? "success" : "error",
            message: doc ? "删除成功" : "删除失败",
            data: doc || []
        }
    }
};

module.exports = {
    findList,
    uploadFile,
    addFold,
    deletefile
}