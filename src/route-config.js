import Home from './components/Home.vue'
import TaskWatch from './components/TaskWatch.vue'
import LogsManager from './components/LogsManager.vue'
import TaskGroupM from './components/TaskGroupM.vue'
import UserManager from './components/UserManager.vue'
import EditUserInfo from './components/EditUserInfo.vue'
import Login from './components/Login.vue'

export default {
    '/':{
        component: Login
    },
    'home': {
        component: Home,
        subRoutes: {
            'task-watch': {
                component: TaskWatch
            },
            'task-grorp-m': {
                component: TaskGroupM
            },
            'user-manager': {
                component: UserManager
            },
            'logs-manager': {
                component: LogsManager
            },
            'edit-user-info':{
                component:EditUserInfo
            }
        }
    },
}