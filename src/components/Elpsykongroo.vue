<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    :collapse="false">
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>Gateway
      </template>
      <el-menu-item-group>
        <el-menu-item index="1-1" @click="openIp()" >ip</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-2">
        <template #title><span>record</span></template>
        <el-menu-item index="1-2-1" @click="openRecordAsc()" >Asc</el-menu-item>
        <el-menu-item index="1-2-2" @click="openRecordDesc()" >Desc</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="1-3">
        <template #title><span>auth</span></template>
        <el-menu-item index="1-3-1" @click="openAuthClient()" >client</el-menu-item>
        <el-menu-item index="1-3-2" @click=""></el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item v-if="access.grant_type !='authorization_code'">
      <el-icon><setting /></el-icon>
      <template #title v-if="access.grant_type =='client_credentials'">{{access.expires_in}}s</template>
    </el-menu-item>
    <el-menu-item v-if="access.grant_type =='authorization_code'">
      <el-icon @click="logout()"><SwitchButton /></el-icon>
      <template #title >
        Logout
      </template>
    </el-menu-item>
  </el-menu>
  <IP ref="ip"></IP>
  <Record ref="record"></Record>
  <AuthClient ref="authClient"></AuthClient>
  </template>
  
<script lang="ts" setup>
import axios from 'axios';
import { access } from '~/access';
import { env } from '~/env';
import { ref } from 'vue'
import {
  Location,
  Setting,
  SwitchButton,
} from '@element-plus/icons-vue'
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
  access.expires_in = 5;
  const option = {
    baseURL: env.authUrl,
    url: "/logout",
    method: "POST",
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
  })
}

</script>
<style scoped>
/* .example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
} */
/* .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 200px;
} */
</style>
