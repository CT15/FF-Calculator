const electron = require('electron');
const { ipcRenderer } = electron;
const remote = electron.remote;
const { BrowserWindow, dialog } = remote;
const url = require('url');
const path = require('path');
const DataSource = require('nedb');