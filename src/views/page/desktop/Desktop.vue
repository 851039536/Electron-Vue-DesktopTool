<script lang="ts" setup>
const edge = require('electron-edge-js');
const path = require('path');

const cmd = edge.func({
  assemblyFile: path.resolve('resources/MechTE.dll'), //找到对应的dll文件
  typeName: 'MechTE.Files.TFile', // C#中class (namespace MechTE.Cmd.类)
  methodName: 'GetDesktop' // 导出dll的方法名  async Task<object> Exe2(dynamic name)
});

const rEex = ref([]);
const _exe = () => {
  //taskmgr 传入的参数 如果没有参数设置 null
  cmd('C:\\Users\\CH190006\\Desktop', function (err: any, result: any) {
    if (err) throw err;
    rEex.value = result;
    result.co;
  });
};
//使用watchEffect创建一个响应式的副作用函数;
watchEffect((onInvalidate) => {
  // 创建定时器，每三秒执行一次_exe函数
  const timerId = setInterval(() => {
    //定时查询桌面
    _exe();
  }, 3000);
  // 在响应式的副作用函数中使用onInvalidate函数监听组件被销毁的时机
  onInvalidate(() => {
    // 组件被销毁时清除定时器
    clearInterval(timerId);
  });
});
onMounted(() => {
  _exe();
});
</script>
<template>
  <div class="desktop">
    <div class="w-70 m-2 flex">
      <el-input class="mr-2px" placeholder="程序路径" clearable />
      <el-button @click="_exe()">启动</el-button>
    </div>

    <el-divider />
    程序
    <div class="list">
      <template v-for="(item, index) in rEex" :key="index">
        <div
          class="w-32 h-20 bg-white mx-2 mb-2 rounded shadow-sm flex cursor-pointer hover:bg-gray-100 hover:text-red-600"
          v-if="/.lnk/.test(item) || /.exe/.test(item)"
        >
          <div class="m-auto items-center px-2">{{ item.split('.')[0] }}</div>
        </div>
      </template>
    </div>

    <el-divider />
    zip
    <div class="list">
      <template v-for="(item, index) in rEex" :key="index">
        <div
          class="w-32 h-20 bg-white mx-2 mb-2 rounded shadow-sm flex cursor-pointer hover:bg-gray-100 hover:text-red-600"
          v-if="/.zip/.test(item)"
        >
          <div class="m-auto items-center px-2">{{ item }}</div>
        </div>
      </template>
    </div>
    <el-divider />
    zip
    <div class="list">
      <template v-for="(item, index) in rEex" :key="index">
        <div
          class="w-32 h-20 bg-white mx-2 mb-2 rounded shadow-sm flex cursor-pointer hover:bg-gray-100 hover:text-red-600"
          v-if="/.md/.test(item)"
        >
          <div class="m-auto items-center px-2">{{ item }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.desktop {
  width: 100%;
  --tw-bg-opacity: 1;
  background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  .list {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
</style>
