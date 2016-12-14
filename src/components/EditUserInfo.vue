<template>
    <div class="wrapper-md">
        <div class="panel panel-default">
            <div class="panel-heading">
                个人信息修改
            </div>
            <div class="table-responsive">
                <table class="table">
                    <tr>
                        <td>账户名：</td>
                        <td><input type="text" class="form-control" v-model="user.username"></td>
                        <td>联系电话：</td>
                        <td><input type="text" class="form-control" v-model="user.phone"></td>
                    </tr>
                    <tr>
                        <td>邮箱：</td>
                        <td><input type="text" class="form-control" v-model="user.email"></td>
                        <td>密码：</td>
                        <td><input type="password" class="form-control" v-model="user.password"></td>
                    </tr>
                </table>
                <div class="text-center wrapper">
                    <button class="btn btn-default" @click="update()">确认修改</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {GET_COOKIE,SET_COOKIE,DEL_COOKIE} from '../js/cookie';
    import {USER_INSERT} from '../common-path';
    export default{
        data(){
            return{
                user:{
                    id:JSON.parse(GET_COOKIE('user')).id,
                    username:JSON.parse(GET_COOKIE('user')).username,
                    phone:JSON.parse(GET_COOKIE('user')).phone,
                    email:JSON.parse(GET_COOKIE('user')).email,
                    password:JSON.parse(GET_COOKIE('user')).password,
                }
            }
        },
        methods:{
            update(){
                if(confirm('用户信息修改后需重新登陆！是否确认？')){
                    this.$http.post(USER_INSERT,{
                        id:this.user.id,
                        username:this.user.username,
                        phone:this.user.phone,
                        email:this.user.email,
                        password:this.user.password,
                    }).then((response)=>{
                        DEL_COOKIE('user');
                        this.$router.go('/')
                    })
                }
            }
        }
    }
</script>