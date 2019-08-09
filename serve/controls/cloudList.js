const fs = require('fs');
const path = require('path');
const { cloudlist } = require('../model.js'); //列表数据库

const findList = (parId) => {
    return new Promise((resolve, reject) => {
        cloudlist.find({ parId: parId }, (err, doc) => {
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
        cloudlist.update({ _id: { $in: idList } }, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};
//查找当前目录的所有文件和文件夹
const find = async (ctx) => {
    const parId = ctx.request.query.foldId;
    const doc = await findList(parId);
    ctx.status = 200;
    if (!doc) {
        ctx.body = {
            status: "error",
            message: "列表查询失败",
            data: []
        }
    } else {
        ctx.body = {
            status: "success",
            message: "列表查询成功",
            data: doc
        };
    }
};
//处理上传文件
const upload = async (ctx) => {
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    const filePath = path.resolve(__dirname, '..') + '/static/upload/';
    const fileName = Math.round(new Date().getTime() / 1000).toString() + encodeURI(file.name); //上传文件涉及到中文，需要编码;目前以时间戳前10位来区别同名文件
    const wirter = fs.createWriteStream(filePath + fileName);
    reader.pipe(wirter);
    const foldId = ctx.request.query.foldId;
    const newFile = {
        name: fileName,
        type: 'file',
        size: file.size,
        updateTime: new Date().getTime(),
        parId: foldId
    }
    let doc = await addList(newFile);
    ctx.status = 200;
    if (!doc) {
        ctx.body = {
            status: "error",
            message: "上传文件失败",
            data: []
        }
    } else {
        ctx.body = {
            status: "success",
            message: "上传文件成功",
            data: doc
        };
    }
};

module.exports = {
    find,
    upload
}