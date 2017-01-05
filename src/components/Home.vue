<template>
    <nav class="navbar navbar-default" role="navigation">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <a class="navbar-brand" href="#">监控系统</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li v-link="{ path: '/home/task-watch',activeClass: 'active' }"><a>监控任务</a></li>
                    <li v-link="{ path: '/home/logs-manager',activeClass: 'active' }"><a>日志管理</a></li>
                    <li v-link="{ path: '/home/user-manager',activeClass:'active'}" v-show="isRoot==0"><a>用户管理</a></li>
                    <li v-link="{ path: '/home/task-grorp-m',activeClass:'active'}"><a>任务组管理</a></li>
                    <li v-link="{ path: '/home/edit-user-info',activeClass:'active'}" v-show="isRoot==1"><a>个人信息修改</a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right" ng-controller="QueryAccount.ctrl">
                    <li style="background: #f6f8f8">
                        <a v-link="{ path: '/'}" @click="logout()" title="注销" class="logout"></a>
                    </li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>

    <div class="container-fluid">
        <router-view></router-view>
    </div>


</template>

<script>
    import {GET_COOKIE, DEL_COOKIE} from '../js/cookie'
    export default {
        data() {
            return {
                isRoot: ''//判断用户权限
            }
        },
        ready(){
            GET_COOKIE('user') == null ? this.$router.go('/') :
                    JSON.parse(GET_COOKIE('user')).role == 'root' ? this.$set('isRoot', '0') : this.$set('isRoot', '1')
        },
        methods: {
            logout(){
                DEL_COOKIE('user')
            }
        }
    }
</script>
<style>
    .logout {
        background: url("../img/logout1x.png") 50% no-repeat;
        background-size: auto;
        height: 50px;
        width: 50px;
    }
</style>