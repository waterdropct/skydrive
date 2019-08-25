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
const updateList = (queryObj, updateObj) => {
    return new Promise((resolve, reject) => {
        cloudlist.update(queryObj, updateObj, {multi: true}, (err, doc) => {
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
const findList = async (ctx, next) => {
    await next();
    const query = ctx.request.query;
    const creator = ctx.get('authId').slice(3);
    let doc = [];
    if('foldId' in query){
        doc = await queryList({parId: query.foldId, creator});
    }
    if('foldall' in query){
        doc = await queryList({type: 'folder', creator});
    }
    ctx.status = 200;
    ctx.body = {
        status: doc ? "success" : "error",
        message: doc ? "" : "列表数据查询失败",
        data: doc || []
    }
};
//处理上传文件
const uploadFile = async (ctx, next) => {
    await next();
    const file = ctx.request.files.file;
    const creator = ctx.get('authId').slice(3);
    //校验数据库中是否已存在同名
    let validRes = await validSameName({parId: ctx.request.body.foldId, name: file.name, type: 'file', creator});
    if(validRes){
        ctx.body = validRes;
        return
    }
    const newFile = {
        name: file.name,
        type: 'file',
        size: file.size,
        updateTime: new Date().getTime(),
        parId: ctx.request.body.foldId,
        pathRoot: ctx.request.body.pathRoot.split(","),
        creator
    }
    let doc = await addList(newFile);
    ctx.status = 200;
    ctx.body = {
        status: doc ? "success" : "error",
        message: doc ? "上传文件成功" : "上传文件失败",
        data: doc || []
    }
    //存入磁盘
    if(doc){
        const reader = fs.createReadStream(file.path);
        const filePath = path.resolve(__dirname, '..') + '/static/upload/';
        const wirter = fs.createWriteStream(filePath + doc._id);
        reader.pipe(wirter); 
    }
};
//新建文件夹
const addFold = async (ctx, next) => {
    await next();
    const foldname = ctx.request.body.foldname;
    const creator = ctx.get('authId').slice(3);
    if(foldname && foldname.match(/^[(\u4e00-\u9fa5)|(a-zA-Z0-9)]+$/)){ //为保证可靠性后台需要校验
        //校验数据库中是否已存在同名
        let validRes = await validSameName({parId: ctx.request.body.parId, name: foldname, type: 'folder', creator});
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
            pathRoot: ctx.request.body.pathRoot,
            creator
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
const deletefile = async (ctx, next) => {
    await next();
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
                filesArr.push(item._id);
            }
            return item._id
        })
        doc = await deleteList(mapId);
        ctx.body = {
            status: doc ? "success" : "error",
            message: doc ? "删除成功" : "删除失败",
            data: doc || []
        }
        //磁盘删除文件
        const filePath = path.resolve(__dirname, '..') + '/static/upload/';
        filesArr.forEach(item => {
            fs.unlink(filePath + item, function(error){
                if(error){
                    //删除磁盘文件失败不会影响接口返回，只需记录日志即可
                }
            })
        })
    }
};
//移动文件或者文件夹
const movefile = async (ctx, next) => {
    await next();
    //改变当前移动内容的parId
    let doc1 = await updateList({_id: {$in: ctx.request.body.movelist}}, {$set: {parId: ctx.request.body.targetId}});
    ctx.status = 200;
    if (!doc1) {
        ctx.body = {
            status: "error",
            message: "移动操作失败",
            data: []
        }
        return
    }
    //改变当前移动内容及所有所有后代的pathRoot值
    const sliceIndex = ctx.request.body.curPath.length;
    const pathBef = ctx.request.body.targetPath.concat(ctx.request.body.targetId);
    let doc2 = await queryList({$or: [{_id: {$in: ctx.request.body.movelist}},{pathRoot: { $in: ctx.request.body.movelist}}]});
    let doc;
    for(let k = 0; k < doc2.length; k++){
        let item = doc2[k];
        item.pathRoot = pathBef.concat(item.pathRoot.slice(sliceIndex));
        //新增内容，如果有相同的_id就替换
        doc = await addList(item);
        if (!doc) {
            ctx.body = {
                status: "error",
                message: "移动部分内容失败",
                data: []
            }
            return
        }
    }
    ctx.body = {
        status: "success",
        message: "移动操作成功",
        data: []
    }
};
//修改名称
const updatefile = async (ctx, next) => {
    await next();
    //校验数据库中是否已存在同名
    const _id = ctx.request.body._id;
    const name = ctx.request.body.name;
    const type = ctx.request.body.type;
    let validRes = await validSameName({name, type});
    if(validRes){
        ctx.body = validRes;
        return
    }
    let doc = await updateList({_id}, {$set: {name, updateTime: new Date().getTime()}});
    ctx.status = 200;
    ctx.body = {
        status: doc ? "success" : "error",
        message: doc ? "更新名称成功" : "更新名称失败",
        data: doc || []
    }
};
//下载文件
const downloadfile = async (ctx, next) => {
    await next();
    ctx.status = 200;
    let doc = await queryList({_id: ctx.request.query.fileId});
    if(doc && doc.length > 0){
        const filePath = path.resolve(__dirname, '..') + '/static/upload/';
        const reader = fs.createReadStream(filePath + doc[0]._id);
        ctx.set('Content-disposition',`attachment;filename=${encodeURI(doc[0].name)}`); //涉及到中文需要编码
        ctx.body = reader // 返回在响应体里
        return
    }
    ctx.body = {
        status: "error",
        message: "文件不存在",
        data: []
    }
};

module.exports = {
    findList,
    uploadFile,
    addFold,
    deletefile,
    movefile,
    updatefile,
    downloadfile
}