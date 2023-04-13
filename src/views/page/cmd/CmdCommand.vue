<script lang="ts" setup>
const edge = require('electron-edge-js');
const path = require('path');

const cmd = edge.func({
  assemblyFile: path.resolve('resources/MechTE.dll'), //找到对应的dll文件
  typeName: 'MechTE.Cmd.TCmd', // C#中class (namespace MechTE.Cmd.类)
  methodName: 'VExe' // 导出dll的方法名  async Task<object> Exe2(dynamic name)
});
const input = ref('');
const _Cmd = (name: string) => {
  //taskmgr 传入的参数 如果没有参数设置 null
  cmd(name, function (err: any, result: any) {
    if (err) throw err;
    console.log(result);
  });
};
</script>
<template>
  <div class="cmd w-full bg-gray-100">
    <div class="w-140 m-2 flex">
      <el-input class="mr-2px" v-model="input" placeholder="cmd 指令" clearable />
      <el-button @click="_Cmd(input)">启动</el-button>

      <el-input class="mr-2px ml-8px" v-model="input" placeholder="搜索" clearable />
      <el-button @click="_Cmd(input)">搜索</el-button>
    </div>

    <div class="content">
      <div class="content-div" @click="_Cmd('notepad')">
        <div>记事本</div>
      </div>

      <div class="content-div" @click="_Cmd('calc')">
        <div>计算器</div>
      </div>
      <div class="content-div" @click="_Cmd('taskmgr')">
        <div>任务器</div>
      </div>
      <div class="content-div" @click="_Cmd('mstsc')">
        <div>远程桌面</div>
      </div>
      <div class="content-div" @click="_Cmd('regedit')">
        <div>注册表</div>
      </div>
      <div class="content-div" @click="_Cmd('control')">
        <div>控制面板</div>
      </div>
      <div class="content-div" @click="_Cmd('ncpa.cpl')">
        <div>网络</div>
      </div>
    </div>

    <el-divider />
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  .content-div {
    @apply w-22 h-15 m-2 flex;
    @apply rounded-lg shadow-sm cursor-pointer;
    @apply bg-white hover:bg-green-400 hover:text-red-600;
    div {
      @apply m-auto;
    }
  }
}
</style>
