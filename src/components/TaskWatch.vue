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
                            <td><input type="text" class="form-control" v-model="edit_data.method"></td>
                        </tr>
                        <tr>
                            <td>请求JSON</td>
                            <td><input type="text" class="form-control" v-model="edit_data.json"></td>
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
            <div class="panel-heading">
                <v-select :value.sync="selected" :options="options"></v-select>
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
                                <span>{{data.job_description}}</span>
                            </td>
                            <td>
                                <span>{{data.job_group}}</span>
                            </td>
                            <td>
                                <span>{{data.regex}}</span>
                            </td>
                            <td>
                                <span>{{data.url}}</span>
                            </td>
                            <td>
                                <span>{{data.method}}</span>
                            </td>
                            <td>
              <span>
                  <a v-show="!editr" @click="edit(key)">编辑</a>
                  <a v-show="editr" @click="save(key)">保存</a>
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
                    <div id="callBackPager" align="center"></div>
                </div>
            </div>
        </div>
    </div>
 <!--   <div class="row">
        <div class="col-md-1">
        </div>
        <div class="col-md-3 col-md-offset-8">
            &lt;!&ndash;<select class="form-control" v-model="selected">
                <option v-for="option in options" v-bind:value="option">
                    {{ option }}
                </option>
            </select>&ndash;&gt;
            <v-select :value.sync="selected" :options="options"></v-select>
        </div>
    </div>
    <div class="row">
        <table class="table table-condensed">
            <tr>
                <td>任务ID</td>
                <td><input type="text" class="form-control" v-model="edit_data.job_id"></td>
                <td>任务描述</td>
                <td><input type="text" class="form-control" v-model="edit_data.job_description"></td>
                <td>任务组</td>
                <td>
                    &lt;!&ndash;<input type="text" class="form-control" v-model="edit_data.job_group">&ndash;&gt;
                    <v-select :value.sync="edit_data.job_group" :options="options"></v-select>
                </td>
            </tr>
            <tr>
                <td>执行规则</td>
                <td><input type="text" class="form-control" v-model="edit_data.cron_expression"></td>
                <td>执行url</td>
                <td><input type="text" class="form-control" v-model="edit_data.url"></td>
                <td>请求方式</td>
                <td><input type="text" class="form-control" v-model="edit_data.method"></td>
            </tr>
            <tr>
                <td>请求JSON</td>
                <td><input type="text" class="form-control" v-model="edit_data.json"></td>
                <td>邮件接收人</td>
                <td>
                    &lt;!&ndash;<input type="text" class="form-control" v-model="edit_data.mailto">&ndash;&gt;
                    <v-select :value.sync="edit_data.mailto" multiple :options="userList"></v-select>
                </td>
                <td>邮件抄送人</td>
                <td>
                    &lt;!&ndash;<input type="text" class="form-control" v-model="edit_data.mailcc">&ndash;&gt;
                    <v-select :value.sync="edit_data.mailcc" multiple :options="userList"></v-select>
                </td>
            </tr>
            <tr>
                <td>邮件密送人</td>
                <td>
                    &lt;!&ndash;<input type="text" class="form-control" v-model="edit_data.mailbcc">&ndash;&gt;
                    <v-select :value.sync="edit_data.mailbcc" multiple :options="userList"></v-select>
                </td>
                <td>邮件主题</td>
                <td><input type="text" class="form-control" v-model="edit_data.subject"></td>
                <td>短信接收人</td>
                <td>
                    &lt;!&ndash;<input type="text" class="form-control" v-model="edit_data.smsto">&ndash;&gt;
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
    </div>-->

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
    export default {
        components: {vSelect},
        data(){
            return {
                curr: "",
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
            this.GetUser();
            this.GetGroup();
        },
        watch: {
            selected(val){
                this.GetData(1, 10, val)
            }
        },
        methods: {
            GetUser(){
                this.$http.post(FIND_ALL_USER_PATH)
                        .then(function (data) {
                            this.$set('userList', data.body.data);
                        })
            },
            GetGroup(){
                this.$http.post(GET_GROUP_BY_USER, {"username": JSON.parse(GET_COOKIE('user')).username})
                        .then((response)=> {
                            var _self = this;
                            _self.$set('selected', response.data.data[0]);
                            _self.$set('options', response.data.data);
//                            this.GetData(1, 10, this.selected)
                            //进入页面后第一次获取数据
                            _self.GetData(1, 10, _self.selected, function (totalRecord) {
                                $('#callBackPager').extendPagination({
                                    totalCount: totalRecord,
                                    showCount: 5,
                                    limit: 10,
                                    callback: function (curr, limit, totalCount) {
                                        _self.$set('curr', curr);
                                        _self.GetData(curr, limit, _self.selected);
                                    }
                                });
                            });
                        })
            },
            GetData(pageNo, pageSize, group, callback){
                this.$http.post(FIND_WITH_PAGE_AND_GROUP, {
                    "pageSize": pageSize,
                    "pageNum": pageNo,
                    "jobGroup": group
                })
                        .then(function (data) {
                            this.$set('table', data.body.data.data);
                            if (typeof callback === 'function') {
                                callback(data.body.data.totalRecord)
                            }
                        })
            },
            add(){
                this.$set('edit_data', {});
                this.$http.post(SAVE_PATH, this.edit_data)
                        .then((response)=> {
                            this.$set('edit_data', {});
                            this.GetData(1, 10, this.selected);
                        })
            },
            edit(key){
                this.$set('edit_data', this.table[key]);
                this.$set('editr', true);
            },
            save(key){
//                var key = key || "";
                this.$http.post(SAVE_PATH, key ? this.table[key] : this.edit_data)
                        .then((response)=> {
                            this.$set('edit_data', {});
                            this.GetData(1, 10, this.selected);
                            this.$set('editr', false);
                        })
            },
            start(id){
                this.$http.post(START_PATH, {"job_id": id})
                        .then((response)=> {
                            this.GetData(1, 10, this.selected)
                        })
            },
            stop(){
                this.$http.post(STOP_PATH, {"job_id": id})
                        .then((response)=> {
                            this.GetData(1, 10, this.selected)
                        })
            },
            remove(id, group, status){
                this.$http.post(REMOVE_PATH, {
                    'job_id': id,
                    'job_group': group,
                    'job_status': status
                })
                        .then((response)=> {
                            var _self = this;
                            _self.GetData(_self.curr, 10, _self.selected);
                        })
            }
        }
    }
</script>