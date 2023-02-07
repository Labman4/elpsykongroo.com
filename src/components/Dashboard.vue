<template>
    <el-container class="layout-container-demo " style="height: 100%">
        <el-scrollbar>
          <el-menu :default-openeds="['1']"   
          class="el-menu-vertical-demo"
          :collapse="isCollapse" :router="true">
            <el-menu-item index="0">
              <el-icon @click="expand()" v-if="isCollapse"><Expand /></el-icon>
              <el-icon @click="collapse()" v-if="!isCollapse"><Fold /></el-icon>
            </el-menu-item>
            <el-sub-menu index="1" route="dashboard">
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
            <Elpsykongroo/>
          </el-menu>
        </el-scrollbar>
  
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
import { Expand, Fold, Menu } from '@element-plus/icons-vue';

let isCollapse = ref(true)

const expand = () => {
  isCollapse.value = false;
}

const collapse = () => {
  isCollapse.value = true;
}
// import { ref, onMounted} from 'vue'

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
  