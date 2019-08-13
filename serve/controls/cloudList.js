const fs = require('fs');
const path = require('path');
const { cloudlist } = require('../model.js'); //列表数据库

const queryList = (parId) => {
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
        cloudlist.remove({ _id: { $in: idList } }, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};
//查找当前目录的所有文件和文件夹
const findList = async (ctx) => {
    const parId = ctx.request.query.foldId;
    const doc = await queryList(parId);
    ctx.status = 200;
    if (!doc) {
        ctx.body = {
            status: "error",
            message: "列表数据查询失败",
            data: []
        }
    } else {
        ctx.body = {
            status: "success",
            message: "",
            data: doc
        };
    }
};
//处理上传文件
const uploadFile = async (ctx) => {
    const file = ctx.request.files.file;
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
        parId: ctx.request.body.foldId
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
//新建文件夹
const addFold = async (ctx) => {
    const foldname = ctx.request.body.foldname;
    const parId = ctx.request.body.parId;
    if(foldname && foldname.match(/^[(\u4e00-\u9fa5)|(a-zA-Z0-9)]+$/)){ //为保证可靠性后台需要校验
        const newFold = {
            name: foldname,
            type: 'folder',
            size: '-',
            updateTime: new Date().getTime(),
            parId: parId
        }
        let doc = await addList(newFold);
        ctx.status = 200;
        if (!doc) {
            ctx.body = {
                status: "error",
                message: "新建文件夹失败",
                data: []
            }
        } else {
            ctx.body = {
                status: "success",
                message: "新建文件夹成功",
                data: doc
            };
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
    let doc = await deleteList(ctx.request.body.deletelist || []);
    ctx.status = 200;
    if (!doc) {
        ctx.body = {
            status: "error",
            message: "删除失败",
            data: []
        }
    } else {
        ctx.body = {
            status: "success",
            message: "删除成功",
            data: []
        };
    }
};

module.exports = {
    findList,
    uploadFile,
    addFold,
    deletefile
}