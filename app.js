const electron = require('electron');
const url = require('url');
const path = require('path');
const mainMenuTemplate = require('./mainMenuTemplate');

const { app, BrowserWindow, Menu } = electron

let mainWindow;

// Listen for the app to be ready
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        maxHeight: 600,
        minHeight: 400
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