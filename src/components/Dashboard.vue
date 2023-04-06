<template>
    <el-container class="layout-container-demo" style="height: 100%">
      <el-scrollbar>
        <el-menu    
          class="el-menu-vertical-demo"
          :collapse="isCollapse" 
          :router="false">
          <el-menu-item index="0">
            <el-icon  @click="expand()"  v-if="isCollapse"><Expand /></el-icon>
            <el-icon  @click="collapse()" v-if="!isCollapse"><Fold /></el-icon>
          </el-menu-item>
        </el-menu>
        <el-menu    
          class="el-menu-vertical-demo"
          :collapse="isCollapse" 
          :router="true">
          <el-sub-menu index="1" class="hidden-md-and-down">
            <template #title>
              <el-icon><Menu/></el-icon>
              <span>Dashboard</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" route="kubernetes">dashboard</el-menu-item>
              <el-menu-item index="1-2" route="linkerd">Linkerd</el-menu-item>
              <el-menu-item index="1-3" route="kibana">Kibana</el-menu-item>
              <el-menu-item index="1-4" route="harbor">Harbor</el-menu-item>
              <el-menu-item index="1-5" route="minio">Minio</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
        <el-menu    
          class="el-menu-vertical-demo"
          :collapse="isCollapse">
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Operation /></el-icon>
              <span>Gateway</span> 
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1"  @click="openIp()">ip</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-2">
              <template #title><span>record</span></template>
              <el-menu-item index="2-2-1" @click="openRecordAsc()" >Asc</el-menu-item>
              <el-menu-item index="2-2-2" @click="openRecordDesc()" >Desc</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2-3" >
              <template #title><span>auth</span></template>
              <el-menu-item index="2-3-1" @click="openAuthClient()" >client</el-menu-item>
              <el-menu-item index="2-3-2" @click="openAuthClientRegister()" >register</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2-4" >
              <template #title><span>permissions</span></template>
              <el-menu-item index="2-4-1" @click="openUser()">user</el-menu-item>
              <el-menu-item index="2-4-2" @click="openGroup()">group</el-menu-item>
              <el-menu-item index="2-4-3" @click="openAuthority()">authority</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3" >
            <el-icon @click="upload()"><UploadFilled /></el-icon>
            <template #title >
              storage
            </template>
          </el-menu-item>
          <el-menu-item index="4" v-if="access.grant_type !='authorization_code'">
            <el-icon><Timer /></el-icon>
            <template #title v-if="access.grant_type =='client_credentials'">{{access.expires_in}}s</template>
          </el-menu-item>
          <el-menu-item index="4-1" v-if="access.grant_type =='authorization_code'" >
            <el-icon @click="logout()"><SwitchButton /></el-icon>
            <template #title >
              Logout
            </template>
          </el-menu-item>
        
        </el-menu>
      </el-scrollbar>
      <IP ref="ip"></IP>
      <Record ref="record"></Record>
      <AuthClient ref="authClient"></AuthClient>
      <User ref="user"></User>
      <Group ref="group"></Group>
      <Authority ref="authority"></Authority>
      <el-container>
        <el-main>
          <router-view ref="iframeView"/>
        </el-main>
      </el-container>
    </el-container>

    <!-- <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="3"
    :on-exceed="handleExceed"
  >
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500KB.
      </div>
    </template>
  </el-upload> -->
  </template>
  
<script lang="ts" setup>

import { axios } from '~/assets/ts/axio';
import { access } from '~/assets/ts/access';
import { env } from '~/assets/ts/env';
import { ref } from 'vue';
import { Timer, Operation, SwitchButton, Expand, Fold, Menu, UploadFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import IP from '~/components/api/IP.vue';
import Record from '~/components/api/Record.vue';
import AuthClient from '~/components/api/AuthClient.vue';
import User from '~/components/api/User.vue';
import Group from '~/components/api/Group.vue';
import Authority from '~/components/api/Authority.vue';

const ip = ref<InstanceType<typeof IP> | null>(null)
const record = ref<InstanceType<typeof Record> | null>(null)
const authClient = ref<InstanceType<typeof AuthClient> | null>(null)
const user = ref<InstanceType<typeof User> | null>(null)
const group = ref<InstanceType<typeof Group> | null>(null)
const authority = ref<InstanceType<typeof Authority> | null>(null)

const openIp = () => {
  ip.value?.ipList();
}

const openRecordAsc = () => {
  record.value?.recordList("1");
}

const openRecordDesc = () => {
  record.value?.recordList("0");
}

const openAuthClient = () => {
  authClient.value?.authClientList();
}

const openAuthClientRegister = () => {
  authClient.value?.authClientRegisterList();
}

const openUser = () => {
  user.value?.userList();
}

const openGroup = () => {
  group.value?.groupList();
}

const openAuthority = () => {
  authority.value?.authorityList();
}


const logout = () => {
  ElMessage('you will logout in 3s');
  if(access.grant_type == 'authorization_code') {
    const option = {
      baseURL: env.authUrl,
      url: "/logout",
      method: "POST",
      headers: {
        'Authorization': 'Bearer '+ access.access_token
      },
    }
    axios(option).then(function (response) {
      access.grant_type = "";
      access.expires_in = 5;
      access.access_token = "";
      access.refresh_token = "";
    })
  }
}

let isCollapse = ref(true)

const upload = () => {


}
const expand = () => {
  isCollapse.value = false;
}

const collapse = () => {
  isCollapse.value = true;
}

const handleOpen = (key: string, keyPath: string[]) => {

}
const handleClose = (key: string, keyPath: string[]) => {
  
}
// let iframeView = ref<any>(null);
  // onMounted(() => {
  //   window.addEventListener("message", (event) => {
  //     if (event.origin !== 'https://dashboard.elpsykongroo.com') return
 
  //   });
  // })
</script>
  
<style scoped>
  .layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
  .layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
  }
  .layout-container-demo .el-menu {
    border-right: none;
  }
  .layout-container-demo .el-main {
    padding: 0;
  }
  .layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: auto;
    min-height: auto;
  }
  </style>
  