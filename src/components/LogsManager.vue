<template>
    <div class="wrapper-md">
        <div class="panel panel-default">
            <div v-if="user_info.role=='root'">
                <div class="panel-heading">
                    删除日志
                    <!-- <div class="text-right">
                         <v-select :value.sync="selected" :options="options"></v-select>
                     </div>-->
                </div>
                <div class="row wrapper">
                    <table class="table no_nomarl">
                        <tr>
                            <td>按监控任务执行日期删除日志记录:</td>
                            <td>执行日期</td>
                            <td>
                                <datepicker :value.sync="state.date" :format="format" class="form-control"></datepicker>
                            </td>
                            <td>
                                <a class="btn btn-default" @click="del_day()">按天删除</a>
                            </td>
                        </tr>
                        <tr>
                            <td>按任务组删除所属全部监控任务日志:</td>
                            <td>任务组</td>
                            <td>
                                <v-select :value.sync="group" multiple :options="options"></v-select>
                            </td>
                            <td><a class="btn-default btn" @click="del_group()">按组删除</a></td>
                        </tr>
                        <tr>
                            <td>按任务ID删除对应日志</td>
                            <td>任务ID</td>
                            <td>
                                <v-select :value.sync="taskid" multiple :options="taskids"></v-select>
                            </td>
                            <td><a class="btn-default btn" @click="del_taskid()">按任务ID删除</a></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="panel-heading">
                日志列表
            </div>
            <div class="row wrapper">
                <div class="text-right padder">
                   <span style="    position: relative;
    top: -10px;">任务组:</span>
                    <v-select :value.sync="selected" :options="options"
                              style="max-width: 460px;display: inline-block;"></v-select>
                    <span style="    position: relative;
    top: -10px;">任务ID:</span>
                    <v-select :value.sync="taskid_selected" :options="taskids_options"
                              style="max-width: 460px;display: inline-block;"></v-select>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th>任务ID</th>
                            <th>任务组</th>
                            <th>响应数据</th>
                            <th>执行时间</th>
                            <th>执行结果</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="data in table">
                            <td>{{data.job_id}}</td>
                            <td>{{data.job_group}}</td>
                            <td>
                                <!--<span class="lang">{{data.response_data}}</span>-->
                                <input style="border: none" readonly class="scroll form-control " type="text"
                                       value="{{data.response_data}}">
                            </td>
                            <td>{{data.execute_time}}</td>
                            <td>{{data.result_code}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <!-- 页码栏 -->
                    <v-nav v-show="taskid_selected==''" :cur.sync="cur" :all.sync="totalPage"
                           class="text-center"></v-nav>
                    <v-nav v-show="taskid_selected!=''" :cur.sync="cur2" :all.sync="totalPage"
                           class="text-center"></v-nav>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
            GET_GROUP_BY_USER,
            FIND_LOGS_PATH,
            DELETE_LOGS_GROUP_PATH,
            DELETE_LOGS_DAY_PATH,
            DELETE_LOGS_ALL_PATH,
            FIND_ALL_USER_PATH,
            DELETE_GROUP_BY_TASKID,
            GET_ALL_TASKID,
            GET_TASKID_BY_GROUP,
            GET_TASK_BY_TASKID
    } from '../common-path';
    import {GET_COOKIE} from '../js/cookie'
    import vSelect from 'vue-select'
    import Datepicker from 'vuejs-datepicker'
    import vNav from './vue-pagination.vue'
    let state = {
        date: new Date()
    };

    export default{
        data(){
            return {
                user_info: JSON.parse(GET_COOKIE('user')),
                state: state,
                cur: 1,
                cur2: 1,
                totalPage: "",
                table: [],
                format: 'yyyy-MM-dd',
                options: [],
                taskids_options: [],
                selected: "",
                taskid_selected: "",
                group: "",
                taskid: "",
                taskids: [],
            }
        },
        components: {vSelect, Datepicker, vNav},
        ready(){
            this.GetGroup();
            this.GetAllTaskId();
        },
        watch: {
            selected(val){
                this.taskid_selected = "";
                this.GetData(1, 10, val);
                this.GET_TASKID_BY_GROUP(val)
            },
            taskid_selected(val){
                this.GET_TASK_BY_TASKID(1, 10, val)
            },
            cur(val){
                this.GetData(val, 10, this.selected)
            },
            cur2(val){
                this.GET_TASK_BY_TASKID(val, 10, this.taskid_selected)
            }
        },
        methods: {
            /* listen(val){
             this.GetData(val, 10, this.selected)
             },*/
            GetGroup(){
                this.$http.post(GET_GROUP_BY_USER, {"username": JSON.parse(GET_COOKIE('user')).username})
                        .then((response)=> {
                            let _self = this;
                            _self.$set('selected', response.data.data[0]);
                            _self.$set('options', response.data.data);
                            //进入页面后第一次获取数据
//                            this.GetData(1, 10, this.selected);
                        })
            },
            GetAllTaskId(){
                this.$http.get(GET_ALL_TASKID).then((response)=> {
                    this.$set('taskids', response.data.data)
                })
            },
            GET_TASKID_BY_GROUP(job_group){
                this.$http.post(GET_TASKID_BY_GROUP, {job_group}).then((response)=> {
                    this.$set('taskids_options', response.data.data)
                })
            },
            GET_TASK_BY_TASKID(pageNum, pageSize, job_id){
                this.$http.post(GET_TASK_BY_TASKID, {
                    pageNum, pageSize, job_id
                })
                        .then(function (data) {
                            this.$set('table', data.body.data.data);
                            this.$set('cur2', pageNum);
                            this.$set('totalPage', data.body.data.totalPage);
                        })
            },
            GetData(pageNum, pageSize, jobGroup){
                this.$http.post(FIND_LOGS_PATH, {
                    pageNum, pageSize, jobGroup
                })
                        .then(function (data) {
                            this.$set('table', data.body.data.data);
                            this.$set('cur', pageNum);
                            this.$set('totalPage', data.body.data.totalPage);
                        })
            },
            del_day(){
                let _self = this;
                let d = new Date(this.state.date)
                let date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                this.$http.post(DELETE_LOGS_DAY_PATH, {day: $('.datepicker>input').val()}).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    _self.GetData(1, 10, this.selected);
                })

            },
            del_group(){
                let _self = this;
                this.$http.post(DELETE_LOGS_GROUP_PATH, {jobGroup: this.group}).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    _self.GetData(1, 10, this.selected);
                })

            },
            del_taskid(){
                let _self = this;
                this.$http.post(DELETE_GROUP_BY_TASKID, {job_id: this.taskid}).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error) : alert('success!');
                    _self.GetData(1, 10, this.selected);
                })
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

    .datepicker.form-control > input {
        width: 100%;
        height: 100%;
        border: none;
    }

    .no_nomarl tr td {
        white-space: inherit;
        text-overflow: inherit;
    }

</style>