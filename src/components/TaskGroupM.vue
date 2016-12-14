<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="wrapper-md">
        <div class="panel panel-default">
            <div class="panel-heading">
                分组管理
            </div>
            <div class="row" style="padding: 7px 15px 0 15px">
                <div class="col-sm-3 m-b-xs dropdown open">
                    <button style="min-width: 200px; width:auto; min-height: 34px" type="button"
                            class="btn btn-default dropdown-toggle"
                            @click="opendropdown()">
                        {{selected}}<span class="caret pull-right" style="margin-top: .5em"></span>
                    </button>
                    <ul class="dropdown-menu" style="width: 480px" v-show="open" role="menu">
                        <li v-for="(key,group) in all_group" v-on:click.stop="select(group)">
                            <a>
                                <span v-show="edit">{{group}}</span>
                                <span v-show="!edit"><input type="text" v-model="group.job_group"></span>
                                <button class="pull-right" v-show="edit" v-on:click.stop="editFunc()">编辑</button>
                                <button class="pull-right" v-show="!edit" v-on:click.stop="update(key)">保存</button>
                                <button class="pull-right" v-on:click.stop="del_group(group)">删除</button>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-sm-4">
                    <!--<span>新增用户</span>-->
                    <div class="input-group" v-if="user_info.role=='root'">
                        <v-select :value.sync="selected_user" multiple :options="userList"></v-select>
                        <span class="input-group-btn">
            <button style="padding: 8px" class="btn btn-sm btn-default" type="button" @click="addUser()">新增用户</button>
          </span>
                    </div>

                </div>
                <div class="col-sm-3 col-sm-offset-2">
                    <div class="input-group">
                        <input type="text" class="input-sm form-control" v-model="groupName">
                        <span class="input-group-btn">
            <button class="btn btn-sm btn-default" type="button" @click="addGroup()">新增任务组</button>
          </span>
                    </div>
                </div>
            </div>
            <div class="row" style="padding: 0 15px 0 15px" v-if="user_info.role!='root'">
                <div style="background-color: #f6f8f8;padding: 10px 15px;">新增联系人</div>
                <table class="table" style="margin: 0">
                    <tr>
                        <td>联系人：</td>
                        <td><input type="text" class="form-control" v-model="contact.username"></td>
                        <td>联系电话：</td>
                        <td><input type="text" class="form-control" v-model="contact.phone"></td>
                        <td>联系邮箱：</td>
                        <td><input type="text" class="form-control" v-model="contact.email"></td>
                        <td>
                            <button class="btn btn-default" @click="add_contact()">确认添加</button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="table-responsive">
                <div style="background-color: #f6f8f8;padding: 10px 15px;">联系人列表</div>
                <table class="table table-hover table-striped b-t b-light">
                    <thead>
                    <tr>
                        <th>用户</th>
                        <th>邮箱</th>
                        <th>电话</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(key,user) in user_by_group">
                        <td>{{user.username}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.phone}}</td>
                        <td>
                            <a @click="del_user(user.username)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <footer class="panel-footer">
                <v-nav :cur.sync="cur" :all.sync="totalPage" v-on:btn-click="listen" class="text-center"></v-nav>
            </footer>
        </div>
    </div>
</template>
<script>
    import {
            ADD_NEW_GROUP,
            ALL_GROUP,
            GROUP_UPDATE,
            DELETE_GROUP,
            ADD_USER_INSER_GROUP,
            FIND_USER_BY_GROUP,
            FIND_ALL_USER_PATH,
            DELETD_USER_GROUP,
            GET_GROUP_BY_USER,
            ADD_CONTACT_USER
    } from '../common-path';
    import vNav from './vue-pagination.vue'
    import vSelect from 'vue-select'
    import {GET_COOKIE} from '../js/cookie'
    export default{
        components: {vNav, vSelect},
        data(){
            return {
                user_info: JSON.parse(GET_COOKIE('user')),
                groupName: "",
                all_group: [],
                userList: [],
                selected_user: "",
                user_by_group: [],
                edit: true,
                cur: 1,
                totalPage: "",
                selected: "",
                open: false,
                contact: {
                    username: "",
                    phone: "",
                    email: ""
                }
            }
        },
        ready(){
            this.GetAllGroup();
//            this.find_all_user()
        },
        watch: {
            selected(val){
                this.find_user_by_group(1, 10, val);
                this.find_all_user()
            },
            cur(val){
                this.find_user_by_group(val, 10, this.selected)
            }
        },
        methods: {
            listen(val){
                this.find_user_by_group(val, 10, this.selected)
            },
            addGroup(){
                this.$http.post(ADD_NEW_GROUP, {
                    jobGroup: this.groupName,
                    username: JSON.parse(GET_COOKIE('user')).username,
                    role: JSON.parse(GET_COOKIE('user')).role
                }).then((response)=> {
                    let _self = this;
                    _self.GetAllGroup();
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    this.$set('groupName', '');
                })
            },
            GetAllGroup(){
                let _self = this;
                _self.$http.post(GET_GROUP_BY_USER, {username: JSON.parse(GET_COOKIE('user')).username}).then((response)=> {
                    _self.$set('selected', response.data.data[0] ? response.data.data[0] : "");
                    _self.$set('all_group', response.data.data);
                    this.find_all_user()
                    //  this.find_user_by_group(1, 10, _self.selected);
                })
            },
            editFunc(){
                this.$set('edit', false);
            },
            update(key){
                let _self = this;
                _self.$http.post(GROUP_UPDATE, this.all_group[key]).then((response)=> {
                    _self.GetAllGroup();
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    this.$set('edit', true);
                })
            },
            del_user(name){
                let _self = this;
                _self.$http.post(DELETD_USER_GROUP, {username: name, jobGroup: this.selected}).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    _self.find_user_by_group(_self.cur, 10, _self.selected);
                })
            },
            del_group(groupname){
                console.log(groupname)
                let _self = this;
                _self.$http.post(DELETE_GROUP, {jobGroup: groupname}).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    _self.GetAllGroup();
                })
            },
            opendropdown(){
                this.$set('open', !this.open)
            },
            select(val){
                this.$set('selected', val);
            },
            find_user_by_group(pageNum, pageSize, jobGroup){
                let _self = this;
                _self.$http.post(FIND_USER_BY_GROUP, {
                    pageNum: pageNum,
                    pageSize: pageSize,
                    jobGroup: jobGroup,
                }).then((respones)=> {
                    _self.$set('cur', pageNum);
                    _self.$set('totalPage', respones.data.data.totalPage);
                    _self.$set('user_by_group', respones.data.data.data);
                })
            },
            find_all_user(){
                console.log(this.selected)
                this.$http.post(FIND_ALL_USER_PATH,{job_group:this.selected}).then((response)=> {
                    this.$set('userList', response.body.data);
                })
            },
            addUser(){
                this.$http.post(ADD_USER_INSER_GROUP, {
                    "username": this.selected_user,
                    "job_group": this.selected
                }).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    this.find_user_by_group(1, 10, this.selected);
                    this.$set('selected_user', []);
                })
            },
            //新增联系人
            add_contact(){
                this.$http.post(ADD_CONTACT_USER, {
                    username: this.contact.username,
                    job_group: this.selected,
                    email: this.contact.email,
                    phone: this.contact.phone,
                }).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error): alert('success!');
                    this.find_user_by_group(1, 10, this.selected)
                })
            },

        }
    }
</script>