<template>
    <div class="diskMenu">
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
    import { Button, ButtonGroup, Tooltip } from "element-ui";
    Vue.use(Button)
    Vue.use(ButtonGroup)
    Vue.use(Tooltip)
    export default {
        name: 'DiskMenu',
        props: {
            showEditMenu: Boolean
        },
        computed: {},
        methods: {
            upload: function(){
                alert(1)
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