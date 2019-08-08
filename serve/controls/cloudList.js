const { cloudlist } = require('../model.js'); //列表数据库

//查找当前目录的所有文件和文件夹
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
        cloudlist.update({ _id: file._id }, {$set: {name: file.name}}, (err, doc) => {
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
        cloudlist.update({_id: {$in: idList}}, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};

const find = async (ctx) => {
    let parId = ctx.request.query.foldId;
    let doc = await findList(parId);
    ctx.status = 200;
    if (!doc) {
        ctx.body = {
            status: "error",
            message: "查无数据",
            data: []
        }
    }else {
        ctx.body = {
            status: "success",
            message: "登陆成功",
            data: doc
        };
    }
};

module.exports = {
    find
}