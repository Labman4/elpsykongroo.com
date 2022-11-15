<template>
    <el-button id="darkMode" size=small @click="openAuth()" v-if = "access.expires_in == 0">
    </el-button>
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
import axios from 'axios';
import {access} from '../access';
import { ElButton, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElInput } from 'element-plus';
import { toggleDark } from '~/composables';

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
      baseURL: 'https://auth.elpsykongroo.com/',
      url: "/oauth2/token",
      method: "POST",
      params: {
        grant_type: "client_credentials"
      },
      headers: {
    
      },           
      auth : { 
          username : form.name , 
          password : form.secret 
      } ,
    }
    axios(option).then(function (response) {
      if(response.data.access_token != "") {
        access.update(response.data.access_token, response.data.expires_in);
        toggleDark();
        countDown();
      }
    })     
  }    
}

function countDown() {
  timeCount.value = window.setInterval(() => {
    access.expires_in--;
    if(access.expires_in == 0) {
      toggleDark();
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