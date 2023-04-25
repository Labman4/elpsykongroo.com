<template>
    <el-icon class="whiteMode" @click="visible.webauthnFormVisible = true" v-if="access.username == '' ">  <User /></el-icon>
    <el-icon class="whiteMode" v-if="access.username != '' " @click="loadUser()"> {{ access.username }} </el-icon>

    <el-dialog v-model="visible.webauthnFormVisible" width="65%">
      <el-form 
        v-loading="visible.loading"
        element-loading-text="Logining..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(122, 122, 122, 0.8)"

        label-position="left"
        label-width="auto" 
        :fit-input-width=true	>
        <el-form-item label="name" label-width="auto">
          <el-input v-model="access.username" @keyup.enter="webauthnLogin()" />
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

    <el-dialog v-model="userForm" title="user">
      <el-button type="primary" @click="addAuthenticator()">add authenticator</el-button>
    <el-form :model="userFormData">
      <el-form-item label="email" :label-width=visible.userFormLabelWidth :inline="true">
        <el-input v-model="userFormData.email"/>       
        <el-button type="primary" @click="validateEmail()" v-if="userFormData.email !=null ">validate</el-button>

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
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="userForm = false">Cancel</el-button>
        <el-button type="primary" @click="updateUser()" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="visible.tmpLogin"
    title="Warning"
    width="30%"
    align-center
  >
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
</template>

<script lang="ts" setup >
import { User } from '@element-plus/icons-vue';
import { webauthnRegister, webauthnLogin, tmpLogin } from '~/assets/ts/login';
import { access } from '~/assets/ts/access';
import { visible } from "~/assets/ts/visible";
import { env } from '~/assets/ts/env';
import axios from 'axios';
import * as webauthnJson from "@github/webauthn-json";
import bcrypt from 'bcryptjs';

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
      url: "auth/user/" + access.username,
      method: "GET",
      headers: {
      'Authorization': 'Bearer '+ access.access_token
      },
  }
  axios(option).then(function(response){
      userFormData.email = response.data.email
      userFormData.nickName = response.data.nickName
      userFormData.password = response.data.passowrd
      userForm.value = true
  })
}

const validateEmail = () => {
  const option = {
      baseURL: env.authUrl,
      url: "/email/verify" ,
      method: "POST",
      data: {
        username: access.username
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
      username: access.username
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
        url: "/finishauth",
        method: "POST",
        data: {
            credname: access.username,
            username: access.username,
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
      console.log(response.data);
    })

  })
}

const updateUser = () =>{
  userFormData.username = access.username;
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
  .whiteMode {
    position:absolute;right: 20px; top:15px;
    color: #409EFF;
  }
</style>