const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/skydrive';
mongoose.connect(DB_URL);
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    pwd: String,
    createTime: String
});

module.exports = {
    user: mongoose.model('user', userSchema)
};