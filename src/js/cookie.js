/**
 * Created by Me1kro on 16/12/7.
 */
export const SET_COOKIE = function (name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};
export const GET_COOKIE = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
};
export const DEL_COOKIE = function(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=GET_COOKIE(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}