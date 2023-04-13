<template>
    <el-icon id="whiteMode" @click="webauthnFormVisible = true" > <User /></el-icon>
    <el-dialog v-model="webauthnFormVisible" width="65%">
      <el-form 
        v-loading="loading"
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
          <el-button @click="loading=false">cancel</el-button>
          <el-button @click="webauthnLogin()">login</el-button>
          <el-button type="primary" @click="webauthnRegister()" >
            register
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script lang="ts" setup >
import { access } from '~/assets/ts/access';
import { pkce } from '~/assets/ts/pkce';

import { User} from '@element-plus/icons-vue';
import axios from "axios";
import { env } from "~/assets/ts/env";
// const attestation:AttestationConveyancePreference = "direct";
import * as webauthnJson from "@github/webauthn-json";
import { visible } from "~/assets/ts/visible";
import { ElNotification } from 'element-plus';
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

const callbackUrl = window.location.href;
const redirect = new URL(callbackUrl).searchParams.get('redirect_uri');
const state = new URL(callbackUrl).searchParams.get('state');

const referrer = document.referrer;
var idp;
const webauthnFormVisible = ref(false);
const loading = ref(false);

if (referrer != "" && referrer != undefined) {   
    idp = referrer.split(".")[0].split("//")[1];
    console.log(idp);
    if (idp != "www" && document.domain != "localhost" && document.domain != "127.0.0.1") {
        webauthnFormVisible.value = true
    }
}

if (redirect != null && state != null) {
    webauthnFormVisible.value = true
}

const webauthnRegister = () => {
    if (access.username.length > 0) {
        loading.value = true;
        const registerOption = {
            baseURL: env.authUrl,
            url: "/register",
            method: "POST",
            data: {
                username: access.username,
                display: access.username,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // "Access-Control-Allow-Origin": "*",
                // "Access-Control-Allow-Credentials": "true"
            },
            // withCredentials: true                        
        }
        axios(registerOption).then(async function (response) {
            const publicKeyCredential = await webauthnJson.create(response.data);
            const option = {
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
            axios(option).then(function (response) {
                loading.value = false;
                if (response.data == 200) {
                    ElNotification({
                        title: 'Register success',
                        message: 'have fun with login',
                        duration: 5000,
                    })
                } else {
                  ElNotification({
                        title: 'Register failed',
                        message: 'this user already exist',
                        duration: 5000,
                  })
                }
            });
        });
    }
}
async function  webauthnLogin() {
    if (access.username.length > 0) {
        loading.value = true;
        const loginOption = {
            baseURL: env.authUrl,
            url: "/login",
            method: "POST",
            data: {
                username: access.username,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            withCredentials: true               
        }
        axios(loginOption).then(async function (response) {
            if(response.data == 200) {
                if (document.domain != "localhost") {
                    window.location.href = "https://oauth2-proxy.elpsykongroo.com/web";
                } else {
                    idp = "www";
                    window.location.href=env.authUrl+"/oauth2/authorization/" + idp;
                    // loading.value = false;
                    // access.grant_type = "code";
                    // visible.webauthnFormVisible = false;
                    // visible.authFormVisible = true;
                }
            } else {
                const publicKeyCredential = await webauthnJson.get(response.data);
                const indexOption = {
                    baseURL: env.authUrl,
                    url: "/welcome",
                    method: "POST",
                    data: {
                        username: access.username,
                        credential: JSON.stringify(publicKeyCredential),
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },   
                    withCredentials: true      
                }
                axios(indexOption).then(function (response) {
                    if(response.data == 200) {
                        loading.value = false;
                        visible.webauthnFormVisible = false
                       

                        if (redirect != null && state != null) {
                            window.location.href = env.authUrl + "/oauth2/authorize" + window.location.search;
                        } else if (idp != "" && idp != undefined ) {
                            window.location.href=env.authUrl+"/oauth2/authorization/" + idp;
                        } else if (document.domain == "localhost" || document.domain == "elpsykongroo.com") {
                            if (document.domain != "localhost") {
                                window.location.href = "https://oauth2-proxy.elpsykongroo.com/web";
                            } else {
                                idp = "www";
                                window.location.href=env.authUrl+"/oauth2/authorization/" + idp;
                            }
                            // pkce();        
                        } else if (idp == "") {
                            if (document.domain != "localhost") {
                                window.location.href = "https://login.elpsykongroo.com";
                            } else {
                                idp = "www";
                                window.location.href=env.authUrl+"/oauth2/authorization/" + idp;
                            }                          
                            // pkce();        
                        }
                    }
                });
            }
        })
    }
}

</script>

<style scoped>
  #whiteMode {
    position:absolute;right: 20px; top:15px;
    color: #409EFF;
  }
</style>