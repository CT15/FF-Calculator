const electron = require('electron');
const { ipcRenderer } = electron;
const remote = electron.remote;
const { BrowserWindow, dialog, app } = remote;
const url = require('url');
const path = require('path');
const DataSource = require('nedb');
const userData = app.getAppPath('userData');

const pricesDb = new DataSource({ filename: userData + "/storage/prices.db", autoload: true });
const studentsDb = new DataSource({ filename: userData + "/storage/students.db", autoload: true });