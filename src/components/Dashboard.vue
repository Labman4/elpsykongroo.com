<template>
    <el-container class="layout-container-demo" style="height: 100%">
      <el-scrollbar>
        <el-menu    
          class="el-menu-vertical-demo"
          :collapse="isCollapse" 
          :router="true">
          <el-menu-item route="expand">
            <el-icon @click="expand()"  v-if="isCollapse"><Expand /></el-icon>
            <el-icon @click="collapse()" v-if="!isCollapse"><Fold /></el-icon>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Menu/></el-icon>
              <span>Dashboard</span>
            </template>
            <el-menu-item-group>
              <el-menu-item route="kubernetes">dashboard</el-menu-item>
              <el-menu-item route="linkerd">Linkerd</el-menu-item>
              <el-menu-item route="kibana">Kibana</el-menu-item>
              <el-menu-item route="harbor">Harbor</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Operation /></el-icon>
              <span>Gateway</span>
            </template>
            <el-menu-item-group>
              <el-menu-item @click="openIp()" route="ip">ip</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-1">
              <template #title><span>record</span></template>
              <el-menu-item @click="openRecordAsc()"  route="record/asc" >Asc</el-menu-item>
              <el-menu-item @click="openRecordDesc()" route="record/desc" >Desc</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2-2">
              <template #title><span>auth</span></template>
              <el-menu-item @click="openAuthClient()" route="record/desc" >client</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item v-if="access.grant_type !='authorization_code'" route="timer">
            <el-icon><Timer /></el-icon>
            <template #title v-if="access.grant_type =='client_credentials'">{{access.expires_in}}s</template>
          </el-menu-item>
          <el-menu-item v-if="access.grant_type =='authorization_code'" route="logout">
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
      <el-container>
        <!-- <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px"
                ><setting
              /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View</el-dropdown-item>
                  <el-dropdown-item>Add</el-dropdown-item>
                  <el-dropdown-item>Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>Tom</span>
          </div>
        </el-header> --> 
        <el-main>
          <router-view ref="iframeView"/>
        </el-main>
      </el-container>
    </el-container>
  </template>
  
<script lang="ts" setup>
import { axios } from '~/assets/js/axio';
import { access } from '~/assets/js/access';
import { env } from '~/assets/js/env';
import { ref } from 'vue';
import { Timer, Operation, SwitchButton, Expand, Fold, Menu } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import IP from '~/components/api/IP.vue';
import Record from '~/components/api/Record.vue';
import AuthClient from '~/components/api/AuthClient.vue';

const ip = ref<InstanceType<typeof IP> | null>(null)
const record = ref<InstanceType<typeof Record> | null>(null)
const authClient = ref<InstanceType<typeof AuthClient> | null>(null)

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

const expand = () => {
  isCollapse.value = false;
}

const collapse = () => {
  isCollapse.value = true;
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
    width: 200px;
    min-height: 400px;
  }
  </style>
  