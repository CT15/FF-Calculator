const electron = require('electron');
const { ipcRenderer } = electron;
const { dialog } = electron.remote;
const Datastore = require('nedb');
const studentsDb = new Datastore({ filename: 'storage/students.db', autoload: true });

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    let name = document.querySelector('#name').value;
    const deposit = document.querySelector('#deposit').value;

    if (!name || !deposit) {
        dialog.showErrorBox({
            title: "Missing field(s)",
            message: "All fields must be filled."
        });
        return;
    }

    name = toTitleCase(name);

    isPresent(name, (present) => {
        if (present) {
            dialog.showErrorBox({
                title: "Duplicate student name",
                message: "Student with name " + name + " already exists."
            });
            return;
        }
        saveStudent(name, deposit);
        ipcRenderer.send('deposit:add');
    });
}

function isPresent(name, callback) {
    studentsDb.findOne({ name: name }, (err, doc) => {
        if (doc) { callback(true); } else { callback(false); }
    });
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function saveStudent(name, deposit) {
    const newStudent = {
        name: name,
        deposit: deposit
    }
    studentsDb.insert(newStudent);
}