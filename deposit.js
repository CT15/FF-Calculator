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
    const editText = document.createTextNode("Edit");
    editButton.appendChild(editText);

    const fineButton = document.createElement("button");
    const fineText = document.createTextNode("Fine");
    fineButton.appendChild(fineText);

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
        width: 300,
        height: 200,
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