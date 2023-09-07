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
    "ipFormLabelWidth": "100px",
    "userFormLabelWidth": "100px",
    "groupFormLabelWidth": "100px",
    "authorityFormLabelWidth": "100px",
    "authClientFormWidth": "100px",
    "authClientRegisterFormWidth": "100px",
    "width": window.innerWidth,
    "userForm": false,
    "userTable": false,
    "noticeTable": false,
    "topicTable": false,
    "topicLoad": true
})