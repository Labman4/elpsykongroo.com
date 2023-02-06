<template>
    <el-button id="darkMode" size=small @click="openAuth()" v-if = "access.expires_in <= 0">
    </el-button>
    <el-dialog v-model="dialogFormVisible" title="">
      <el-form :model="form">
         <el-form-item label="type" :label-width="formLabelWidth">
          <el-select v-model="form.grant_type" placeholder="">
            <el-option label="-----------" value="" />
            <el-option label="client credentials" value="client_credentials" />
            <el-option label="authorization code" value="authorization_code" />
            <el-option label="access token" value="access_token" />
          </el-select>
        </el-form-item>
        <el-form-item label="client" :label-width="formLabelWidth"  v-if = "form.grant_type == 'client_credentials' || form.grant_type == 'access_token' ">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="secret" :label-width="formLabelWidth"  v-if = "form.grant_type == 'client_credentials' || form.grant_type == 'access_token' ">
          <el-input v-model="form.secret" type="password" :show-password=true autocomplete="off" @keyup.enter="oauth" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="oauth" >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import axios from 'axios';
import { env } from '~/env';
import { access } from '~/access';
import { ElButton, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElInput } from 'element-plus';
import { toggleDark } from '~/composables';

const callbackUrl = window.location.href;
const code = new URL(callbackUrl).searchParams.get('code');

const timeCount= ref(0);
const dialogFormVisible = ref(false);
const formLabelWidth = "auto";
const form = reactive({
  name: '',
  secret: '',
  grant_type: '',
});

if (code != null) {
  form.grant_type = 'access_token';
  openAuth();
}

function openAuth() {
  dialogFormVisible.value = true
}
function auth() {
  const authOption = {
      baseURL: env.authUrl,
      url: "/oauth2/token",
      method: "POST",
      data: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: env.redirectUrl,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },  
      auth : { 
          username : form.name , 
          password : form.secret 
      } ,           
    }
    axios(authOption).then(function (response) {
      if(response.data.access_token != "") {
        access.refresh_token = response.data.refresh_token;
        access.grant_type = "authorization_code";
        access.update(response.data.access_token, response.data.expires_in);
        toggleDark();
        countDown();
      }
    }) 
}

function oauth() {  
  dialogFormVisible.value = false;
  if (form.grant_type == "client_credentials") {
    const option = {
      baseURL: env.authUrl,
      url: "/oauth2/token",
      method: "POST",
      data: {
        grant_type: form.grant_type
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },           
      auth : { 
          username : form.name , 
          password : form.secret 
      } ,
    }
    axios(option).then(function (response) {
      if(response.data.access_token != "") {
        access.grant_type = 'client_credentials';
        access.update(response.data.access_token, response.data.expires_in);
        toggleDark();
        countDown();
      }
    })      
  } else if (form.grant_type == "authorization_code") {
    window.open(env.apiUrl+"/oauth2/authorization/spring");
  } else if (form.grant_type == "access_token") {
      auth();
  } 
}

function countDown() {
  timeCount.value = window.setInterval(() => {
    access.expires_in--;
    if(access.expires_in == 10) {
      if(access.refresh_token != "") {
        const refreshOption = {
          baseURL: env.authUrl,
          url: "/oauth2/token",
          method: "POST",
          data: {
            grant_type: 'refresh_token',
            refresh_token: access.refresh_token,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },  
          auth : { 
            username : form.name , 
            password : form.secret 
          } ,           
        }
        axios(refreshOption).then(function (response) {
          if(response.data.access_token != "") {
            access.update(response.data.access_token, response.data.expires_in);
          }
        })  
      } 
    }
    if(access.expires_in == 0) {
      toggleDark();
      clearInterval(timeCount.value);
    }
  }, 1000)
}
</script>

<style>
  #darkMode {
    position:absolute;right: 20px; top:10px;
    border: 0px;
  }
  .darkbutton2 {
    height: 10px;
    position:absolute;right: 40px;top: 10px;
  }

  .el-button--text {
    margin-right: 15px;
  }
  .el-select {
    width: 300px;
  }
  .el-input {
    width: 300px;
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
</style>