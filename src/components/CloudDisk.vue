<template>
    <div class="cloudDisk">
        <DiskMenu :showEditMenu="showEditMenu" />
        <div class="diskMain">
                <div class="diskMain_level">
                    <p v-for="level in folderLevel" :key="level.id">
                        <span @click="folderEnter(level)">{{level.name}}</span> >
                    </p>
                </div>
                <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column label="文件名" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i v-show="scope.row.type === 'folder'" class="el-icon-folder"></i>
                            <i v-show="scope.row.type === 'file'" class="el-icon-tickets"></i>
                            <span @click="folderEnter(scope.row)"
                                :class="{diskMain_name: scope.row.type === 'folder'}">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="size" label="大小" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="200" sortable>
                    </el-table-column>
                </el-table>
            </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import http from "../http.js";
    import { Table, TableColumn } from "element-ui";
    Vue.use(Table)
    Vue.use(TableColumn)
    import DiskMenu from './DiskMenu.vue'
    export default {
        name: 'CloudDisk',
        props: {},
        data(){
            return {
                showEditMenu: false, //是否展示操作菜单
                folderLevel: [{
                    name: '全部文件',
                    id: '1'
                }],
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
            getCloudList(id) { //查找当前目录下的所有文件
                http.getService('cloudlist?foldId=' + id).then(res => {
                    console.log(res)
                }).catch(err => {
                })
            },
            folderEnter(row) {
                if (row.type === 'folder') {
                    this.tableData = row.children || [];
                }
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
    }

    .diskMain_level p span:hover {
        border-color: #409EFF;
    }
</style>