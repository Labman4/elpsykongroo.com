<template>
    <el-icon id="whiteMode" @click="visible.webauthnFormVisible = true" > <User /></el-icon>
    <el-dialog v-model="visible.webauthnFormVisible" width="65%">
      <el-form 
        v-loading="visible.loading"
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
          <el-button @click="visible.loading=false">cancel</el-button>
          <el-button @click="webauthnLogin()">login</el-button>
          <el-button type="primary" @click="webauthnRegister()" >
            register
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script lang="ts" setup >
import { User} from '@element-plus/icons-vue';
import { webauthnRegister, webauthnLogin } from '~/assets/ts/login';
import { access } from '~/assets/ts/access';
import { visible } from "~/assets/ts/visible";
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
</script>

<style scoped>
  #whiteMode {
    position:absolute;right: 20px; top:15px;
    color: #409EFF;
  }
</style>