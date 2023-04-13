import { defineStore } from 'pinia';

export const useAppStore = defineStore({
  //  id: 必须的，在所有 Store 中唯一
  id: 'app',
  // state: 返回对象的函数
  state: () => {
    return {
      // 角色
      role: 'role',
      count: 0
    };
  }
});
