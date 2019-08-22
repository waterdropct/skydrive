<template>
    <div class="cloudDisk">
        <DiskMenu :showEditMenu="showEditMenu" :curFoldId="curFoldId" :pathRoot="pathRoot"
            :checkList="multipleSelection" @cloud_list_handel="handelList" />
        <div class="diskMain">
            <div class="diskMain_level">
                <p v-for="{_id, name, pathRoot} in folderLevel" :key="_id">
                    <span @click="folderPop(_id, pathRoot)">{{name}}</span>>
                </p>
            </div>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" width="100%"
                height="calc(100vh - 180px)" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="文件名" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <i v-show="scope.row.type === 'folder'" class="el-icon-folder"></i>
                        <i v-show="scope.row.type === 'file'" class="el-icon-tickets"></i>
                        <span @click="folderEnter(scope.row)" :class="{diskMain_name: scope.row.type === 'folder'}">
                            {{ scope.row.name }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="大小" width="100" sortable>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="160" sortable>
                </el-table-column>
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <span><i @click="reName(scope.row)" class="el-icon-edit"></i></span>
                        <a :download="scope.row.name" :href="`http://localhost:3000/api/downloadfile?fileId=${scope.row._id}`" v-show="scope.row.type == 'file'"><i class="el-icon-download"></i></a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import http from "../http.js";
    import { timeToString } from '../utils/dateutil.js';
    import { Table, TableColumn, Loading, MessageBox } from "element-ui";
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Loading)
    import DiskMenu from './DiskMenu.vue'
    export default {
        name: 'CloudDisk',
        props: {},
        data() {
            return {
                showEditMenu: false, //是否展示操作菜单
                curFoldId: "", //当前所在目录
                pathRoot: [], //当前路径
                folderLevel: [{
                    name: '全部文件',
                    _id: ''
                }],
                loading: false,
                tableData: [],
                multipleSelection: []
            }
        },
        components: {
            DiskMenu
        },
        computed: {},
        created() {
            this.getCloudList("");
        },
        methods: {
            handleSelectionChange(val) { //处理勾选事件
                this.multipleSelection = val;
                this.showEditMenu = val.length > 0 ? true : false;
            },
            handelList(res) { //监听菜单的操作
                switch (res.type) {
                    case 'uploadOk':
                        this.getCloudList(this.curFoldId);
                        break
                    case 'addFoldOk':
                        this.getCloudList(this.curFoldId);
                        break
                    case 'deleteOk':
                        this.getCloudList(this.curFoldId);
                        break
                    case 'moveOk':
                        this.getCloudList(this.curFoldId);
                        break
                }

            },
            getCloudList(id) { //查找当前目录下的所有文件
                this.loading = true;
                http.getService('cloudlist?foldId=' + id).then(res => {
                    var data = [];
                    if (res.status == "success") {
                        var oriData = res.data || [];
                        oriData.forEach(item => {
                            item.updateTime = timeToString(item.updateTime); //将时间戳转换成yyyy-mm-dd
                        });
                        data = oriData;
                    }
                    this.tableData = data;
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                })
            },
            folderEnter(row) { //进入下级目录
                if (row.type === 'folder') { //文件类型才支持点击查询操作
                    this.curFoldId = row._id;
                    this.pathRoot = row.pathRoot;
                    this.getCloudList(row._id);
                    const { _id, name, pathRoot } = row;
                    this.folderLevel.push({ _id, name, pathRoot });
                }
            },
            folderPop(foldId, pathRoot) { //返回上层目录
                let index = 0;
                for (let k = 0; k < this.folderLevel.length; k++) {
                    if (foldId == this.folderLevel[k]._id) {
                        index = k;
                        break
                    }
                }
                this.folderLevel.splice(index + 1);
                this.curFoldId = foldId;
                this.pathRoot = pathRoot;
                this.getCloudList(foldId);
            },
            reName: function (node) { //重命名
                const _this = this;
                MessageBox.prompt("", '修改名称', {
                    inputPlaceholder: '请输入新的名称',
                    inputValue: node.name,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    inputValidator: function (val) {
                        if (!val) {
                            return '输入不能为空'
                        }
                        //校验文件夹
                        if (node.type == "folder" && !val.match(/^[(\u4e00-\u9fa5)|(a-zA-Z0-9)]+$/)) {
                            return '输入格式有误，只支持中英文、数字'
                        }
                        //校验文件名
                        if (node.type == "file" && !val.match(/[^<>/\\\\|:\"\\*\\?]+/)) {
                            return '输入格式有误，不能包含? * | " < > : / \\ 这些非法字符'
                        }
                    }
                }).then(({ value, is }) => {
                    http.postService('updatefile', JSON.stringify({ name: value, _id: node._id, type: node.type })).then(res => {
                        if (res.status == 'success') {
                            _this.getCloudList(this.curFoldId);
                        }
                    }).catch(err => { })
                }).catch(() => { });
            },
            download (id){
                console.log(id)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .cloudDisk {
        width: auto;
        margin: 0 20px;
    }

    .diskMain_name {
        cursor: pointer;
    }

    .diskMain_name:hover {
        color: #409EFF;
    }

    .diskMain .el-icon-folder {
        color: #FFD659;
        margin-right: 10px;
    }

    .diskMain .el-icon-tickets {
        color: #63C422;
        margin-right: 10px;
    }

    .diskMain_level p {
        display: inline-block;
        color: #999;
    }

    .diskMain_level p span {
        display: inline-block;
        color: #409EFF;
        cursor: pointer;
        font-size: 14px;
        border-bottom: 1px solid #FFF;
        margin: 0px 5px;
    }

    .diskMain_level p span:hover {
        border-color: #409EFF;
    }
    .diskMain .el-icon-edit, .diskMain .el-icon-download{
        color: #409EFF;
        cursor: pointer;
        padding: 0 5px;
    }
</style>