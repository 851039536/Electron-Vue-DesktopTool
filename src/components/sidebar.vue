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
  switch (id) {
    case 1:
      await routers('/CmdCommand');
      break;
    case 2:
      await routers('/home');
      break;
    case 3:
      await routers('/Programs');
      break;
    case 4:
      await routers('/Desktop');
      break;
    default:
      break;
  }
}
onMounted(() => {});
</script>
<template>
  <div class="side">
    <div @click="onRouter(1)">控制台</div>
    <div @click="onRouter(2)">工具</div>
    <div @click="onRouter(3)">程序</div>
    <div @click="onRouter(4)">桌面</div>
    <div>调试工具</div>
  </div>
</template>

<style lang="scss" scoped>
.side {
  @apply h-741px w-200px;
  @apply shadow bg-white cursor-pointer;
  div {
    font-size: 17.5px;
    text-align: center;
    margin-top: 5px;
    padding: 4px;
    &:hover {
      border-radius: 0.25rem;
      color: #ffffff;
      --tw-bg-opacity: 1;
      background-color: rgba(96, 165, 250, var(--tw-bg-opacity));
    }
  }
}
</style>
