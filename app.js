const electron = require('electron');
const url = require('url');
const path = require('path');
const mainMenuTemplate = require('./mainMenuTemplate');

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow;
let addWindow; // used in views/scripts/depositTab.js
let fineWindow; // used in views/scripts/depositTab.js

// Listen for the app to be ready
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        maxHeight: 600,
        minHeight: 400,
        maxWidth: 800,
        minWidth: 400
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

ipcMain.on('deposit:add', (event, studentName, depositAmount) => {
    mainWindow.webContents.send('deposit:add', studentName, depositAmount);
});