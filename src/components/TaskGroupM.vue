<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="wrapper-md">
        <div class="panel panel-default">
            <!--<div class="panel-heading">
                Responsive Table
            </div>-->
            <div class="row wrapper">
                <div class="col-sm-5 m-b-xs dropdown open">
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
                                <button class="pull-right" v-on:click.stop="del(group.job_group)">删除</button>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-sm-4">
                </div>
                <div class="col-sm-3">
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
                            <a @click="del(group.job_group)">删除</a>
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
            FIND_USER_BY_GROUP
    } from '../common-path';
    import vNav from './vue-nav.vue'
    export default{
        components: {vNav},
        data(){
            return {
                groupName: "",
                all_group: [],
                user_by_group: [],
                edit: true,
                cur: "",
                totalPage: "",
                selected: "",
                open: false
            }
        },
        ready(){
            this.GetAllGroup();
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
                    var _self = this;
                    _self.GetAllGroup(_self.cur, 10);
                })
            },
            GetAllGroup(){
                var _self = this;
                _self.$http.post(ALL_GROUP).then((response)=> {
                    _self.$set('selected', response.data.data[0].job_group)
                    _self.$set('all_group', response.data.data);
                    this.find_user_by_group(1, 10, _self.selected);
                })
            },
            editFunc(){
                this.$set('edit', false);
            },
            update(key){
                var _self = this;
                _self.$http.post(GROUP_UPDATE, this.all_group[key]).then((resonse)=> {
                    _self.GetAllGroup(_self.cur, 10);
                    this.$set('edit', true);
                })
            },
            del(name){
                var _self = this;
                _self.$http.post(DELETE_GROUP, {jobGroup: name}).then((resonse)=> {
                    _self.GetAllGroup(_self.cur, 10);
                })
            },
            opendropdown(){
                this.$set('open', !this.open)
            },
            select(val){
                this.$set('selected', val);
            },
            find_user_by_group(pageNum, pageSize, jobGroup){
                var _self = this;
                _self.$http.post(FIND_USER_BY_GROUP, {
                    pageNum: pageNum,
                    pageSize: pageSize,
                    jobGroup: jobGroup,
                }).then((respones)=> {
                    _self.$set('cur', pageNum);
                    _self.$set('totalPage', respones.data.data.totalPage);
                    _self.$set('user_by_group', respones.data.data.data);
                })
            }

        }
    }
</script>