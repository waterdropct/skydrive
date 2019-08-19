const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/skydrive';
mongoose.connect(DB_URL);
const Schema = mongoose.Schema;
//用户集合
const userSchema = new Schema({
    name: String,
    pwd: String,
    createTime: String
});
const user = mongoose.model('user', userSchema);
//列表集合
const listSchema = new Schema({
    name: String,
    type: String,
    size: String,
    updateTime: String,
    parId: String,
    pathRoot: Array
});
const cloudlist = mongoose.model('cloudlist', listSchema);
module.exports = {
    user,
    cloudlist
};