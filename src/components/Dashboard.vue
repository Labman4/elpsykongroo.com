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
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Menu/></el-icon>
              <span>Dashboard</span>
            </template>
            <el-sub-menu index="1-1">
              <template #title><span>inside</span></template>
                <el-menu-item index="1-1-1" route="kubernetes">Dash</el-menu-item>
                <el-menu-item index="1-1-2" route="harbor">Harbor</el-menu-item>            
                <el-menu-item index="1-1-3" route="kafka">Kafka</el-menu-item>
                <el-menu-item index="1-1-4" route="kibana">Kibana</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="1-2">
              <template #title><span>outside</span></template>
              <el-menu-item index="1-2-1" @click="href('linkerd')">Linkerd</el-menu-item>
              <el-menu-item index="1-2-2" @click="href('minio')">Minio</el-menu-item>
              <el-menu-item index="1-2-3" @click="href('argocd')">Argocd</el-menu-item>
              <el-menu-item index="1-2-4" @click="href('vault')">Vault</el-menu-item>
            </el-sub-menu>
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
              <template #title><span>oauth2</span></template>
              <el-menu-item index="2-3-1" @click="openAuthClient()" >client</el-menu-item>
              <el-menu-item index="2-3-2" @click="openAuthClientRegister()" >register</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2-4" >
              <template #title><span>permission</span></template>
              <el-menu-item index="2-4-1" @click="openUser()">user</el-menu-item>
              <el-menu-item index="2-4-2" @click="openGroup()">group</el-menu-item>
              <el-menu-item index="2-4-3" @click="openAuthority()">authority</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3" >
            <el-icon @click="openStorage()"><UploadFilled /></el-icon>
            <template #title >
              storage
            </template>
          </el-menu-item>
          <el-menu-item index="4" v-if="access.expires_in > 0">
            <el-icon><Timer /></el-icon>
            <template #title>{{access.expires_in}}s</template>
          </el-menu-item>
          <el-menu-item index="4-1">
            <el-icon @click="logout()"><SwitchButton /></el-icon>
          </el-menu-item>
        
        </el-menu>
      </el-scrollbar>
      <IP ref="ip"></IP>
      <Record ref="record"></Record>
      <AuthClient ref="authClient"></AuthClient>
      <User ref="user"></User>
      <Group ref="group"></Group>
      <Authority ref="authority"></Authority>
      <Storage ref="storage"></Storage>
      <el-container>
        <el-main>
          <router-view ref="iframeView"/>
        </el-main>
      </el-container>
    </el-container>
  </template>
  
<script lang="ts" setup>

import { access } from '~/assets/ts/access';
import { ref } from 'vue';
import { Timer, Operation, SwitchButton, Expand, Fold, Menu, UploadFilled } from '@element-plus/icons-vue';
import IP from '~/components/api/IP.vue';
import Record from '~/components/api/Record.vue';
import AuthClient from '~/components/api/AuthClient.vue';
import User from '~/components/api/User.vue';
import Group from '~/components/api/Group.vue';
import Authority from '~/components/api/Authority.vue';
import Storage from '~/components/api/Storage.vue';
import { logout } from '~/assets/ts/login';

const storage = ref<InstanceType<typeof Storage> | null>(null)
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

let isCollapse = ref(true)

const openStorage = () => {
  storage.value?.listObject();
}
const expand = () => {
  isCollapse.value = false;
}

const collapse = () => {
  isCollapse.value = true;
}

const href = (dash: string) => {
  window.open("https://" + dash + ".elpsykongroo.com")
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
  