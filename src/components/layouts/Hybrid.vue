<template>
    <el-row :gutter="10">
      <el-col :span="24"> 
        <Tabs/> 
      </el-col>
      <el-col :span="1">
        <Elpsykongroo/>
      </el-col>
    </el-row>
    <el-row :gutter="10">
    
      <el-col :span="8">
      </el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
      </el-col>
      <el-col :span="16"><div class="grid-content ep-bg-purple" /></el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
    </el-row>
  </template>
  
  <style>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  </style>
 
<!-- <script lang="ts" setup>
import "../../assets/live2d/js/live2d.js"
import "../../assets/live2d/js/message.js"

  // loadlive2d("live2d", "../..assets/live2d/model/leimu/leimu.model.json");
  var message_Path = '../assets/live2d/'
  var home_Path = 'https://Labman4.github.io/'
</script> -->