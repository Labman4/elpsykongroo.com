<template>
    <el-tabs type="border-card">
      <el-tab-pane label="Home" name="Home">
        <Topblank/>
        <Home/>
      </el-tab-pane>
      <el-tab-pane label="Blog" name="Blog"></el-tab-pane>
      <el-tab-pane label="Daily" name="Daily">今日无事</el-tab-pane>
      <el-tab-pane label="Something" name="Something"></el-tab-pane>
    </el-tabs>
  </template>
  
<script lang="ts" setup>
import { TabsPanes } from 'element-plus';

</script>
<script lang="ts">
export default {
    data() {
      return {
        activeName: 'Home' //默认显示第一页
      };
    },
    methods: {
      handleClick(tab:TabsPanes, event:Event) {
        if (this.activeName == "elpsykongroo") {
          
        }
      },
      changeMode(name:String) {
      }
    }
  }
</script>
