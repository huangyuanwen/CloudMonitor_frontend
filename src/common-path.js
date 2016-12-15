/**
 * Created by Me1kro on 16/12/7.
 */
/**
 * 代理路径
 * dev ./CloudMonitor
 * prod .
 * @type {string}
 */
import config from '../conf/config'

let PORXY_URL = config.porxy.base;
/**
 * 登陆接口配置
 * @type {string}
 */
//用户登录
export const USER_LOGIN_PATH = PORXY_URL + "/user/userLogin";
/**
 * 监控任务
 * @type {string}
 */
//获取对应分组下的所有数据
export const FIND_WITH_PAGE_AND_GROUP = PORXY_URL + "/monitorJob/findWithPageAndGroup";
//获取所有分组
export const GET_GROUP_BY_USER = PORXY_URL + "/group/getGroupsByUser";
//启动任务
export const START_PATH = PORXY_URL + "/monitorJob/start";
//停止任务
export const STOP_PATH = PORXY_URL + "/monitorJob/stop";
//删除任务
export const REMOVE_PATH = PORXY_URL + "/monitorJob/delete";
//保存任务
export const SAVE_PATH = PORXY_URL + "/monitorJob/insertOrUpdate";
//获取用户列表
export const FIND_ALL_USER_PATH = PORXY_URL + "/user/findAllUserNames";
/**
 * 日志管理
 * @type {string}
 */
//获取任务日志
export const FIND_LOGS_PATH = PORXY_URL + "/logs/findWithPageAndGroup";
//按组删除任务日志
export const DELETE_LOGS_GROUP_PATH = PORXY_URL + "/logs/deleteByGroup";
//按天删除任务日志
export const DELETE_LOGS_DAY_PATH = PORXY_URL + "/logs/deleteByDay";
//删除所有日志
export const DELETE_LOGS_ALL_PATH = PORXY_URL + "/logs/deleteAll";
/**
 * 用户管理
 * @type {string}
 */
//插入或更新用户
export const USER_INSERT = PORXY_URL + "/user/insertOrUpdate";
//删除用户
export const USER_DELETE = PORXY_URL + "/user/delete";
//查找用户
export const FIND_USER_LIST = PORXY_URL + "/user/findAllWithPage";
/**
 * 任务组管理
 * @type {string}
 */
//新增任务组
 export const ADD_NEW_GROUP = PORXY_URL+"/group/insert";
//获取所有任务组
export const ALL_GROUP = PORXY_URL+"/group/findAllWithPage";
//编辑任务组
export const GROUP_UPDATE = PORXY_URL+"/group/update";
//删除任务组
export const DELETE_GROUP = PORXY_URL+"/group/delete";
//获取分组下对应用户
export const FIND_USER_BY_GROUP = PORXY_URL+"/group/getUsersByGroup";
//添加用户到对应任务组
export const ADD_USER_INSER_GROUP = PORXY_URL+"/group/addUserToGroup";
//删除指定任务组下的用户
export const DELETD_USER_GROUP = PORXY_URL+"/group/deleteUserFromGroup";
//新增联系人
 export const ADD_CONTACT_USER = PORXY_URL+"/group/addUserInfoToGroup";
//获取所有分组
export const GET_ALL_GROUPS__BY_USER = PORXY_URL+"/group/findAllByUser";
