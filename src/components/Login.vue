<template>
    <div class="login">
        <p class="login__title">{{isLogin ? '账号密码登陆' : '账号密码注册'}}</p>
        <el-form :model="ruleForm" :rules="rules" ref="skyLoginForm" class="demo-ruleForm">
            <el-form-item prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入账号" clearable></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
                <el-input v-model="ruleForm.pwd" placeholder="请输入密码" show-password clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading=loading width="100%" size="small" @click="submitForm">{{isLogin ? '登陆' : '注册'}}
                </el-button>
            </el-form-item>
        </el-form>
        <p class="register__tip" v-show="isLogin">No Account ? Go To <span @click="toggleLogin(false)">Register</span>
        </p>
        <p class="register__tip" v-show="!isLogin">Have Account ? Go To <span @click="toggleLogin(true)">Login</span>
        </p>
    </div>
</template>

<script>
    import Vue from "vue";
    import http from "../http.js";
    import { Form, FormItem, Input, Button, Message } from "element-ui";
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
                isLogin: true,
                ruleForm: {
                    name: "",
                    pwd: ""
                },
                rules: {
                    name: [
                        { required: true, message: '请输入账号', trigger: 'change' },
                        { min: 5, max: 7, message: '长度在 5 到 7 个字符', trigger: 'blur' },
                        { pattern: /^[(\u4e00-\u9fa5)|(a-zA-Z0-9)]+$/, message: '输入格式有误，只支持中文、英文或数字', trigger: 'change' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'change' },
                        { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
                        { pattern: /^[(a-zA-Z0-9\.)]+$/, message: '输入格式有误，只支持英文、数字或.', trigger: 'change' }
                    ]
                }
            }
        },
        created: function () {
            if (this.$store.state.token) {//如果已经登陆，则直接跳到首页
                this.$router.push("/cloud");
            }
        },
        methods: {
            toggleLogin(isLogin) {
                this.isLogin = isLogin;
                this.$refs['skyLoginForm'].resetFields();
            },
            submitForm() {
                this.$refs['skyLoginForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        http.postService( this.isLogin ? 'userlogin' : 'userregister', JSON.stringify(this.ruleForm)).then(res => {
                            this.loading = false;
                            if (res.status == 'success' && this.isLogin) {//登陆成功
                                this.$store.dispatch('UserLogin', res.data || {});
                                this.$router.push("/cloud");
                            }
                            if (res.status == 'success' && !this.isLogin) { //注册成功
                                this.$refs['skyLoginForm'].resetFields();
                                this.isLogin = true;
                            }
                        }).catch(err => {
                            this.loading = false;
                        })
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

    .register__tip {
        font-size: 14px;
        text-align: center;
    }

    .register__tip span {
        color: #409EFF;
        cursor: pointer;
    }
</style>