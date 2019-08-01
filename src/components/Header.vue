<template>
  <div class="header">
      <div class="header__title">
        <img class="header__icon" src="../assets/logo.png" /><span>闪电云盘</span>
    </div>
    <div class="header__user">
        <el-dropdown @command="handleUser">
            <span class="el-dropdown-link">
              hechao Lei<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout" icon="el-icon-setting">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
export default {
  name: 'Header',
  props: {},
  methods: {
    handleUser (item) {
        if(item === "logout"){
            sessionStorage.setItem("userAccess", "");
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.header{
    padding: 20px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.05);
}
.header__title{
    display: inline-block;
}
.header__icon{
    height: 20px;
    vertical-align: middle;
}
.header__user{
    float: right;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
