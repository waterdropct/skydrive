<template>
    <div class="login">
        <p class="login__title">账号密码登陆</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入账号" clearable></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
                <el-input v-model="ruleForm.pwd" placeholder="请输入密码" show-password clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading=loading width="100%" size="small" @click="submitForm('ruleForm')">登陆
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Vue from "vue";
    import { Form, FormItem, Input, Button } from "element-ui";
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(Button)
    export default {
        name: 'Login',
        props: {},
        data() {
            return {
                loading: false,
                ruleForm: {
                    name: "",
                    pwd: ""
                },
                rules: {
                    name: [
                        { required: true, message: '请输入账号', trigger: 'change' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.$message({
                            message: '登陆成功,正在跳转...',
                            type: 'success',
                            center: true
                        });
                        sessionStorage.setItem("userAccess", JSON.stringify(true));
                        this.$store.commit("login");
                        this.loading = false;
                        this.$router.push("/cloud");
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .login {
        width: 300px;
        border-radius: 3px;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.3) 0 0 50px;
        padding: 10px 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -150px;
        margin-top: -130px;
    }

    .login__title {
        text-align: center;
    }

    .el-button--small {
        width: 100%;
    }
</style>