import { app, Menu, dialog, ipcMain, ipcRenderer } from "electron";
import fs from "fs";
import path from "path";
import { createWindow, win } from "./index";

export const template = [
  /* 一级菜单 */
  {
    label: "文件",
    submenu: [
      {
        label: "新建文件",
        accelerator: "ctrl+n",
        click: () => {
          createWindow();
        },
      },
      {
        label: "打开json文件",
        accelerator: "ctrl+o",
        click: () => {
          openFile();
        },
      },
    ],
  },
  {
    label: "视图",
    submenu: [
      {
        label: "清空画布",
        click: () => {
          win.webContents.send("clear-canvas");
        },
      },
    ],
  },
  {
    label: "帮助",
    submenu: [
      {
        label: "开发者工具",
        accelerator: "F12",
        click: () => {
          win.webContents.openDevTools();
        },
      },
    ],
  },
];

const openFile = () => {
  dialog
    .showOpenDialog({
      title: "打开文件",
      properties: ["openFile"],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const fileContent = fs.readFileSync(filePath, "utf-8");
        try {
          win.webContents.send("open-json", fileContent);
        } catch (error) {
          console.error(error);
        }
      }
    });
};
