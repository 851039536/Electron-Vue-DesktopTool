<script lang="ts" setup>
const edge = require('electron-edge-js');
const path = require('path');

const cmd = edge.func({
  assemblyFile: path.resolve('resources/MechTE.dll'), //找到对应的dll文件
  typeName: 'MechTE.Files.TFile', // C#中class (namespace MechTE.Cmd.类)
  methodName: 'VOpenFile' // 导出dll的方法名  async Task<object> Exe2(dynamic name)
});

const _Cmd = (path: string) => {
  //taskmgr 传入的参数 如果没有参数设置 null
  cmd(path, function (err: any, result: any) {
    if (err) throw err;
    console.log(result);
  });
};
const input = ref('');
</script>
<template>
  <div class="w-full bg-gray-100">
    <div class="w-100 m-2 flex">
      <el-input class="mr-2px" v-model="input" placeholder="程序路径" clearable />
      <el-button @click="_Cmd('')">启动</el-button>
      <el-button @click="_Cmd('')">新增</el-button>
      <el-button @click="_Cmd('')">新增</el-button>
    </div>

    <div class="flex">
      <div class="w-30 h-15 bg-white m-2 rounded shadow-sm flex cursor-pointer hover:bg-gray-100 hover:text-red-600">
        <div class="m-auto items-center" @click="_Cmd('D:\\software\\MES Client\\Sajet MES.exe')">Sajet MES</div>
      </div>

      <div class="w-30 h-15 bg-white m-2 rounded shadow-sm flex cursor-pointer hover:bg-gray-100 hover:text-red-600">
        <div class="m-auto items-center" @click="_Cmd('')">本地</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
