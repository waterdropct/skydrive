<template>
    <div class="diskMenu">
        <div title="" class="cloud__upload"><input name="file" @change="uploadFile($event)" type="file" /></div>
        <el-button type="primary" size="small" icon="el-icon-upload">上传</el-button>
        <el-button type="primary" size="small" icon="el-icon-folder-add" @click="addFolder" plain>新建文件夹</el-button>
        <el-button type="warning" size="small" icon="el-icon-goods">回收站</el-button>
        <div v-show="showEditMenu" class="diskMenu__edit">
            <el-button-group>
                <el-tooltip class="item" effect="dark" content="复制到" placement="bottom">
                    <el-button size="small" icon="el-icon-copy-document"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="移动到" placement="bottom">
                    <el-button size="small" icon="el-icon-scissors"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                    <el-button size="small" icon="el-icon-delete" @click="deleteList"></el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div v-show="showProgress" class="upload__progress">
            <el-progress :text-inside="true" :stroke-width="20" :percentage=percent status="success"></el-progress>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import http from "../http.js";
    import store from '../store.js';
    import { Button, ButtonGroup, Tooltip, Progress, Message, MessageBox } from "element-ui";
    Vue.use(Button)
    Vue.use(ButtonGroup)
    Vue.use(Tooltip)
    Vue.use(Progress)

    const messageShow = (type, msg, _this) => {
        Message({
            message: msg,
            type: type,
            center: true
        });
        if (_this) {
            setTimeout(function () {
                _this.showProgress = false;
                _this.percent = 0;
            }, 2000)
        }
    }
    export default {
        name: 'DiskMenu',
        props: {
            showEditMenu: Boolean,
            curFoldId: String,
            checkList: Array
        },
        data() {
            return {
                showProgress: false,
                percent: 0
            }
        },
        computed: {},
        methods: {
            uploadFile: function (e) { //上传文件
                const file = e.target.files[0];
                if (file.size > 2 * 1000 * 1000) {
                    messageShow('error', '文件大小不能超过2M');
                    return
                }
                let _this = this;
                //创建formdata对象
                let formData = new FormData();
                formData.append('file', file);
                formData.append('foldId', this.curFoldId);
                let xhr = new XMLHttpRequest();
                xhr.open('post', 'http://localhost:3000/api/uploadfile');
                xhr.setRequestHeader('skyAuth', `aut${store.state.token}`); //涉及到认证，需要自定义header头部
                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        messageShow('success', '上传成功', _this);
                        _this.$emit('cloud_list_handel', { type: 'uploadOk' });
                    }
                    if (xhr.readyState == 4 && xhr.status !== 200) {
                        messageShow('error', '上传失败：' + e.target.statusText, _this);
                    }
                };
                xhr.upload.onprogress = function (e) { //进度条
                    if (e.lengthComputable) {
                        _this.percent = e.loaded / e.total * 100;
                    }
                }
                xhr.upload.onerror = function (err) {
                    messageShow('error', '网络连接失败', _this);
                }
                xhr.send(formData);
                _this.showProgress = true;
            },
            addFolder: function () { //新建文件夹
                MessageBox.prompt('', '新建文件夹', {
                    inputPlaceholder: '请输入名称',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    inputValidator: function (val) {
                        if (!val) {
                            return '输入不能为空'
                        }
                        if (!val.match(/^[(\u4e00-\u9fa5)|(a-zA-Z0-9)]+$/)) {
                            return '输入格式有误，只支持中英文、数字'
                        }
                    }
                }).then(({ value }) => {
                    http.postService('addfold', JSON.stringify({ foldname: value, parId: this.curFoldId })).then(res => {
                        if (res.status == 'success') {
                            this.$emit('cloud_list_handel', { type: 'addFoldOk' });
                        }
                    }).catch(err => { })
                }).catch(() => { });
            },
            deleteList: function () { //删除操作
                MessageBox.confirm('此操作将永久删除文件(若删除文件夹，则该文件夹的所有数据都会一并删除)，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const deleteArr = this.checkList.map( item => {
                        return item._id
                    })
                    http.postService('deletelist', JSON.stringify({ deletelist: deleteArr })).then(res => {
                        if (res.status == 'success') {
                            this.$emit('cloud_list_handel', { type: 'deleteOk' });
                        }
                    }).catch(err => { })
                }).catch(() => {});
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .diskMenu {
        width: auto;
        margin: 10px 0;
        position: relative;
    }

    .diskMenu__edit {
        margin-left: 20px;
        display: inline-block;
    }

    .cloud__upload {
        position: absolute;
        width: 73px;
        height: 32px;
        opacity: 0;
        overflow: hidden;
        cursor: pointer;
    }

    .cloud__upload input {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .upload__progress {
        display: inline-block;
        width: 500px;
        margin-left: 10px;
    }
</style>