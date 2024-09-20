import { reactive } from 'vue'

export const visible = reactive(
{
    "isDot": false,
    "webauthnFormVisible": false,
    "authFormVisible": false,
    "loading": false,
    "tmpLogin": false,
    "refreshlogin": false,
    "qrcode": false,
    "userInfoForm": false,
    "labelWidth": "100px",
    "dialogWidth": "85%",
    "width": window.innerWidth,
    "userForm": false,
    "userTable": false,
    "noticeTable": false,
    "topicTable": false,
    "topicLoad": true,
    "noticeDrawer": false,
    "loadingText": "Logining",
    "chatTable": false
})