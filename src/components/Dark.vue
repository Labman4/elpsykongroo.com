<template>
    <el-button id="darkMode" size=small @click="visible.authFormVisible = true" 
    v-if = "access.expires_in == 0"
    >
    </el-button>
    <el-dialog v-model="visible.authFormVisible" width="65%">
      <el-form 
        label-position="left"
        label-width="auto" 
        :fit-input-width=true	>
         <el-form-item label="type">
          <el-select v-model="access.grant_type" placeholder="grant type">
            <!-- <el-option label="-----------" value="" /> -->
            <el-option label="Authorization Code" value="code" />
            <el-option label="Implicit" value="token" />
            <el-option label="Resource Owner Password Credentials" value="password" />
            <el-option label="Client Credentials" value="client_credentials" />
            <el-option label="pkce" value="pkce" />
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
          <el-button @click="visible.authFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="oauth()" >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { axios, countDown }  from '~/assets/ts/axio';
import { env } from '~/assets/ts/env';
import { access } from '~/assets/ts/access';
import { ElButton, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElInput } from 'element-plus';
import { toggleDark } from '~/composables';
import { code, pkceCode } from '~/assets/ts/handleAuthCode';
import { visible } from '~/assets/ts/visible';

const github = () => {
  const githubOption = {
      baseURL: "https://github.com/login/",
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
      }          
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


const implicit = () => {
  const authOption = {
      baseURL: env.authUrl,
      url: "/oauth2/token",
      method: "POST",
      data: {
        response_type: 'token',
        client_id: access.client_id,
        redirect_uri: env.redirectUrl,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },            
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

const authorizationCode = () => {
  const authOption = {
      baseURL: env.authUrl,
      url: "/oauth2/token",
      method: "POST",
      data: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: window.location.href.split("?")[0],
        // clientId: access.client_id
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },  
      auth : { 
          username : access.client_id , 
          password : access.client_secret 
      },   
      // withCredentials: true                  
    }
    axios(authOption).then(function (response) {
      if(response.data.access_token != "") {
        access.refresh_token = response.data.refresh_token;
        access.grant_type = "authorization_code";
        access.update(response.data.access_token, response.data.expires_in);
        // userInfo();
        toggleDark();
        countDown();
      }
    }) 
}


const userInfo = () => {
  const authOption = {
      baseURL: env.authUrl,
      url: "/userinfo",
      method: "POST",
      headers: {
      'Authorization': 'Bearer '+ access.access_token
      },  
      // auth : { 
      //     username : access.client_id , 
      //     password : access.client_secret 
      // } , 
      withCredentials: true                 
    }
    axios(authOption).then(function (response) {
        console.log(response.data)
    }) 
}

const oidc = () => {
  const authOption = {
      baseURL: env.authUrl,
      url: "/userinfo",
      method: "POST",
      headers: {
      'Authorization': 'Bearer '+ access.access_token
      },  
      // auth : { 
      //     username : access.client_id , 
      //     password : access.client_secret 
      // } , 
      withCredentials: true                 
    }
    axios(authOption).then(function (response) {
        console.log(response.data)
    }) 
}

const passowrd = () => {
  const authOption = {
      baseURL: env.authUrl,
      url: "/oauth2/token",
      method: "POST",
      data: {
        grant_type: 'password',
        username: "",
        password: "",
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

const clientCredentials = () => {
  const option = {
      baseURL: env.authUrl,
      url: "/oauth2/token",
      method: "POST",
      data: {
        grant_type: "client_credentials"
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
}

const oauth = () =>{  
  visible.authFormVisible = false;
  if (access.grant_type == "client_credentials") {
      clientCredentials();   
  } else if (access.grant_type == "password") {
      passowrd();
  } else if (access.grant_type == "code") {
      authorizationCode();
  } else if (access.grant_type == "token") {
      implicit();
  } else if (access.grant_type == "github") {
      github();
  } else if (access.grant_type == "pkce") {
     pkceCode();
  } 
}

</script>

<style scoped>
  #darkMode {
    position:absolute;right: 50%; top:10px;
    border: 0px;
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