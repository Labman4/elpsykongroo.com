<template>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="Home" name="Home">
          <Home/>
      </el-tab-pane>
      <el-tab-pane label="Blog" name="Blog"></el-tab-pane>
      <el-tab-pane label="Daily" name="Daily"></el-tab-pane>
      <el-tab-pane label="Something" name="Something"></el-tab-pane>
      <el-tab-pane label="Dashboard" name="Dashboard" v-if = "access.expires_in > 0" >
        <Dashboard class="hidden-sm-and-down"/>
        <span class="hidden-md-and-up">not support</span>
      </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { access } from '~/assets/js/access';
import '~/assets/js/live2d';

const activeName = ref('Home')
</script>