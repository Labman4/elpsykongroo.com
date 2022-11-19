<template>
    <el-container class="layout-container-demo " style="height: 100%">
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu :default-openeds="['1']"     
          :collapse="false" :router="true">
            <el-sub-menu index="1" route="dashboard">
              <template #title>
                <el-icon><message /></el-icon>Dashboard
              </template>
              <el-menu-item-group>
                <!-- <template #title>Kubernetes</template> -->
                <el-menu-item route="kubernetes">kubernetes</el-menu-item>
                <el-menu-item route="linkerd">Linkerd</el-menu-item>
                <el-menu-item route="kibana">Kibana</el-menu-item>
                <el-menu-item route="harbor">Harbor</el-menu-item>
                <el-menu-item route="argocd">Argocd</el-menu-item>

              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
          <Elpsykongroo/>
        </el-scrollbar>
      </el-aside>
  
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
import { access } from '../access';
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
  </style>
  