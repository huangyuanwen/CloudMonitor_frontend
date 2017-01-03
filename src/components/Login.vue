<template>
    <div class="login-box">
        <div class="login-logo">
            <a href="javascript:">监控系统</a>
        </div>
        <div class="login-box-body">
            <form>
                <div class="form-group has-feedback">
                    <input type="text" name="username" placeholder="输入用户名"
                           class="form-control" v-model="data.username">
                </div>
                <div class="form-group has-feedback">
                    <input type="password" name="password" placeholder="输入用户密码"
                           class="form-control" v-model="data.password">
                </div>
                <div class="row">
                    <div class="col-xs-8">
                        <div class="checkbox icheck">
                            <label> <input type="checkbox" checked name="remember">
                                记住我
                            </label>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <button type="button" @click="login()" class="btn btn-primary btn-block btn-flat">登陆</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {USER_LOGIN_PATH} from '../common-path';
    import {SET_COOKIE,GET_COOKIE} from '../js/cookie';
    export default {
        data(){
            return {
                data:{
                    username:"",
                    password:""
                }
            }
        },
        ready(){
           // GET_COOKIE('user')!=null?this.$router.go('home/task-watch'):this.$router.go('/');
        },
        methods:{
            login(){
                let vm = this;
                vm.$http.post(USER_LOGIN_PATH, vm.data,{'content-type':'x-www-form-urlencoded'})
                        .then((response) => {
                            response.body.code==1?this.$router.go('home/task-watch'):alert(response.body.error);
                            //将用户信息存入cookie
                            SET_COOKIE('user',JSON.stringify(response.body.user))
                        })
            }
        }
    }
</script>
<style>
    .login-box, .register-box {
        width: 360px;
        margin: 7% auto;
    }

    .login-logo, .register-logo {
        font-size: 24px;
        text-align: center;
        margin-bottom: 15px;
        font-weight: 300;
    }

    .login-box-body, .register-box-body {
        background: #fff;
        padding: 20px;
        border-top: 0;
        color: #666;
    }
</style>