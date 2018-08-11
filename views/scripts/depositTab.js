const electron = require('electron');
const { ipcRenderer } = electron;
const { BrowserWindow } = electron.remote;

const url = require('url');
const path = require('path');

const depositList = document.getElementById('depositlist');

ipcRenderer.on('deposit:add', (event, studentName, depositAmount) => {
    depositList.className = "collection";

    const li = document.createElement("li");
    li.className = "collection-item";

    const nameText = document.createTextNode(studentName);
    const depositText = document.createTextNode(depositAmount);

    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";

    const fineButton = document.createElement("button");
    fineButton.innerHTML = "Fine";
    fineButton.onclick = function() { createFineWindow() };

    [editButton, fineButton].forEach((button) => {
        button.className = "btn";
    });

    [nameText, depositText, editButton, fineButton].forEach((element) => {
        li.appendChild(element);
    });

    depositList.appendChild(li);

    addWindow.close();
});

function createAddDepositWindow() {
    // Create new window
    addWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Add New Student'
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    // Garbage collection handle
    addWindow.on('close', () => {
        addWindow = null;
    });
}

function createFineWindow() {
    fineWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Fine Student'
    });
    // Load html into window
    fineWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'fineWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    // Garbage collection handle
    fineWindow.on('close', () => {
        fineWindow = null;
    });
}