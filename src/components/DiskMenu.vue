<template>
    <div class="diskMenu">
        <input name="file" @change="uploadFile($event)" type="file" />
        <el-progress :text-inside="true" :stroke-width="20" :percentage=percent status="success"></el-progress>
        <el-button type="primary" size="small" icon="el-icon-upload" @click="upload">上传</el-button>
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
    </div>
</template>

<script>
    import Vue from "vue";
    import store from '../store.js';
    import { Button, ButtonGroup, Tooltip, Progress } from "element-ui";
    Vue.use(Button)
    Vue.use(ButtonGroup)
    Vue.use(Tooltip)
    Vue.use(Progress)
    export default {
        name: 'DiskMenu',
        props: {
            showEditMenu: Boolean
        },
        data(){
            return {
                percent: 0
            }
        },
        computed: {},
        methods: {
            upload: function(){
                alert(1)
            },
            uploadFile: e => {
                const file = e.target.files[0];
                if(file.size > 2 * 1000 * 1000){
                    alert('文件大小不能超过2M');
                    return
                }
                //创建formdata对象
                let formData = new FormData();
                formData.append('file', file);
                let xhr = new XMLHttpRequest();
                xhr.open('post', 'http://localhost:3000/api/upload');
                xhr.setRequestHeader('skyAuth', `aut${store.state.token}`); //涉及到认证，需要自定义header头部
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4 && xhr.status == 200){}
                };
                xhr.upload.onprogress = function(e){ //进度条
                    if(e.lengthComputable){
                        this.percent = e.loaded / e.total * 100;
                    }
                }
                xhr.send(formData);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .diskMenu{
        width: auto;
        margin: 10px 0;
    }
    .diskMenu__edit{
        margin-left: 20px;
        display: inline-block;
    }
</style>