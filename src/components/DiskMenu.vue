<template>
    <div class="diskMenu">
        <div title="" class="cloud__upload"><input name="file" @change="uploadFile($event)" type="file" /></div>
        <el-button type="primary" size="small" icon="el-icon-upload">上传</el-button>
        <el-button type="primary" size="small" icon="el-icon-folder-add" plain>新建文件夹</el-button>
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
                    <el-button size="small" icon="el-icon-delete"></el-button>
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
    import store from '../store.js';
    import { Button, ButtonGroup, Tooltip, Progress, Message } from "element-ui";
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
        if(_this){
            setTimeout(function(){
                _this.showProgress = false;
                _this.percent = 0;
            }, 2000)
        }
    }
    export default {
        name: 'DiskMenu',
        props: {
            showEditMenu: Boolean,
            curFoldId: String
        },
        data() {
            return {
                showProgress: false,
                percent: 0
            }
        },
        computed: {},
        methods: {
            uploadFile: function (e) {
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
                xhr.open('post', 'http://localhost:3000/api/upload');
                xhr.setRequestHeader('skyAuth', `aut${store.state.token}`); //涉及到认证，需要自定义header头部
                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        messageShow('success', '上传成功', _this);
                        _this.$emit('cloud_list_handel', {type: 'uploadOk'});
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