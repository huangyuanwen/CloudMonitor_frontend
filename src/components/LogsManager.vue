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
                    <table class="table">
                        <tr>
                            <td>按监控任务执行日期删除日志记录:</td>
                            <td>执行日期</td>
                            <td>
                                <datepicker :value="state.date" :format="format" class="form-control"></datepicker>
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
                            <!--<td><a @click="del_all()">删除全部日志</a></td>-->
                        </tr>
                    </table>
                </div>
            </div>

            <div class="panel-heading">
                日志列表
            </div>
            <div class="row wrapper">
                <div class="text-right">
                    <!--<v-select :value.sync="selected" :options="options"></v-select>-->
                    <select class="form-control" v-model="selected"
                            style="width: 200px;display: inline-block;margin-right: 15px">
                        <option v-for="option in options" value="{{option}}">{{option}}</option>
                    </select>
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
                            <td><span class="lang">{{data.response_data}}</span></td>
                            <td>{{data.execute_time}}</td>
                            <td>{{data.result_code}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <!-- 页码栏 -->
                    <v-nav :cur.sync="cur" :all.sync="totalPage" v-on:btn-click="listen" class="text-center"></v-nav>
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
            FIND_ALL_USER_PATH
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
                user_info:JSON.parse(GET_COOKIE('user')),
                state: state,
                cur: 1,
                totalPage:"",
                table: [],
                format: 'yyyy-MM-dd',
                options: [],
                selected: "",
                group: ""
            }
        },
        components: {vSelect, Datepicker, vNav},
        ready(){
            this.GetGroup();
        },
        watch: {
            selected(val){
                this.GetData(1, 10, val)
            },
            cur(val){
                this.GetData(val, 10, this.selected)
            }
        },
        methods: {
            listen(val){
                this.GetData(val, 10, this.selected)
            },
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
            GetData(pageNo, pageSize, group){
                this.$http.post(FIND_LOGS_PATH, {
                    "pageSize": pageSize,
                    "pageNum": pageNo,
                    "jobGroup": group
                })
                        .then(function (data) {
                            this.$set('table', data.body.data.data);
                            this.$set('cur', pageNo);
                            this.$set('totalPage', data.body.data.totalPage);
                        })
            },
            del_day(){
                let _self = this;
                let d = new Date(this.state.date)
                let date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                this.$http.post(DELETE_LOGS_DAY_PATH, {day: date}).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error): alert('success!');
                    _self.GetGroup();
                })

            },
            del_group(){
                let _self = this;
                this.$http.post(DELETE_LOGS_GROUP_PATH, {jobGroup: this.group}).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error): alert('success!');
                    _self.GetGroup();
                })

            },
            del_all(){
                let _self = this;
                this.$http.post(DELETE_LOGS_ALL_PATH).then((response)=> {
                    response.body.code == 0 ? alert(response.body.error): alert('success!');
                    _self.GetGroup();
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
</style>