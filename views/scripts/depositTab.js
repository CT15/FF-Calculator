const electron = require('electron');
const { ipcRenderer } = electron;
const { BrowserWindow, dialog } = electron.remote;

const url = require('url');
const path = require('path');

const DataSource = require('nedb');
const studentsDb = new DataSource({ filename: "storage/students.db", autoload: true });

const depositList = document.getElementById('depositlist');

loadStudentList();

function loadStudentList() {
    studentsDb.find({}, (err, docs) => {
        if (err) {
            dialog.showMessageBox({
                type: "error",
                title: "Unable to show data.",
                message: "Unable to find students data."
            });
            return;
        }

        docs.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        docs.forEach((student) => {
            createStudentRow(student.name, student.deposit);
        });
    });
}

ipcRenderer.on('deposit:add', (event) => {
    depositList.innerHTML = "";

    studentsDb.loadDatabase((err) => {
        if (err) {
            dialog.showMessageBox({
                type: "error",
                title: "Unable to load new data.",
                message: "Unable to display new students data."
            });
            return;
        }

        loadStudentList();
    });

    addWindow.close();
});

function createStudentRow(studentName, depositAmount) {
    const li = document.createElement("li");
    li.className = "collection-item";

    let row = document.createElement("div");
    row.className = "row valign-wrapper";

    let col1 = document.createElement("div");
    col1.className = "col s5";
    col1.appendChild(document.createTextNode(studentName));

    let col2 = document.createElement("div");
    col2.className = "col s3";
    col2.appendChild(document.createTextNode("$" + depositAmount));

    let col3 = document.createElement("div");
    col3.className = "col s2";
    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    col3.appendChild(editButton);

    let col4 = document.createElement("div");
    col4.className = "col s2";
    const fineButton = document.createElement("button");
    fineButton.innerHTML = "Fine";
    fineButton.className = "red lighten-1"
    fineButton.onclick = function() { createFineWindow() };
    col4.appendChild(fineButton);

    [editButton, fineButton].forEach((button) => {
        button.classList.add("btn");
    });

    [col1, col2, col3, col4].forEach((element) => {
        row.appendChild(element);
    });

    li.appendChild(row);

    depositList.appendChild(li);
}

function createAddDepositWindow() {
    // Create new window
    addWindow = new BrowserWindow({
        width: 350,
        height: 215,
        resizable: false,
        title: 'Add New Student'
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file'
    }));
    // Garbage collection handle
    addWindow.on('close', () => {
        addWindow = null;
    });
}

function createFineWindow() {
    fineWindow = new BrowserWindow({
        width: 350,
        height: 360,
        resizable: false,
        title: 'Fine Student'
    });
    // Load html into window
    fineWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'fineWindow.html'),
        protocol: 'file'
    }));
    // Garbage collection handle
    fineWindow.on('close', () => {
        fineWindow = null;
    });
}