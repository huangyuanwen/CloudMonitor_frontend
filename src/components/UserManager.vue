<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="wrapper-md">
        <div class="panel panel-default">
            <div class="panel-heading">
                新增用户
            </div>
            <div class="wrapper">
                <div class="table-responsive">
                    <table class="table">
                        <tr>
                            <td>用户名：</td>
                            <td><input type="text" class="form-control" v-model="new_user.username"></td>
                            <td>密码：</td>
                            <td><input type="text" class="form-control" v-model="new_user.password"></td>
                            <td>手机号：</td>
                            <td>
                                <input type="text" class="form-control" v-model="new_user.phone">
                            </td>
                        </tr>
                        <tr>
                            <td>邮件</td>
                            <td><input type="text" class="form-control" v-model="new_user.email"></td>
                            <td>
                                <a class="btn btn-default" @click="add()">新增</a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                用户列表
            </div>
            <div class="row wrapper">
                <div class="table-responsive">
                    <table class="table">
                    <thead>
                    <tr>
                        <th>用户名</th>
                        <th>密码</th>
                        <th>手机号</th>
                        <th>邮件</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(key,user) in all_user">
                        <td>
                            <span v-show="edit">{{user.username}}</span>
                            <span v-show="!edit"><input type="text" v-model="user.username"></span>
                        </td>
                        <td>
                            <span v-show="edit" class="lang">{{user.password}}</span>
                            <span v-show="!edit"><input type="text" v-model="user.password"></span>
                        </td>
                        <td>
                            <span v-show="edit">{{user.phone}}</span>
                            <span v-show="!edit"><input type="text" v-model="user.phone"></span>
                        </td>
                        <td>
                            <span v-show="edit">{{user.email}}</span>
                            <span v-show="!edit"><input type="text" v-model="user.email"></span>
                        </td>
                        <td>
                            <span><a @click="del(user.username)">删除</a></span>
                            <span @click="editFn()">
                        <a  v-show="edit">编辑</a>
                    <a @click="update(key)" v-show="!edit">保存</a>
                    </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                    <footer class="panel-footer">
                        <!-- 页码栏 -->
                        <div id="callBackPager" align="center"></div>
                    </footer>
                </div>
            </div>
        </div>


    </div>
</template>
<script>
    import {
            USER_INSERT,
            USER_DELETE,
            FIND_USER_LIST
    } from '../common-path';
    import {GET_COOKIE} from '../js/cookie'
    import vSelect from 'vue-select'
    export default{
        data(){
            return {
                all_user: [],
                curr:"",
                new_user:{
                    username:"",
                    password:"",
                    email:"",
                    phone:""
                },
                edit: true,
            }
        },
        ready(){
            var _self = this;
            //进入页面后第一次获取数据
            _self.GetAllUser(1, 10, function (totalRecord) {
                $('#callBackPager').extendPagination({
                    totalCount: totalRecord,
                    showCount: 5,
                    limit: 10,
                    callback: function (curr, limit, totalCount) {
                        _self.$set('curr',curr);
                        _self.GetAllUser(curr, limit);
                    }
                });
            });
        },
        methods: {
            //获取所有用户
            GetAllUser(pageNum,pageSize,callBack){
                this.$http.post(FIND_USER_LIST, {pageNum: pageNum, pageSzie: pageSize}).then((respones)=> {
                    console.log(JSON.stringify(respones.body.data.data))
                    this.$set('all_user', respones.body.data.data)

                    if(typeof callBack === 'function'){
                        callBack(respones.body.data.totalRecord)
                    }
                })
            },
            //删除用户
            del(name){
                this.$http.post(USER_DELETE, {username: name}).then((respones)=> {
                    alert('success!')
                    var _self = this;
                    _self.GetAllUser(_self.curr, 10);
                })
            },
            editFn(){
               this.$set('edit',!this.edit);
            },
            update(key){
                this.$http.post(USER_INSERT,this.all_user[key]).then((respones)=>{
                    alert('success!')
                });
            },
            add(){
                this.$http.post(USER_INSERT,this.new_user).then((respones)=>{
                    alert('success')
                    var _self = this;
                    _self.GetAllUser(_self.curr, 10);
                });
            }
        }
    }
</script>
<style>
    td > .lang {
        width: 380px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
    }
</style>