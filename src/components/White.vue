<template>
    <el-icon class="phoneMode" @click="qrcodeLogin" ><Iphone /></el-icon>
    <el-icon class="whiteMode" @click="visible.webauthnFormVisible = true" v-if="access.sub == ''|| access.sub == undefined ">  <User /></el-icon>
    <el-icon class="whiteMode" v-if="access.sub != '' && access.sub != undefined " @click="openUser()"> {{ access.sub }} </el-icon>
    <el-badge class="message" :is-dot=visible.isDot v-if="access.sub == '' ">
      <el-icon @click="visible.noticeDrawer = true, noticeListByUser('', false)"><Message/></el-icon>
    </el-badge>
    <el-badge class="message" :is-dot=visible.isDot v-if="access.sub != '' ">
      <el-icon @click="visible.noticeDrawer = true, noticeListByUser(access.sub, false)"><Message/></el-icon>
    </el-badge>
    <el-dialog v-model="visible.webauthnFormVisible" width="65%">
      <el-form 
        v-loading=visible.loading
        :element-loading-text=visible.loadingText
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(122, 122, 122, 0.8)"
        @keyup.enter.prevent="webauthnLogin()"
        label-position="left"
        label-width="auto" 
        :fit-input-width=true	>
        <el-form-item label="name" label-width="auto">
          <el-input v-model="access.username" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible.loading=false">cancel</el-button>
          <el-button @click="webauthnLogin(), visible.loadingText= 'logining...'">login</el-button>
          <el-button type="primary" @click="webauthnRegister(), visible.loadingText= 'registering...'" >
            register
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="userForm" :width=visible.dialogWidth>
      <el-button type="primary" @click="addAuthenticator()">add authenticator</el-button>
      <el-form :model="userFormData">
        <el-form-item label="email" :label-width=visible.labelWidth :inline="true">
          <el-input v-model="userFormData.email"/>       
          <el-button type="primary" @click="validateEmail()" v-if="!access.email_verified && userFormData.email != 'null'">validate</el-button>
        </el-form-item>
        <el-form-item label="nickName" :label-width=visible.labelWidth>
          <el-input v-model="userFormData.nickName" />
        </el-form-item>
        <el-form-item label="password" :label-width=visible.labelWidth>
          <el-input v-model="userFormData.password" />
        </el-form-item>
        <!-- <el-form-item label="username" :label-width=visible.userFormLabelWidth>
          <el-input v-model="userFormData.username" />
        </el-form-item>  -->
        <el-button type="primary" @click="loadUserInfo(username)">userInfo</el-button>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userForm = false">Cancel</el-button>
          <el-button type="primary" @click="updateUser(userFormData, access.sub)" >
            Confirm
          </el-button>
          <el-button type="danger" @click="logout()" >
            logout
          </el-button>
        </span>
      </template>
    </el-dialog>

  <el-dialog
    v-model="visible.tmpLogin"
    :width=visible.dialogWidth
    align-center>
    <span>send email to add authenticator for new Device?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible.tmpLogin = false">Cancel</el-button>
        <el-button type="primary" @click="tmpLogin()">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="visible.refreshlogin"
    :width=visible.dialogWidth
    align-center>
    <span>redirect to refresh access?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible.refreshlogin = false">later</el-button>
        <el-button type="primary" @click="refreshlogin(access.sub)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog 
    v-model="visible.qrcode"
    :width=visible.dialogWidth>
    <QrcodeVue :value=access.qrcodeUrl :size="200" level="H" /> 
  </el-dialog>
  <Notice></Notice>
</template>

<script lang="ts" setup >
import { User, Iphone, Message } from '@element-plus/icons-vue';
import { webauthnRegister, webauthnLogin, tmpLogin, logout, qrcodeLogin } from '~/assets/ts/login';
import { access } from '~/assets/ts/access';
import { visible } from "~/assets/ts/visible";
import { env } from '~/assets/ts/env';
import axios from 'axios';
import * as webauthnJson from "@github/webauthn-json";
import { ElLoading, ElNotification } from 'element-plus';
import QrcodeVue from 'qrcode.vue';
import { refreshlogin } from '~/assets/ts/login';
import { loadUser, noticeListByUser, updateUser, loadUserInfo } from '~/assets/ts/commonApi';
import { userFormData } from '~/assets/ts/dataInterface'
import Notice from '~/components/api/Notice.vue';

const username = ref("")
const userForm = ref(false)

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `

const openUser = async() => {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  const currentUser = await loadUser()
  nextTick(() => {
    loadingInstance.close()
  })
  if (currentUser.username == "" || currentUser.username == undefined) {
    ElMessageBox.alert("load user error, please try again later")
    return
  }
  userFormData.email = currentUser.email
  userFormData.nickName = currentUser.nickName
  userFormData.password = currentUser.password
  username.value = currentUser.username
  userForm.value = true
}

const validateEmail = () => {
  const option = {
      baseURL: env.authUrl,
      url: "/email/verify" ,
      method: "POST",
      data: {
        username: access.sub
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+ access.access_token
      },
  }
  axios(option)
}

const addAuthenticator = () => {
  const option = {
    baseURL: env.authUrl,
    url: "authenticator/add",
    method: "POST",
    data: {
      username: access.sub
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(async function (response) {
    const publicKeyCredential = await webauthnJson.create(response.data);
    const finishOption = {
        baseURL: env.authUrl,
        url: "/finishAuth",
        method: "POST",
        data: {
            credname: access.sub,
            username: access.sub,
            credential: JSON.stringify(publicKeyCredential),
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Credentials": "true"
        }, 
        withCredentials: true                        
    }
    axios(finishOption).then(function (response) { 
      if (response.data == 200) {
            ElNotification({
                title: 'add authenticator success',
                message: 'please logout and login again',
                duration: 5000,
            })
        }    
      })
  })
}
</script>

<style scoped>
 .phoneMode {
    position:absolute;right: 20px; top:15px;
    color: #409EFF;
  }
  .whiteMode {
    position:absolute;right: 80px; top:15px;
    color: #409EFF;
  }
  .message {
    position:absolute;right: 50px; top:15px;
    color: #409EFF;
  }
</style>