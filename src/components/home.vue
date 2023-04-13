<script setup lang="ts"></script>

<template>
  <div class="w-full flex bg-gray-100">
    <div class="w-40 h-30 bg-white m-2 rounded shadow-sm">
      <div class="bg-green-300 w-10 m-auto text-center">测试</div>
    </div>
    <el-row class="mb-4">
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-container {
  @apply bg-red-500;
}
</style>
