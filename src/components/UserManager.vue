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
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th>用户名</th>
                            <!--<th>密码</th>-->
                            <th>手机号</th>
                            <th>邮件</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="tr_{{key}}" v-for="(key,user) in all_user">
                            <td>
                                <div>
                                    <span v-show="index!=$index">{{user.username}}</span>
                                    <span v-show="index==$index"><input class="form-control" type="text"
                                                                        v-model="user.username"></span>
                                </div>
                            </td>
                            <!--  <td>
                                  <span v-show="edit" class="lang">{{user.password}}</span>
                                  <span v-show="!edit"><input type="text" v-model="user.password"></span>
                              </td>-->
                            <td>
                                <span v-show="index!=$index">{{user.phone}}</span>
                                <span v-show="index==$index"><input class="form-control" type="text"
                                                                    v-model="user.phone"></span>
                            </td>
                            <td>
                                <span v-show="index!=$index">{{user.email}}</span>
                                <span v-show="index==$index"><input class="form-control" type="text"
                                                                    v-model="user.email"></span>
                            </td>
                            <td>
                                <a @click="editFn($index)" v-show="index!=$index">编辑</a>
                                <a @click="update(key)" v-show="index==$index">保存</a>
                                <span><a @click="del(user.username)">删除</a></span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <footer class="panel-footer">
                        <!-- 页码栏 -->
                        <v-nav :cur.sync="cur" :all.sync="totalPage" class="text-center"></v-nav>
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
    import vNav from './vue-pagination.vue'
    export default{
        components: {vNav},
        data(){
            return {
                index: 'undefind',
                cur: 1,
                totalPage: '',
                all_user: [],
                new_user: {
                    username: "",
                    password: "",
                    email: "",
                    phone: ""
                },
            }
        },
        watch: {
            //监听页码变化
            cur(val){
                this.GetAllUser(val, 10)
            }
        },
        ready(){
            //进入页面后第一次获取数据
            this.GetAllUser(1, 10)
        },
        methods: {
            //监听页码变化
            /* listen(data) {
             this.GetAllUser(data, 10);
             },*/
            //获取所有用户
            GetAllUser(pageNum, pageSize){
                this.$http.post(FIND_USER_LIST, {pageNum: pageNum, pageSzie: pageSize}).then((respones)=> {
                    this.$set('cur', pageNum);
                    this.$set('totalPage', respones.body.data.totalPage);
                    this.$set('all_user', respones.body.data.data);
                })
            },
            //删除用户
            del(name){
                this.$http.post(USER_DELETE, {username: name}).then((response)=> {
                    this.GetAllUser(this.cur, 10)
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                })
            },
            editFn(index){
//                this.$set('edit', !this.edit);
                this.$set('index', index)
            },
            update(key){
                this.$set('index','undefind')
                this.$http.post(USER_INSERT, this.all_user[key]).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    this.GetAllUser(this.cur, 10)
                });
            },
            add(){
                this.$http.post(USER_INSERT, this.new_user).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    this.GetAllUser(this.cur, 10)
                    this.$set('new_user', {
                        username: "",
                        password: "",
                        email: "",
                        phone: ""
                    },)
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