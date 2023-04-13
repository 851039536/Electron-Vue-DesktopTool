import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import './samples/node-api';
import 'normalize.css/normalize.css';
import 'uno.css';
import { createPinia } from 'pinia';
const pinia = createPinia();

import router from './router/index';

// use
createApp(App)
  .use(ElementPlus)
  .use(pinia)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
