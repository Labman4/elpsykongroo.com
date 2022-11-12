<template>
    <el-button id="darkMode" size=small @click="openAuth()">
        <!-- <i inline-flex  i="dark:ep-moon ep-sunny" /> -->

      <!-- <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span> -->
    </el-button>
    <!-- <el-button class="datkbutton2" @click="dialogFormVisible = true">
        <i inline-flex  i="dark:ep-moon ep-sunny" />
    </el-button> -->
    <el-dialog v-model="dialogFormVisible" title="">
      <el-form :model="form">
         <el-form-item label="grant_type" :label-width="formLabelWidth">
          <el-select v-model="form.grant_type" placeholder="">
            <el-option label="------------------" value="" />
            <el-option label="client_credentials" value="client_credentials" />
          </el-select>
        </el-form-item>
        <el-form-item label="client id" :label-width="formLabelWidth"  v-if = "form.grant_type == 'client_credentials'">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="client secret" :label-width="formLabelWidth"  v-if = "form.grant_type == 'client_credentials'">
          <el-input v-model="form.secret" autocomplete="off" @keyup.enter="oauth" />
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
import { reactive, ref} from 'vue'
import { toggleDark } from '../composables';
import axios from 'axios';
import {access} from '../access';

const timeCount= ref(0);
const dialogFormVisible = ref(false);
const formLabelWidth = '100px';
const form = reactive({
  name: '',
  secret: '',
  grant_type: '',
});

function openAuth() {
  dialogFormVisible.value = true
}

function oauth() {  
  dialogFormVisible.value = false;
  if (form.grant_type == "client_credentials") {
    const option = {
      url: "/oauth2/token",
      method: "POST",
      params: {
        grant_type: "client_credentials"
      },
      headers: {
      // 'Access-Control-Allow-Credentials': true,
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'POST',
      // 'Access-Control-Allow-Headers': 'application/x-www-form-urlencoded',
      // 'Authorization': 'Bearer eyJraWQiOiI1NTE4YzBjNS01Yzk0LTQ2MzMtOTc1Zi1lYjE1NzAwNDI5YmYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJsYWJtYW40IiwiYXVkIjoibGFibWFuNCIsIm5iZiI6MTY2NzQ4NTI4MCwic2NvcGUiOlsibWVzc2FnZS5yZWFkIl0sImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCIsImV4cCI6MTY2NzQ4NTU4MCwiaWF0IjoxNjY3NDg1MjgwfQ.on4oTJSjfy91GDvNuJYywzHfYG7Hd9D_zlR-bAq46QYC_MUcMbireMbdmGSr63rN7a7Sto_eRIZIa3DhlEGyyJ7ZdkSN3dd1TLY_KpNLzfRbrxY0pV5_QXpbnOD1pHAPmCc5yNDfA3Fv6pteoMQ8qgd1c5eBGVmZKOSsXZnb2i-10cBM_KEeOWL1MudhjTRHluk9xrS9LAczPoG9UM5ZU2_Q9J3-Mx1RmSvybSQG6OP9VXuH4r6ecXITCYMeJryveVY5gpZvvnzbFkY5fKf4jVjvV_lay19net-UwBB7vOwxfo7fBs-GM2T-Oa3XwoQhSDxT-Blr88BViunKS9TW_g'
      },           
      auth : { 
          username : form.name , 
          password : form.secret 
      } ,
    }
    axios(option).then(function (response) {
      if(response.data.access_token != "") {
        access.update(response.data.access_token, response.data.expires_in);
        // toggleDark();
        countDown();
      }
    })     
  }    
}


function countDown() {
  timeCount.value = window.setInterval(() => {
    access.expires_in--;
    if(access.expires_in <= 0) {
      clearInterval(timeCount.value)
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