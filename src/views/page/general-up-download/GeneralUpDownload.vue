<script lang="ts" setup>
import { UpDownApi } from '@/api';
import { ElMessage } from 'element-plus';

const centerDialogVisible = ref(false);
const dialogTitle = ref('');

const edge = require('electron-edge-js');
const path = require('path');

const ElDownloadZip = edge.func({
  assemblyFile: path.resolve('resources/GeneralUpDownload_FrameworkV452.dll'),
  typeName: 'GeneralUpDownload_FrameworkV452.ZipFiles', // C#中class (namespace.class)
  methodName: 'ElDownloadZip' // 导出dll的方法名
});

const ElUploadZip = edge.func({
  assemblyFile: path.resolve('resources/GeneralUpDownload_FrameworkV452.dll'),
  typeName: 'GeneralUpDownload_FrameworkV452.ZipFiles', // C#中class (namespace.class)
  methodName: 'ElUploadZip' // 导出dll的方法名
});

//下载到指定路径
const zipDownload = ref('');
//解压到指定路径
const uNzip = ref('');
//解压后的文件夹名称(跟上传路名称径一致)
const zipName = ref('');
//上传接口
const DownloadHttp = ref('http://10.55.2.25:20005/api/PostDownloadZIP');

const DownloadZip = () => {
  //验证.value是否为空
  if (zipDownload.value === '' || uNzip.value === '' || zipName.value === '') {
    ElMessage({
      message: '下载路径不能为空',
      type: 'error'
    });
    return;
  }
  const input = [DownloadHttp.value, zipDownload.value, uNzip.value, zipName.value];
  ElDownloadZip(input, function (err: any, result: any) {
    console.log(err);
    console.log(result.Result);
    if (result.Result === 'true') {
      ElMessage({
        message: '文件下载完成',
        type: 'success'
      });
      return;
    }
    ElMessage({
      message: '文件下载失败',
      type: 'error'
    });
  });
};

//上传路径
const zipUpPath = ref('');
//上传接口
const uploadHttp = ref('http://10.55.2.25:20005/api/PostUploadloadFileTestItem');

const UploadZip = () => {
  //验证input.value是否为空
  if (zipUpPath.value === '') {
    ElMessage({
      message: '程序路径不能为空',
      type: 'error'
    });
    return;
  }
  //验证input.value路径是否是zip文件  以.zip结尾
  if (!zipUpPath.value.endsWith('.zip')) {
    ElMessage({
      message: '程序路径不是zip文件',
      type: 'error'
    });
    return;
  }

  const path = [uploadHttp.value, zipUpPath.value];

  ElUploadZip(path, function (err: any, result: any) {
    if (result) {
      ElMessage({
        message: 'zip文件上传成功',
        type: 'success'
      });
      return;
    }
    ElMessage({
      message: 'zip文件上传失败',
      type: 'error'
    });
    console.log(err);
  });
};

const UpDownTest = () => {
  //上传路径
  zipUpPath.value = 'C:\\Users\\ch190006\\Desktop\\Test\\test1\\test2.zip';
  uploadHttp.value = 'http://10.55.2.25:20005/api/PostUploadloadFileTestItem';
  //下载路径
  zipDownload.value = 'C:\\Users\\ch190006\\Desktop\\Test';
  uNzip.value = 'C:\\Users\\ch190006\\Desktop\\Test';
  zipName.value = 'test2';
};
const GetBid = async (id: number) => {
  const ret = await UpDownApi.GetById(id);
  const data = ret.data.data;
  zipDownload.value = data.downZipPath;
  uNzip.value = data.unZipPath;
  zipName.value = data.zipName;
  zipUpPath.value = data.upZipPath;
};

const ClosePath = () => {
  //上传路径
  zipUpPath.value = '';
  //下载路径
  zipDownload.value = '';
  uNzip.value = '';
  zipName.value = '';
};
const Del = () => {
  //接收返回值
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      });
    });
};

const rDate = ref([] as any);

onMounted(async () => {
  const ret = await UpDownApi.GetPaging(1, 20);
  rDate.value = ret.data.data.items;
});
</script>
<template>
  <div class="w-full bg-gray-100">
    <div class="w-200 m-2 flex">
      <el-input class="mr-2px" v-model="zipUpPath" placeholder="需要上传zip文件的路径" clearable />
      <el-button @click="UploadZip()">上传</el-button>
      <el-button @click="UpDownTest()">测试上传下载</el-button>
      <el-button @click="ClosePath()">清空</el-button>
    </div>
    <div class="w-200 m-2 flex">
      <el-input class="mr-2px" v-model="zipDownload" placeholder="下载到指定路径" clearable />
      <el-input class="mr-2px" v-model="uNzip" placeholder="解压到指定路径" clearable />
      <el-input class="mr-2px w20px" v-model="zipName" placeholder="zip名称" clearable />
      <el-button @click="DownloadZip()">下载</el-button>
    </div>

    <div class="flex">
      <div class="bg-gray-200 h-[90%] w-300px m-2 py-1">
        <div class="bg-white m-1 p-1 cursor-pointer hover:bg-green-400" v-for="(item, index) in rDate" :key="index">
          <div @click="GetBid(item.id)">{{ item.zipName }}</div>
        </div>
      </div>
      <div class="bg-gray-200 h-[90%] m-2 py-1">
        <div class="m-1 px-1">
          <el-button @click="(centerDialogVisible = true), ClosePath(), (dialogTitle = '新增')">新增</el-button>
        </div>
        <div class="m-1 px-1">
          <el-button @click="(centerDialogVisible = true), (dialogTitle = '更新')">编辑</el-button>
        </div>
        <div class="m-1 px-1"><el-button @click="Del()">删除</el-button></div>
        <div class="m-1 px-1"><el-button>教程</el-button></div>
      </div>

      <div class="bg-gray-200 h-[90%] w-200px m-2 py-1">
        <div>编辑</div>
        <div>编辑</div>
        <div>编辑</div>
      </div>
    </div>

    <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="50%" center>
      <el-input class="my-1" v-model="zipName" placeholder="zip名称" clearable>
        <template #prepend>zip名称</template>
      </el-input>
      <el-input class="my-1" v-model="zipUpPath" placeholder="需要上传zip文件的路径" clearable>
        <template #prepend>需要上传zip文件的路径</template>
      </el-input>
      <el-input class="my-1" v-model="zipDownload" placeholder="解压到指定路径" clearable>
        <template #prepend>解压到指定路径</template>
      </el-input>
      <el-input class="my-1" v-model="uNzip" placeholder="下载到指定路径" clearable>
        <template #prepend>下载到指定路径</template>
      </el-input>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">退出</el-button>
          <el-button type="primary" @click="centerDialogVisible = false"> 提交 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
