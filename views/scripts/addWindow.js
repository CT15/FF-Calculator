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

    isPresent(name, (present) => {
        if (present) {
            dialog.showErrorBox("Duplicate student name", "Student with name " + name + " already exists.");
            return;
        }
        saveStudent(name, deposit);
        ipcRenderer.send('data:update', 'add');
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
        deposit: Number(deposit),
        debt: 0
    }
    studentsDb.insert(newStudent);
}