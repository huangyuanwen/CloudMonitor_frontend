<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="wrapper-md">
        <div class="panel panel-default">
            <div class="wrapper">
                    <table class="table table-condensed">
                        <tr>
                            <td>任务ID</td>
                            <td><input type="text" class="form-control" v-model="edit_data.job_id"></td>
                            <td>任务描述</td>
                            <td><input type="text" class="form-control" v-model="edit_data.job_description"></td>
                            <td>任务组</td>
                            <td>
                                <!--<input type="text" class="form-control" v-model="edit_data.job_group">-->
                                <v-select :value.sync="edit_data.job_group" :options="options"></v-select>
                            </td>
                        </tr>
                        <tr>
                            <td>执行规则</td>
                            <td><input type="text" class="form-control" v-model="edit_data.cron_expression"></td>
                            <td>执行url</td>
                            <td><input type="text" class="form-control" v-model="edit_data.url"></td>
                            <td>请求方式</td>
                            <td>
                                <!--<input type="text" class="form-control" v-model="edit_data.method">-->
                                <v-select :value.sync="edit_data.method" :options="['GET','POST','DELETE','PUT']"></v-select>
                            </td>
                        </tr>
                        <tr>
                            <td>请求JSON</td>
                            <td>
                                <input type="text" class="form-control" v-model="edit_data.json">
                            </td>
                            <td>邮件接收人</td>
                            <td>
                                <!--<input type="text" class="form-control" v-model="edit_data.mailto">-->
                                <v-select :value.sync="edit_data.mailto" multiple :options="userList"></v-select>
                            </td>
                            <td>邮件抄送人</td>
                            <td>
                                <!--<input type="text" class="form-control" v-model="edit_data.mailcc">-->
                                <v-select :value.sync="edit_data.mailcc" multiple :options="userList"></v-select>
                            </td>
                        </tr>
                        <tr>
                            <td>邮件密送人</td>
                            <td>
                                <!--<input type="text" class="form-control" v-model="edit_data.mailbcc">-->
                                <v-select :value.sync="edit_data.mailbcc" multiple :options="userList"></v-select>
                            </td>
                            <td>邮件主题</td>
                            <td><input type="text" class="form-control" v-model="edit_data.subject"></td>
                            <td>短信接收人</td>
                            <td>
                                <!--<input type="text" class="form-control" v-model="edit_data.smsto">-->
                                <v-select :value.sync="edit_data.smsto" multiple :options="userList"></v-select>
                            </td>
                        </tr>
                        <tr>
                            <td>正则限定</td>
                            <td><input type="text" class="form-control" v-model="edit_data.regex"></td>
                            <td>
                                <button class="btn btn-default" @click="save()">保存</button>
                            </td>
                        </tr>
                    </table>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading text-right">
                <v-select :value.sync="selected" :options="options" style="width: 460px;display: inline-block"></v-select>
            </div>
            <div class="wrapper row">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                        <thead>
                        <tr>
                            <th>任务ID</th>
                            <th>任务描述</th>
                            <th>任务组</th>
                            <th>执行规则</th>
                            <th>执行URL</th>
                            <th>请求方式</th>
                            <th>任务状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(key,data) in table">
                            <td>
                                <span>{{data.job_id}}</span>
                            </td>
                            <td>
                                <!--<span class="long">{{data.job_description}}</span>-->
                                <input style="border: none" readonly class="form-control scroll" type="text" value="{{data.job_description}}">
                            </td>
                            <td>
                                <span>{{data.job_group}}</span>
                            </td>
                            <td>
                                <span>{{data.cron_expression}}</span>
                            </td>
                            <td>
                                <!--<span class="long">{{data.url}}</span>-->
                                <input style="border: none" readonly class="form-control scroll" type="text" value="{{data.url}}">
                            </td>
                            <td>
                                <span>{{data.method}}</span>
                            </td>
                            <td>
              <span>
                  <a v-show="index!=$index" @click="edit(key,$index)">编辑</a>
                  <a v-show="index==$index" @click="save(key)">保存</a>
              </span>
                                <span>
                    <a @click="start(data.job_id)" v-show="data.job_status==0">启动</a>
                    <a @click="stop(data.job_id)" v-show="data.job_status==1">停止</a>
                </span>
                                <span>
                    <a @click="remove(data.job_id,data.job_group,data.job_status)">删除</a>
                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <!-- 页码栏 -->
                    <v-nav :cur.sync="cur" :all.sync="totalPage"  class="text-center"></v-nav>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
            GET_GROUP_BY_USER,
            FIND_WITH_PAGE_AND_GROUP,
            START_PATH,
            STOP_PATH,
            REMOVE_PATH,
            SAVE_PATH,
            FIND_ALL_USER_PATH
    } from '../common-path';
    import {GET_COOKIE} from '../js/cookie'
    import vSelect from 'vue-select'
    import vNav from './vue-pagination.vue'
    export default {
        components: {vSelect,vNav},
        data(){
            return {
                index:"undefind",
                cur: 1,
                totalPage:"",
                editr: false,
                selected: '',
                options: [],
                table: [],//表格数据
                userList: [],
                edit_data: {
                    cron_expression: "",
                    id: 0,
                    job_description: "",
                    job_group: "",
                    job_id: "",
                    job_status: 0,
                    json: "",
                    mailbcc: "",
                    mailcc: "",
                    mailto: "",
                    method: "",
                    regex: "",
                    smsto: "",
                    subject: "",
                    url: "",
                }
            }
        },
        ready () {
//            this.GetUser();
            this.GetGroup();
        },
        watch: {
            selected(val){
                this.GetData(1, 10, val)
            },
            cur(val){
                this.GetData(val, 10, this.selected);
            },
            "edit_data.job_group"(val){
                this.GetUser(val);
            },

        },
        methods: {
          /*  listen(val){
                GetData(val,10,this.selected);
            },*/
            GetUser(val){
                this.$http.post(FIND_ALL_USER_PATH,{job_group:val})
                        .then(function (data) {
                            this.$set('userList', data.body.data);
                        })
            },
            GetGroup(){
                this.$http.post(GET_GROUP_BY_USER, {"username": JSON.parse(GET_COOKIE('user')).username})
                        .then((response)=> {
                            let _self = this;
                            _self.$set('selected', response.data.data[0]);
                            _self.$set('options', response.data.data);
                        })
            },
            GetData(pageNo, pageSize, group){
                this.$http.post(FIND_WITH_PAGE_AND_GROUP, {
                    "pageSize": pageSize,
                    "pageNum": pageNo,
                    "jobGroup": group
                })
                        .then(function (data) {
                            this.$set('cur',pageNo);
                            this.$set('totalPage',data.body.data.totalPage);
                            this.$set('table', data.body.data.data);
                        })
            },
            add(){
                this.$set('edit_data', {});
                this.$http.post(SAVE_PATH, this.edit_data)
                        .then((response)=> {
                            response.body.code == 0 ? alert(response.body.error): alert('success!');
                            this.$set('edit_data', {});
                            this.GetData(1, 10, this.selected);
                        })
            },
            edit(key,index){
                this.$set('edit_data', this.table[key]);
                this.$set('index', index);
            },
            save(key){
//                let key = key || "";
                this.$http.post(SAVE_PATH, key ? this.table[key] : this.edit_data)
                        .then((response)=> {
                            this.$set('edit_data', {});
                            this.GetData(this.cur, 10, this.selected);
                            this.$set('index', 'undefind');
                            response.body.code == 0 ? alert(response.body.error): alert('success!');
                            this.$set('edit_data', {
                                cron_expression: "",
                                id: 0,
                                job_description: "",
                                job_group: "",
                                job_id: "",
                                job_status: 0,
                                json: "",
                                mailbcc: "",
                                mailcc: "",
                                mailto: "",
                                method: "",
                                regex: "",
                                smsto: "",
                                subject: "",
                                url: "",
                            });
                        })
            },
            start(id){
                this.$http.post(START_PATH, {"job_id": id})
                        .then((response)=> {
                            response.body.code == 0 ? alert(response.body.error): alert('success!');
                            this.GetData(this.cur, 10, this.selected)
                        })
            },
            stop(id){
                this.$http.post(STOP_PATH, {"job_id": id,"job_group":this.selected})
                        .then((response)=> {
                            response.body.code == 0 ? alert(response.body.error): alert('success!');
                            this.GetData(this.cur, 10, this.selected)
                        })
            },
            remove(id, group, status){
                this.$http.post(REMOVE_PATH, {
                    'job_id': id,
                    'job_group': group,
                    'job_status': status
                })
                        .then((response)=> {
                            response.body.code == 0 ? alert(response.body.error): alert('success!');
                            let _self = this;
                            _self.GetData(_self.cur, 10, _self.selected);
                        })
            }
        }
    }
</script>
<style>
    td > .long {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
    }
</style>