const depositList = document.getElementById('depositlist');

loadStudentsList();

function loadStudentsList() {
    studentsDb.find({}, (err, docs) => {
        if (err) {
            dialog.showErrorBox("Unable to show data.", "Unable to find students data.");
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

function reloadStudentsList() {
    depositList.innerHTML = "";
    studentsDb.loadDatabase((err) => {
        if (err) {
            dialog.showErrorBox("Unable to load new data.", "Unable to display new students data.");
            return;
        }

        loadStudentsList();
    });
}

ipcRenderer.on('data:update', (event, windowId) => {
    reloadStudentsList();
    reloadDebtsList(); // in debtTab.java

    switch (windowId) {
        case 'add':
            addWindow.close();
            break;
        case 'edit':
            editDepositWindow.close();
            break;
        case 'fine':
            fineWindow.close();
            break;
        case 'pay':
            payWindow.close(); // created in debtTab.java
            break;
    }
});

function createStudentRow(studentName, depositAmount) {
    const li = document.createElement("li");
    li.className = "collection-item";

    let row = document.createElement("div");
    row.className = "row valign-wrapper";

    let col1 = document.createElement("div");
    col1.className = "col s5";
    col1.appendChild(document.createTextNode(studentName));
    col1.addEventListener("dblclick", showRemoveConfirmation);

    let col2 = document.createElement("div");
    col2.className = "col s3";
    col2.appendChild(document.createTextNode("$" + depositAmount));

    let col3 = document.createElement("div");
    col3.className = "col s2";
    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.onclick = function() { createEditDepositWindow(studentName, depositAmount); };
    col3.appendChild(editButton);

    let col4 = document.createElement("div");
    col4.className = "col s2";
    const fineButton = document.createElement("button");
    fineButton.innerHTML = "Fine";
    fineButton.className = "red lighten-1"
    fineButton.onclick = function() { createFineWindow(studentName); };
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

function showRemoveConfirmation(event) {
    const name = event.target.innerHTML;

    dialog.showMessageBox(
        remote.getCurrentWindow(), {
            type: "question",
            buttons: ["Yes", "Cancel"],
            title: "Remove student",
            message: "Do you really want to remove " + name + "?"
        },
        (response) => {
            // Yes
            if (response === 0) {
                studentsDb.remove({ name: name });
                reloadStudentsList();
            }

        }
    );
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

function createFineWindow(name) {
    if (moreThanOneSecondaryWindows()) { return; }

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

    ipcRenderer.send('deposit:fine', name);

    // Garbage collection handle
    fineWindow.on('close', () => {
        fineWindow = null;
    });
}

function createEditDepositWindow(name, deposit) {
    if (moreThanOneSecondaryWindows()) { return; }

    editDepositWindow = new BrowserWindow({
        width: 350,
        height: 215,
        resizable: false,
        title: 'Edit Student'
    });
    // Load html into window
    editDepositWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'editDepositWindow.html'),
        protocol: 'file'
    }));

    ipcRenderer.send('deposit:edit', name, deposit);

    // Garbage collection handle
    editDepositWindow.on('close', () => {
        editDepositWindow = null;
    });
}

function moreThanOneSecondaryWindows() {
    if (BrowserWindow.getAllWindows().length > 1) {
        dialog.showErrorBox("Multiple windows error", "Please close all secondary windows before continue.")
        return true;
    }

    return false;
}