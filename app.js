const electron = require('electron');
const url = require('url');
const path = require('path');
const mainMenuTemplate = require('./mainMenuTemplate');

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow;
let addWindow; // used in views/scripts/depositTab.js
let fineWindow; // used in views/scripts/depositTab.js
let editDepositWindow; // used in views/scripts/depositTab.js
let payWindow; // used in views/scripts/debtTab.js

// Listen for the app to be ready
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 500,
        maxHeight: 722,
        minHeight: 470,
        maxWidth: 800,
        minWidth: 600
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/mainWindow.html'),
        protocol: 'file'
    }));

    mainWindow.on('closed', () => {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('data:update', (event, windowId) => {
    mainWindow.webContents.send('data:update', windowId);
});

// These variables are to be send to secondary window once it is loaded.
let studentName;
let depositAmount;

ipcMain.on('deposit:edit', (event, name, deposit) => {
    studentName = name;
    depositAmount = deposit;
});

ipcMain.on('editDepositWindow-ready', (event) => {
    BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('deposit:edit', studentName, depositAmount);
    });
});

ipcMain.on('deposit:fine', (event, name) => {
    studentName = name;
});

ipcMain.on('fineWindow-ready', (event) => {
    BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('deposit:fine', studentName);
    });
});

ipcMain.on('debt:pay', (event, name) => {
    studentName = name;
});

ipcMain.on('payWindow-ready', (event) => {
    BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('debt:pay', studentName);
    });
});