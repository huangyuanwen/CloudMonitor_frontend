<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="wrapper-md">
        <div class="panel panel-default">
            <!--<div class="panel-heading">
                Responsive Table
            </div>-->
            <div class="row wrapper">
                <div class="col-sm-3 m-b-xs dropdown open">
                    <button style="width: 200px" type="button" class="btn btn-default dropdown-toggle"
                            @click="opendropdown()">
                        {{selected}}<span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" v-show="open" role="menu">
                        <li v-for="(key,group) in all_group" v-on:click.stop="select(group.job_group)">
                            <a>
                                <span v-show="edit">{{group.job_group}}</span>
                                <span v-show="!edit"><input type="text" v-model="group.job_group"></span>
                                <button class="pull-right" v-show="edit" v-on:click.stop="editFunc()">编辑</button>
                                <button class="pull-right" v-show="!edit" v-on:click.stop="update(key)">保存</button>
                                <button class="pull-right" v-on:click.stop="del_group(group.job_group)">删除</button>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-sm-4">
                    <!--<span>新增用户</span>-->
                    <div class="input-group">
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
            <div class="table-responsive">
                <table class="table table-striped b-t b-light">
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
                            <a @click="del_user(user.job_group)">删除</a>
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
            DELETD_USER_GROUP
    } from '../common-path';
    import vNav from './vue-nav.vue'
    import vSelect from 'vue-select'
    export default{
        components: {vNav, vSelect},
        data(){
            return {
                groupName: "",
                all_group: [],
                userList: [],
                selected_user: "",
                user_by_group: [],
                edit: true,
                cur: 1,
                totalPage: "",
                selected: "",
                open: false
            }
        },
        ready(){
            this.GetAllGroup();
            this.find_all_user()
        },
        watch: {
            selected(val){
                this.find_user_by_group(1, 10, val)
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
                this.$http.post(ADD_NEW_GROUP, {jobGroup: this.groupName}).then((response)=> {
                    let _self = this;
                    _self.GetAllGroup();
                })
            },
            GetAllGroup(){
                let _self = this;
                _self.$http.post(ALL_GROUP).then((response)=> {
                    console.log(response.data.data[0])
                    _self.$set('selected', response.data.data[0]?response.data.data[0].job_group:"");
                    _self.$set('all_group', response.data.data);
                    //  this.find_user_by_group(1, 10, _self.selected);
                })
            },
            editFunc(){
                this.$set('edit', false);
            },
            update(key){
                let _self = this;
                _self.$http.post(GROUP_UPDATE, this.all_group[key]).then((resonse)=> {
                    _self.GetAllGroup();
                    this.$set('edit', true);
                })
            },
            del_user(name){
                let _self = this;
                _self.$http.post(DELETD_USER_GROUP, {username: name, jobGroup: this.selected}).then((response)=> {
                    JSON.stringify(response.body.code) == 0 ? alert(JSON.stringify(response.body.error)) : alert('success!');
                    _self.find_user_by_group(_self.cur, 10,_self.selected);
                })
            },
            del_group(groupname){
                let _self = this;
                _self.$http.post(DELETE_GROUP, {jobGroup: groupname}).then((response)=> {
                    JSON.stringify(response.body.code) == 0 ? alert(JSON.stringify(response.body.error)) : alert('success!');
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
                this.$http.post(FIND_ALL_USER_PATH).then((response)=> {
                    this.$set('userList', response.body.data);
                })
            },
            addUser(){
                this.$http.post(ADD_USER_INSER_GROUP, {
                    "username": this.selected_user,
                    "job_group": this.selected
                }).then((response)=> {
                    JSON.stringify(response.body.code) == 0 ? alert(JSON.stringify(response.body.error)) : alert('success!');
                    this.find_user_by_group(1, 10, this.selected);
                    this.$set('selected_user',[]);
                })
            }

        }
    }
</script>