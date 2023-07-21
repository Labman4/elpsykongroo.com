<template>
    <el-icon class="phoneMode" @click="qrcodeLogin" ><Iphone /></el-icon>
    <el-icon class="whiteMode" @click="visible.webauthnFormVisible = true" v-if="access.sub == '' ">  <User /></el-icon>
    <el-icon class="whiteMode" v-if="access.sub != '' " @click="loadUser()"> {{ access.sub }} </el-icon>

    <el-dialog v-model="visible.webauthnFormVisible" width="65%">
      <el-form 
        v-loading="visible.loading"
        element-loading-text="Logining..."
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
          <el-button @click="webauthnLogin()">login</el-button>
          <el-button type="primary" @click="webauthnRegister()" >
            register
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="userForm" title="user" width="80%" >
      <el-button type="primary" @click="addAuthenticator()">add authenticator</el-button>
      <el-form :model="userFormData">
        <el-form-item label="email" :label-width=visible.userFormLabelWidth :inline="true">
          <el-input v-model="userFormData.email"/>       
          <el-button type="primary" @click="validateEmail()" v-if="!access.email_verified && userFormData.email != 'null'">validate</el-button>

        </el-form-item>
        <el-form-item label="nickName" :label-width=visible.userFormLabelWidth>
          <el-input v-model="userFormData.nickName" />
        </el-form-item>
        <el-form-item label="password" :label-width=visible.userFormLabelWidth>
          <el-input v-model="userFormData.password" />
        </el-form-item>
        <!-- <el-form-item label="username" :label-width=visible.userFormLabelWidth>
          <el-input v-model="userFormData.username" />
        </el-form-item>  -->
        <el-button type="primary" @click="loadInfo()">userInfo</el-button>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userForm = false">Cancel</el-button>
          <el-button type="primary" @click="updateUser()" >
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
    title="Warning"
    width="80%"
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
    title="Warning"
    width="80%"
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
    width="50%"
    align-center>

    <QrcodeVue :value=access.qrcodeUrl :size="200" level="H" />  
  
  </el-dialog>
  <user ref="u"></user>

</template>

<script lang="ts" setup >
import { User, Iphone } from '@element-plus/icons-vue';
import { webauthnRegister, webauthnLogin, tmpLogin, logout, qrcodeLogin } from '~/assets/ts/login';
import { access } from '~/assets/ts/access';
import { visible } from "~/assets/ts/visible";
import { env } from '~/assets/ts/env';
import axios from 'axios';
import * as webauthnJson from "@github/webauthn-json";
import bcrypt from 'bcryptjs';
import { ElNotification } from 'element-plus';
import user from '~/components/api/User.vue';
import QrcodeVue from 'qrcode.vue';
import { refreshlogin } from '~/assets/ts/login';
 
const u = ref<InstanceType<typeof user> | null>(null)

const userr:User = {
  id: "",
  email: "",
  nickName: "",
  username: "",
  password: "",
  createTime: "",
  updateTime: "",
  locked: ""
}

interface User {
  id: string
  email: string
  nickName: string
  username: string
  password: string
  createTime: string
  updateTime: string
  locked: string
}

let inituserFormData  = () => ({
  email: "",
  nickName: "",
  username: "",
  password: "",
  locked: false,
})

let userFormData = reactive(inituserFormData());
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

const loadUser = () => {
  const option = {
      baseURL: env.apiUrl,
      url: "auth/user/" + access.sub,
      method: "GET",
      headers: {
      'Authorization': 'Bearer '+ access.access_token
      },
  }
  axios(option).then(function(response){
      userFormData.email = response.data.email
      userFormData.nickName = response.data.nickName
      userFormData.password = response.data.passowrd
      userr.username = response.data.username
      userForm.value = true
  })
}

async function loadInfo () {
  await u.value?.loadUserInfo(userr)
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
  axios(option).then(function(response){
  })
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
        // withCredentials: true                        
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

const updateUser = () =>{
  userFormData.username = access.sub;
  const option = {
      baseURL: env.apiUrl,
      url: "auth/user/patch",
      method: "PATCH",
      data: userFormData,
      headers: {
      'Authorization': 'Bearer '+ access.access_token
      },
    }
    if (userFormData.password == "" || userFormData.password == undefined){
        axios(option).then(function (response) {
          if(response.status == 200) {
            userForm.value = false;
          }
        })
    } else if (userFormData.password.startsWith("{bcrypt}")) {
        axios(option).then(function (response) {
          if(response.status == 200) {
            userForm.value = false;
          }
        })
    } else {
        bcrypt.hash(userFormData.password, 10).then(function(hash) {
          userFormData.password = '{bcrypt}' + hash ;
          axios(option).then(function (response) {
            if(response.status == 200) {
              userForm.value = false;
            }
          })
        });
    }
}

</script>

<style scoped>
 .phoneMode {
    position:absolute;right: 20px; top:15px;
    color: #409EFF;
  }
  .whiteMode {
    position:absolute;right: 50px; top:15px;
    color: #409EFF;
  }
</style>