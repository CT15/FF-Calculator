const electron = require('electron');
const { ipcRenderer } = electron;
const { dialog } = electron.remote;
const DataSource = require('nedb');
const studentsDb = new DataSource({ filename: 'storage/students.db', autoload: true });

let oldName;

ipcRenderer.on('deposit:edit', (event, name, deposit) => {
    oldName = name;
    document.getElementById('name').defaultValue = name;
    document.getElementById('deposit').defaultValue = deposit;
});

ipcRenderer.send('editDepositWindow-ready');

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    let name = document.querySelector('#name').value;
    let deposit = document.querySelector('#deposit').value;

    if (!name || !deposit) {
        dialog.showErrorBox("Missing field(s)", "All fields must be filled.");
        return;
    }

    name = toTitleCase(name);
    deposit = Number(deposit.replace(/^0+/, '')).toFixed(2);

    updateStudent(name, deposit);
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function updateStudent(name, deposit) {
    studentsDb.update({ name: oldName }, { name: name, deposit: deposit }, {},
        (err) => {
            if (err) {
                dialog.showErrorBox("Update failed", "An error occured. Unable to update student's data.");
            } else {
                ipcRenderer.send('deposit:update', 'edit');
            }
        });
}