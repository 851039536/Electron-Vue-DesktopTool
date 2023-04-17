<script lang="ts" setup>
import { routers } from '@/router/routers';

const edge = require('electron-edge-js');
const path = require('path');

const cmd = edge.func({
  assemblyFile: path.resolve('resources/MechTE.dll'), //找到对应的dll文件
  typeName: 'MechTE.Files.TFile', // C#中class (namespace MechTE.Cmd.类)
  methodName: 'VOpenFile' // 导出dll的方法名  async Task<object> Exe2(dynamic name)
});

const _Cmd = () => {
  //taskmgr 传入的参数 如果没有参数设置 null
  cmd('D:\\software\\MES Client\\Sajet MES.exe', function (err: any, result: any) {
    if (err) throw err;
    console.log(result);
  });
};

async function onRouter(id: number) {
  const router = ['/CmdCommand', '/home', '/Programs'];
  // This function is used to store the router
  const selectedRouter = router[id - 1];
  if (selectedRouter) {
    // This function is used to select the router
    await routers(selectedRouter);
  }
}
onMounted(() => {});
</script>
<template>
  <div class="side">
    <div @click="onRouter(1)">控制台</div>
    <div @click="onRouter(2)">工具</div>
    <div @click="onRouter(3)">程序</div>
    <div>调试工具</div>
  </div>
</template>

<style lang="scss" scoped>
.side {
  @apply h-733px w-200px pt-2;
  @apply shadow bg-white cursor-pointer;
  div {
    @apply text-lg text-center py-3px text-gray-700;
    &:hover {
      border-radius: 0.25rem;
      color: #ffffff;
      --tw-bg-opacity: 1;
      background-color: rgba(96, 165, 250, var(--tw-bg-opacity));
    }
  }
}
</style>
