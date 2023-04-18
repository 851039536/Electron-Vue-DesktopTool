<script lang="ts" setup>
import { cmdApi } from '@api/index';
const edge = require('electron-edge-js');
const path = require('path');

const cmd = edge.func({
  assemblyFile: path.resolve('resources/MechTE.dll'), //找到对应的dll文件
  typeName: 'MechTE.Cmd.TCmd', // C#中class (namespace MechTE.Cmd.类)
  methodName: 'VExe' // 导出dll的方法名  async Task<object> Exe2(dynamic name)
});
const input = ref('');
const QCmd = (name: string) => {
  //taskmgr 传入的参数 如果没有参数设置 null
  cmd(name, function (err: any, result: any) {
    if (err) throw err;
    console.log(result);
  });
};

const desktop = edge.func({
  assemblyFile: path.resolve('resources/MechTE.dll'),
  typeName: 'MechTE.Files.TFile',
  methodName: 'GetDesktop'
});

const rData = ref([] as any[]); //类型“never”上不存在属性“name”
const QDesktop = () => {
  desktop('C:\\Users\\CH190006\\Desktop', function (err: any, result: any) {
    if (err) throw err;
    rData.value = result;
    result.co;
  });
};
const OpenEXE = (pathName: string) => {
  QCmd('C:\\Users\\CH190006\\Desktop\\' + pathName);
};

const rData2 = ref([] as any[]);
onMounted(() => {
  QDesktop();

  cmdApi.GetPaging().then((res) => {
    console.log(res.data.data.items);
    rData2.value = res.data.data.items;
  });
});
</script>
<template>
  <div class="cmd">
    <!-- <div class="text-xl mx-2 my-1 text-gray-600">控制台</div> -->

    <div class="ml-2 my-3 text-gray-700">cmd窗口</div>
    <div class="w-80 m-2 flex">
      <el-input class="mr-2px" v-model="input" placeholder="CMD 控制台指令" clearable />
      <el-button @click="QCmd(input)">启动</el-button>
    </div>

    <div class="content">
      <div class="content-div" v-for="(item, index) in rData2" :key="index" @click="QCmd(item.keyValue)">
        <div>{{ item.name }}</div>
      </div>
    </div>

    <!-- //生成按键 -->
    <div class="content">
      <div class="content-div" @click="QCmd('shutdown -s -t 0')">
        <div>关机</div>
      </div>
      <div class="content-div" @click="QCmd('shutdown -r -t 0')">
        <div>重启</div>
      </div>
      <div class="content-div" @click="QCmd('shutdown -l -t 0')">
        <div>注销</div>
      </div>
      <div class="content-div" @click="QCmd('shutdown -a')">
        <div>取消</div>
      </div>
    </div>

    <!-- 生成页面导航 -->
    <div class="content">
      <div class="content-div" @click="QCmd('explorer')">
        <div>资源管理</div>
      </div>
      <div class="content-div" @click="QCmd('explorer C:\\')">
        <div>C盘</div>
      </div>
      <div class="content-div" @click="QCmd('explorer D:\\')">
        <div>D盘</div>
      </div>
      <div class="content-div" @click="QCmd('explorer shell:desktop')">
        <div>桌面</div>
      </div>
      <div class="content-div" @click="QCmd('explorer shell:mydocuments')">
        <div>我的文档</div>
      </div>
      <div class="content-div" @click="QCmd('explorer shell:downloads')">
        <div>下载</div>
      </div>
    </div>
    <el-divider />
    <div class="ml-2 my-3 text-gray-700">桌面应用</div>
    <div class="list">
      <template v-for="(item, index) in rData" :key="index">
        <div class="list-im" v-if="item">
          <div @click="OpenEXE(item)">{{ item.split('.')[0] }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cmd {
  @apply w-full bg-gray-100;
  .content {
    @apply flex;
    .content-div {
      @apply w-22 h-14 m-2 flex;
      @apply rounded-lg shadow cursor-pointer;
      @apply bg-white hover:bg-green-400 hover:text-red-600;
      div {
        @apply m-auto text-sm text-blue-gray-600;
      }
    }
  }
  .list {
    @apply flex flex-wrap m-2 bg-white rounded;
    // @apply bg-white;
    .list-im {
      @apply w-[32%] h-7 mx-3px my-1px flex items-center;
      @apply cursor-pointer  rounded;

      div {
        @apply p-3px text-sm text-blue-gray-600 rounded-lg;
        @apply hover:text-red-600;
      }
    }
  }
}
</style>
