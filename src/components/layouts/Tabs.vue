<template>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="Home" name="Home">
          <Home/>
      </el-tab-pane>
      <el-tab-pane label="Blog" name="Blog"></el-tab-pane>
      <el-tab-pane label="Daily" name="Daily"></el-tab-pane>
      <el-tab-pane label="Else" name="Else"></el-tab-pane>
      <el-tab-pane label="Dashboard" name="Dashboard" v-if="visible.width > 768">
        <Dashboard class="hidden-sm-and-down" v-if = "access.permission != undefined && access.permission.includes('admin')" />
        <span class="hidden-md-and-up">not support</span>
      </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { access } from '~/assets/ts/access';
import '~/assets/ts/live2d.js';
import { visible } from '~/assets/ts/visible';

const activeName = ref('Home')
</script>