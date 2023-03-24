<template>
    <el-icon id="whiteMode" @click="webauthnFormVisible = true" > <User /></el-icon>
    <el-dialog v-model="webauthnFormVisible" width="65%">
      <el-form 
        label-position="left"
        label-width="auto" 
        :fit-input-width=true	>
        <el-form-item label="name" label-width="auto">
          <el-input v-model="access.username" @keyup.enter="webauthnLogin" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="webauthnLogin()">login</el-button>
          <el-button type="primary" @click="webauthnRegister()" >
            register
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script lang="ts" setup >
import { webauthnRegister, webauthnLogin } from "~/assets/ts/webauthn";
import { access } from '~/assets/ts/access';
import { User} from '@element-plus/icons-vue';

const webauthnFormVisible = ref(false);

function openAuth() {
  webauthnFormVisible.value = true
}
</script>

<style scoped>
  #whiteMode {
    position:absolute;right: 20px; top:15px;
    color: #409EFF;
  }
</style>