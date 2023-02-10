<template>
    <el-button id="darkMode" size=small @click="openAuth()" v-if = "access.expires_in == 0">{{ access.expires_in }}
    </el-button>
    <el-dialog v-model="dialogFormVisible" width="65%">
      <el-form 
        label-position="left"
        label-width="auto" 
        :fit-input-width=true	>
         <el-form-item label="type">
          <el-select v-model="access.grant_type" placeholder="grant type">
            <!-- <el-option label="-----------" value="" /> -->
            <el-option label="client credentials" value="client_credentials" />
            <el-option label="authorization code" value="authorization_code" />
            <el-option label="access token" value="access_token" />
            <el-option label="github" value="github" />
          </el-select>
        </el-form-item>
        <el-form-item label="client" label-width="auto"  v-if = "access.grant_type != 'authorization_code'">
          <el-input v-model="access.client_id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="secret" label-width="auto"  v-if = "access.grant_type != 'authorization_code'">
          <el-input v-model="access.client_secret" type="password" :show-password=true autocomplete="off" @keyup.enter="oauth" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="oauth()" >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { axios, refreshToken }  from '~/assets/js/axio';
import { env } from '~/assets/js/env';
import { access } from '~/assets/js/access';
import { ElButton, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElInput } from 'element-plus';
import { toggleDark } from '~/composables';

const callbackUrl = window.location.href;
const code = new URL(callbackUrl).searchParams.get('code');

const timeCount= ref(0);
const dialogFormVisible = ref(false);

if (code != null) {
  if (code.length > 20) {
     access.grant_type = 'access_token';
  } else {
    access.grant_type = 'github';
  }
  openAuth();
}

function openAuth() {
  dialogFormVisible.value = true
}

const github = () => {
  const githubOption = {
      baseURL: "https://github.com/login/oauth/access_token",
      url: "oauth/access_token",
      method: "POST",
      data: {
        code: code,
        client_id: access.client_id,
        client_secret: access.client_secret,
        redirect_uri: env.redirectUrl
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },  
      // auth : { 
      //     username : access.client_id , 
      //     password : access.client_secret 
      // } ,           
    }
    axios(githubOption).then(function (response) {
      if(response.data.access_token != "") {
        // access.refresh_token = response.data.refresh_token;
        // access.grant_type = "authorization_code";
        // access.update(response.data.access_token, response.data.expires_in);
        toggleDark();
        // countDown();
      }
    }) 
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
          username : access.client_id , 
          password : access.client_secret 
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
  if (access.grant_type == "client_credentials") {
    const option = {
      baseURL: env.authUrl,
      url: "/oauth2/token",
      method: "POST",
      data: {
        grant_type: access.grant_type
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },           
      auth : { 
          username : access.client_id , 
          password : access.client_secret 
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
  } else if (access.grant_type == "authorization_code") {
    window.open(env.apiUrl+"/oauth2/authorization/spring");
  } else if (access.grant_type == "access_token") {
      auth();
  } else if (access.grant_type == "github") {
      github();
  } 
}

const countDown = () => {
  timeCount.value = window.setInterval(() => {
    access.expires_in--;
    if(access.expires_in == 10) {
      refreshToken();
    } else if(access.expires_in == 0) {
      clearAcess();
      toggleDark();
      clearInterval(timeCount.value);
    }
  }, 1000)
}

const clearAcess = () => {
    access.refresh_token = "";
    access.access_token = "";
}

</script>

<style scoped>
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
    width: 90%;
  }
  .el-input {
    width: 90%;
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
</style>