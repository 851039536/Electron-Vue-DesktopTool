process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron';
import { release } from 'os';
import { join } from 'path';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

const template = [
  {
    label: '此电脑',
    submenu: [
      {
        label: 'C盘',
        accelerator: 'CmdOrCtrl+C',
        click() {
          shell.openPath('C:\\');
        }
      },
      {
        label: 'D盘',
        accelerator: 'CmdOrCtrl+D',
        click() {
          shell.openPath('D:\\');
        }
      },
      {
        label: '退出',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: '配置',
    submenu: [
      {
        label: 'C盘',
        accelerator: 'CmdOrCtrl+C',
        click() {
          shell.openPath('C:\\');
        }
      }
    ]
  },
  {
    label: '控制台',
    submenu: [
      {
        label: 'C盘',
        accelerator: 'CmdOrCtrl+C',
        click() {
          shell.openPath('C:\\');
        }
      }
    ]
  },
  {
    label: '网站',
    submenu: [
      {
        label: 'C盘',
        accelerator: 'CmdOrCtrl+C',
        click() {
          shell.openPath('C:\\');
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function createWindow() {
  //创建窗口时配置
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    backgroundColor: '#00000000', // 当关闭开发者工具时, 会重新创建一个新的渲染视图, 所以会使用配置的背景颜色, 如果没配置会使用默认值白色
    webPreferences: {
      preload,
      nodeIntegration: true, //web开启主进程中集成node // 渲染层可以使用node
      contextIsolation: false
    },
    width: 1000,
    height: 800
  });

  // 窗口最小化触发
  win.on('minimize', () => {
    console.log('minimize');
  });
  win.on('focus', () => {
    console.log('focus');
  });
  // 窗口隐藏, 任务栏没有图标
  win.on('hide', () => {
    console.log('hide');
  });
  win.on('show', () => {
    console.log('show');
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.whenReady().then(createWindow);

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// 监听渲染进程信息
ipcMain.on('message', (event, arg) => {
  console.log('ping');
  event.sender.send('message-reply', 'pong'); // 回复子程序
  win.webContents.send('message-reply', 'pong');
});
// 主进程单独往渲染进程发信息

// New window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
