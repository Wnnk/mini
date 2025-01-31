# electron-vite-vue

基本框架引用 electron-vite-vue

🥳 Really simple `Electron` + `Vue` + `Vite` boilerplate.

[![GitHub Build](https://github.com/electron-vite/electron-vite-vue/actions/workflows/build.yml/badge.svg)](https://github.com/electron-vite/electron-vite-vue/actions/workflows/build.yml)
[![GitHub Discord](https://img.shields.io/badge/chat-discord-blue?logo=discord)](https://discord.gg/sRqjYpEAUK)

## 运行 Setup

```sh
# clone the project
git clone https://github.com/Wnnk/mini.git

# enter the project directory
cd mini

# install dependency
npm install

# develop
npm run dev
```

## 功能 Fuctions

### 工具类

- 画笔工具
- 自由套索
- 套索区域填充
- 裁剪
- 选中
- 文字工具
- 插入图片

### 编辑类

- HEX 颜色选择器
- 画布缩放
- 层级管理

## Directory

```diff
+ ├─┬ electron
+ │ ├─┬ main
+ │ │ └── index.ts    entry of Electron-Main
+ │ └─┬ preload
+ │   └── index.ts    entry of Preload-Scripts
  ├─┬ src
  │ └── main.ts       entry of Electron-Renderer
  ├── index.html
  ├── package.json
  └── vite.config.ts
```

## 待完成

- 保存下载图片
- blur 优化
- 当前选择元素优化
